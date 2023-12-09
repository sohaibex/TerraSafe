import { UserRole } from "../../../../utils/enums/useRoles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firebaseUid: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  ice?: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  agencyName?: string;

  @ApiProperty()
  agencyDescription?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
