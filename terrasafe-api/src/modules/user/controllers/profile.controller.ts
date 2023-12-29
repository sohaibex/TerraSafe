// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { ProfileRequestDto } from '../dtos/profile/profile.request.dto';
// import { ProfileService } from "../services/profile.service";
// import { BasicProfileResponseDto } from "../dtos/profile/basicProfile.response.dto";
// import { ProfileResponseDto } from "../dtos/profile/profile.response.dto";
//
// @ApiTags('profiles')
// @Controller('profiles')
// export class ProfileController {
//   constructor(private readonly profileService: ProfileService) {}
//
//   @Get()
//   @ApiOperation({ summary: 'Get all profiles' })
//   @ApiResponse({ status: 200, type: [BasicProfileResponseDto] })
//   async findAll(): Promise<BasicProfileResponseDto[]> {
//     return this.profileService.findAll();
//   }
//
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a profile by ID' })
//   @ApiResponse({ status: 200, type: ProfileResponseDto })
//   async findOne(@Param('id') id: number): Promise<ProfileResponseDto> {
//     return this.profileService.findOne(id);
//   }
//
//   @Post()
//   @ApiOperation({ summary: 'Create a new profile' })
//   @ApiResponse({ status: 201, type: ProfileResponseDto })
//   async create(@Body() dto: ProfileRequestDto): Promise<ProfileResponseDto> {
//     return this.profileService.create(dto);
//   }
//
//   @Put(':id')
//   @ApiOperation({ summary: 'Update a profile by ID' })
//   @ApiResponse({ status: 200, type: ProfileResponseDto })
//   async update(@Param('id') id: number, @Body() dto: ProfileRequestDto): Promise<ProfileResponseDto> {
//     return this.profileService.update(id, dto);
//   }
//
//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a profile by ID' })
//   @ApiResponse({ status: 204 })
//   async delete(@Param('id') id: number): Promise<void> {
//     return this.profileService.delete(id);
//   }
// }
