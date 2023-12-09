import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class ContactRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  subject: string;


  @IsNotEmpty()
  @IsString()
  message: string;


  @IsInt()
  propertyId: number;
}
