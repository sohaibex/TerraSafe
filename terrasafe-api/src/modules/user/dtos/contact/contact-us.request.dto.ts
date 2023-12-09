import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class ContactUsRequestDto {
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

}
