import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DistrictService } from "../services/district.service";
import { DistrictResponseDto } from "../dtos/district/district.response.dto";
import { CreateDistrictDto } from "../dtos/district/district.request.dto";
import { District } from "../entities/district.entity";


@ApiTags("districts")
@Controller("districts")
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {
  }

  @Get()
  @ApiOperation({ summary: "Get all districts" })
  @ApiResponse({ status: 200, description: "Return all districts.", type: [DistrictResponseDto] })
  findAll(): Promise<DistrictResponseDto[]> {
    return this.districtService.findAll();
  }

  @Get("cities")
  @ApiOperation({ summary: "Get districts by multiple city IDs" })
  @ApiResponse({
    status: 200,
    description: "List of districts for the specified city IDs",
    type: District,
    isArray: true
  })
  async findDistrictsByCityIds(@Query("cityIds", new ParseArrayPipe({
    items: Number,
    separator: ",",
    optional: true
  })) cityIds: number[]): Promise<District[]> {
    return this.districtService.findDistrictsByCities(cityIds);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get district by ID" })
  @ApiResponse({ status: 200, description: "Return the district.", type: DistrictResponseDto })
  findById(@Param("id") id: number): Promise<DistrictResponseDto> {
    return this.districtService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Create new district" })
  @ApiResponse({ status: 201, description: "The district has been successfully created.", type: DistrictResponseDto })
  create(@Body() createDistrictDto: CreateDistrictDto): Promise<DistrictResponseDto> {
    return this.districtService.create(createDistrictDto);
  }

  @Put(":id")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Update a district" })
  @ApiResponse({ status: 200, description: "The district has been successfully updated.", type: DistrictResponseDto })
  update(
    @Param("id") id: number,
    @Body() updateDistrictDto: CreateDistrictDto
  ): Promise<DistrictResponseDto> {
    return this.districtService.update(id, updateDistrictDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a district" })
  @ApiResponse({ status: 200, description: "The district has been successfully deleted." })
  remove(@Param("id") id: number): Promise<void> {
    return this.districtService.softDelete(id);
  }

}
