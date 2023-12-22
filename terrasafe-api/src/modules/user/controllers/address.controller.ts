import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from "@nestjs/common";
import { AddressService } from "../services/address.service";
import { AddressResponseDto } from "../dtos/address/address.response.dto";
import { AddressRequestDto } from "../dtos/address/address.request.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam
} from "@nestjs/swagger";

@ApiTags("addresses")
@Controller("addresses")
export class AddressController {
  constructor(private readonly addressService: AddressService) {
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all addresses" })
  @ApiResponse({ status: 200, description: "List of addresses", type: [AddressResponseDto] })
  async findAll(): Promise<AddressResponseDto[]> {
    return this.addressService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve an address by ID" })
  @ApiResponse({ status: 200, description: "A single address", type: AddressResponseDto })
  @ApiParam({ name: "id", description: "ID of the address" })
  async findById(@Param("id") id: number): Promise<AddressResponseDto> {
    return this.addressService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new address" })
  @ApiResponse({ status: 201, description: "The created address", type: AddressResponseDto })
  @ApiBody({ type: AddressRequestDto })
  async create(@Body() dto: AddressRequestDto): Promise<AddressResponseDto> {
    return this.addressService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an address by ID" })
  @ApiResponse({ status: 200, description: "The updated address", type: AddressResponseDto })
  @ApiParam({ name: "id", description: "ID of the address" })
  @ApiBody({ type: AddressRequestDto })
  async update(@Param("id") id: number, @Body() dto: AddressRequestDto): Promise<AddressResponseDto> {
    return this.addressService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an address by ID" })
  @ApiResponse({ status: 200, description: "Address deletion result" })
  @ApiParam({ name: "id", description: "ID of the address" })
  async delete(@Param("id") id: number): Promise<void> {
    return this.addressService.softDelete(id);
  }
}
