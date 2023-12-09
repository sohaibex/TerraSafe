import { ApiProperty } from "@nestjs/swagger";

export class DistrictResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  code: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  arabicName: string;
}
