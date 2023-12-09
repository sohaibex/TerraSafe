import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty()
  code: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  arabicName: string;
}
