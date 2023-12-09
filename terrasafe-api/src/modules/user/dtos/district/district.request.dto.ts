import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDistrictDto {
  @ApiProperty()
  @IsNumber()
  cityId: number;

  @ApiProperty()
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  arabicName: string;
}
