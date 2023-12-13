import { Body, Controller, Post } from "@nestjs/common";
import { FirebaseService } from "../services/firebase.service";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user/create-user.request.dto";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UpdatePasswordDto } from "../dtos/user/updatePassword.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService
  ) {
  }

  @Post("register")
  @ApiCreatedResponse({ description: "Successfully registered new user." })
  @ApiBadRequestResponse({ description: "Failed to register user." })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() registerUserDto: CreateUserDto) {
    const firebaseUser = await this.firebaseService.register(
      registerUserDto.email,
      registerUserDto.password,
      registerUserDto
    );

    if (!firebaseUser) {
      throw new Error("Failed to save user to the database.");
    }

    return firebaseUser;
  }

  @Post("login")
  @ApiOkResponse({ description: "Successfully authenticated user." })
  @ApiBadRequestResponse({ description: "Failed to authenticate user." })
  @ApiBody({ type: CreateUserDto })
  async login(@Body() loginUserDto: CreateUserDto) {
    // Authenticate user with Firebase
    const firebaseUser = await this.firebaseService.signIn(loginUserDto.email);

    if (!firebaseUser) {
      throw new Error("Failed to authenticate user with Firebase.");
    }

    // Check if the user exists in our app's database
    const user = await this.userService.findUserByIdOrUid(loginUserDto.email);

    if (!user) {
      throw new Error("User does not exist in the application database.");
    }

    return user;
  }


  @Post("update-password")
  @ApiOkResponse({ description: "Successfully updated user password." })
  @ApiBadRequestResponse({ description: "Failed to update user password." })
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const user = await this.firebaseService.signIn(updatePasswordDto.email);
    if (!user) {
      throw new Error("User not found.");
    }
    await this.firebaseService.updatePassword(user.uid, updatePasswordDto.password);
    return { message: "Password updated successfully" };
  }

}
