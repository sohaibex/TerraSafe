import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { UserRole } from "../../../../utils/enums/useRoles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

  @ApiProperty()
  @IsOptional()
  firebaseUid?: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;


  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  agencyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ice: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  stripeCustomerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  agencyDescription?: string;
}
