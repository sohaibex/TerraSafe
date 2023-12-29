import {
  Controller, Get, Post, Put, Delete, Param, Body, NotFoundException,
  HttpCode, HttpStatus, UseGuards
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user/create-user.request.dto";
import {
  ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse,
  ApiBody, ApiParam, ApiNoContentResponse, ApiOperation
} from "@nestjs/swagger";
import { UserResponseDto } from "../dtos/user/user-created.response.dto";
import { FirebaseAuthGuard } from "../../../guards/firebase-auth.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(FirebaseAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all users" })
  @ApiOkResponse({ description: "List all users", type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a user by ID" })
  @ApiOkResponse({ description: "Get a user by id", type: UserResponseDto })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiParam({ name: "id", description: "ID of the user" })
  async findById(@Param("id") id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get("find/:idOrUid")
  @ApiOperation({ summary: "Retrieve a user by ID or Firebase UID" })
  @ApiOkResponse({ description: "Get a user by id or Firebase UID", type: UserResponseDto })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiParam({ name: "idOrUid", description: "ID or Firebase UID of the user" })
  async findByIdOrUid(@Param("idOrUid") idOrUid: number | string): Promise<UserResponseDto> {
    return this.userService.findUserByIdOrUid(idOrUid);
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiCreatedResponse({ description: "Create a new user", type: UserResponseDto })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user details by ID" })
  @ApiOkResponse({ description: "Update an existing user", type: UserResponseDto })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiParam({ name: "id", description: "ID of the user to update" })
  @ApiBody({ type: CreateUserDto }) // Using the same DTO for updating for simplicity.
  async update(@Param("id") id: number, @Body() updateUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user by ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: "User successfully deleted" })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiParam({ name: "id", description: "ID of the user to delete" })
  async delete(@Param("id") id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
