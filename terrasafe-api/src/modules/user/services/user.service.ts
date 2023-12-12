import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserResponseDto } from "../dtos/user/user-created.response.dto";
import { CreateUserDto } from "../dtos/user/create-user.request.dto";
import { EntityNotFoundException } from "../../../exceptions/baseEntityException";
import { FindOneOptions } from "typeorm";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => FirebaseService))
    private firebaseService: FirebaseService
  ) {
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(this.entityToDto);
  }

  // async findOne(id: number): Promise<UserResponseDto> {
  //   const user = await this.findUserById(id);
  //   return this.entityToDto(user);
  // }
  async findUserByIdOrUid(idOrUid: number | string): Promise<User> {
    let findCondition: FindOneOptions<User>;
    console.log("*************UIIIIIIDDDDDD Before !**************", idOrUid);
    if (typeof idOrUid === "number") {
      findCondition = { where: { id: idOrUid } };
    } else if (typeof idOrUid === "string") {
      console.log("*************UIIIIIIDDDDDD**************", idOrUid);
      findCondition = { where: { firebaseUid: idOrUid } };
    } else {
      throw new Error(`Invalid input: type=${typeof idOrUid}, value=${idOrUid}`);
    }


    return this.userRepository.findOne(findCondition);
  }

  async findOne(idOrUid: number | string): Promise<UserResponseDto> {
    const user = await this.findUserByIdOrUid(idOrUid);
    if (!user) {
      throw new Error("User not found");
    }
    return this.entityToDto(user);
  }


  // async create(dto: CreateUserDto): Promise<UserResponseDto> {
  //   const user = this.userRepository.create(dto);
  //   const savedUser = await this.userRepository.save(user);
  //   return this.entityToDto(savedUser);
  // }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(user);
      return this.entityToDto(savedUser);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new NotFoundException("Error creating user");
    }
  }

  async update(id: number, dto: CreateUserDto): Promise<UserResponseDto> {
    await this.findUserById(id); // Ensure user exists
    await this.userRepository.update(id, dto);
    const updatedUser = await this.findUserById(id);
    return this.entityToDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);
  }

  private async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new EntityNotFoundException("User", id);
    }
    return user;
  }

  // async findByStripeCustomerId(stripeCustomerId: string, registerUserDto: CreateUserDto): Promise<User> {
  //   console.log("****custumer id *** ", stripeCustomerId);
  //   let user = await this.userRepository.findOne({ where: { stripeCustomerId } });
  //   let email = registerUserDto.email;
  //   if (!user && email) {
  //     // Register the user in Firebase with a random password.
  //     const randomPassword = Math.random().toString(36).slice(-8); // or any other random password generation method you prefer
  //     await this.firebaseService.register(email, randomPassword, registerUserDto); // Here, you might want to pass other details to Firebase if needed
  //     user.stripeCustomerId = stripeCustomerId;
  //     user = await this.userRepository.findOne({ where: { email } });
  //   } else if (!user) {
  //     throw new NotFoundException(`User with Stripe Customer ID ${stripeCustomerId} not found and email is not provided`);
  //   }
  //   return user;
  // }

  async findByStripeCustomerId(stripeCustomerId: string, registerUserDto: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({ where: { stripeCustomerId } });
    let email = registerUserDto.email;

    if (!user && email) {
      // Check if a user with the given email already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });

      if (existingUser) {
        // Update the existing user with the Stripe Customer ID and return
        existingUser.stripeCustomerId = stripeCustomerId;
        user = await this.userRepository.save(existingUser);
      } else {
        // Register the user in Firebase with a random password.
        const randomPassword = Math.random().toString(36).slice(-8); // or any other random password generation method you prefer
        await this.firebaseService.register(email, randomPassword, registerUserDto); // Here, you might want to pass other details to Firebase if needed

        user = await this.userRepository.findOne({ where: { email } });

        // Update the user record with the Stripe Customer ID
        user.stripeCustomerId = stripeCustomerId;
        await this.userRepository.save(user);
      }
    } else if (!user) {
      throw new NotFoundException(`User with Stripe Customer ID ${stripeCustomerId} not found and email is not provided`);
    }

    return user;
  }


  private entityToDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.agencyName = user.agencyName;
    dto.ice = user.ice;
    dto.email = user.email;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
