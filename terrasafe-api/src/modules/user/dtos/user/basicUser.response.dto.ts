import { ApiProperty } from "@nestjs/swagger";

export class BasicUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  agencyName?: string;

  @ApiProperty()
  ice?: string;

  @ApiProperty()
  agencyDescription?: string;


  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
