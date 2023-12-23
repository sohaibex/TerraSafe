import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MediaResponseDto } from "../dtos/media/media.response.dto";
import { MediaService } from "../services/media.service";
import { MediaRequestDto } from "../dtos/media/media.request.dto";

@ApiTags("medias")
@Controller("medias")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {
  }

  @Get()
  @ApiOperation({ summary: "Get all images" })
  @ApiResponse({ status: 200, type: [MediaResponseDto] })
  async findAll(): Promise<MediaResponseDto[]> {
    return this.mediaService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an media by ID" })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async findOne(@Param("id") id: number): Promise<MediaResponseDto> {
    return this.mediaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new media" })
  @ApiResponse({ status: 201, type: MediaResponseDto })
  async create(@Body() dto: MediaRequestDto): Promise<MediaResponseDto> {
    return this.mediaService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an media by ID" })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async update(@Param("id") id: number, @Body() dto: MediaRequestDto): Promise<MediaResponseDto> {
    return this.mediaService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete an media by ID" })
  @ApiResponse({ status: 204 })
  async softDelete(@Param("id") id: number): Promise<void> {
    return this.mediaService.softDelete(id);
  }
}
