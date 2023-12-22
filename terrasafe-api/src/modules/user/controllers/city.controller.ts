import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CityService } from "../services/city.service";
import { CityResponseDto } from "../dtos/city/city.response.dto";
import { CreateCityDto } from "../dtos/city/city.request.dto";

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'Return all cities.' })
  findAll(): Promise<CityResponseDto[]> {
    return this.cityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, description: 'Return the city.' })
  findById(@Param('id') id: number): Promise<CityResponseDto> {
    return this.cityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new city' })
  @ApiResponse({ status: 201, description: 'The city has been successfully created.' })
  create(@Body() createCityDto: CreateCityDto): Promise<CityResponseDto> {
    return this.cityService.create(createCityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a city' })
  @ApiResponse({ status: 200, description: 'The city has been successfully updated.' })
  update(
    @Param('id') id: number,
    @Body() updateCityDto: CreateCityDto,
  ): Promise<CityResponseDto> {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a city' })
  @ApiResponse({ status: 204, description: 'The city has been soft deleted.' })
  softDelete(@Param('id') id: number): Promise<void> {
    return this.cityService.softDelete(id);
  }
}
