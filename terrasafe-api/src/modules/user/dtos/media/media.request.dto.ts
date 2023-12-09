import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MediaRequestDto {

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: ["images", "attachments", "floorPlans"] })
  @IsEnum(["images", "attachments", "floorPlans"])
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

}
