import { ApiProperty } from "@nestjs/swagger";
import { BasicUserResponseDto } from "../user/basicUser.response.dto";
import { UserResponseDto } from "../user/user-created.response.dto";

export class MediaResponseDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: () => UserResponseDto })
  uploadedBy: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
