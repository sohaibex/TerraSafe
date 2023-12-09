import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddressRequestDto {

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  aptSuite?: string;

  @ApiProperty()
  @IsString()
  zip: string;

  @ApiProperty()
  @IsNumber()
  districtId: number;
}
