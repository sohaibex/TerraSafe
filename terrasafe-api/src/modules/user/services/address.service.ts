import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "../entities/address.entity";
import { AddressResponseDto } from "../dtos/address/address.response.dto";
import { AddressRequestDto } from "../dtos/address/address.request.dto";
import { AddressRepository } from "../repositories/address.repository";
import { DistrictRepository } from "../repositories/district.repository";
import { District } from "../entities/district.entity";
import { City } from "../entities/city.entity";
import { CityRepository } from "../repositories/city.repository";
import { IsNull } from "typeorm";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: AddressRepository,
    @InjectRepository(District)
    private readonly districtRepo: DistrictRepository,
    @InjectRepository(City)
    private readonly cityRepo: CityRepository
  ) {
  }

  async findAll(): Promise<AddressResponseDto[]> {
    const addresses = await this.addressRepo.find({ relations: ["district", "district.city"] });
    addresses.forEach(address => {
      if (!address.district || !address.district.city) {
        console.log("Missing district or city for address ID:", address.id);
      }
    });
    return addresses.map(this.convertToResponseDto);
  }


  async findById(id: number): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations: ["district", "district.city"]
    });
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    console.log("Fetched address:", JSON.stringify(address, null, 2));

    return this.convertToResponseDto(address);
  }


  async create(dto: AddressRequestDto): Promise<AddressResponseDto> {
    // Ensure district ID is passed and is a number
    const districtId = Number(dto.districtId);
    if (!districtId) {
      throw new NotFoundException(`District ID must be provided`);
    }

    // Find the district
    const district = await this.districtRepo.findOne({ where: { id: districtId } });
    if (!district) {
      throw new NotFoundException(`District with id ${dto.districtId} not found`);
    }

    // Create and save the address
    const address = this.addressRepo.create();
    address.district = district;
    address.address = dto.address;
    address.aptSuite = dto.aptSuite;
    address.zip = dto.zip;
    const savedAddress = await this.addressRepo.save(address);

    return this.convertToResponseDto(savedAddress);
  }

  async update(id: number, dto: AddressRequestDto): Promise<AddressResponseDto> {
    const districtId = Number(dto.districtId);
    if (!districtId) {
      throw new NotFoundException(`District ID must be provided`);
    }

    const district = await this.districtRepo.findOne({ where: { id: districtId } });
    if (!district) {
      throw new NotFoundException(`District with id ${dto.districtId} not found`);
    }

    const address = await this.addressRepo.findOne({
      where: { id, deletedAt: IsNull() }
    });
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    // Update properties
    address.district = district;
    address.address = dto.address;
    address.aptSuite = dto.aptSuite;
    address.zip = dto.zip;

    const updatedAddress = await this.addressRepo.save(address);

    return this.convertToResponseDto(updatedAddress);
  }

  async softDelete(id: number): Promise<void> {
    await this.addressRepo.softDelete(id);
  }

  private convertToResponseDto(address: Address): AddressResponseDto {
    return {
      id: address.id,
      cityName: address.district?.city?.name || "Unknown",
      cityId: address.district?.city?.code || -1, // or any default value
      districtId: address.district?.id || -1, // or any default value
      districtName: address.district?.name || "Unknown",
      address: address.address,
      zip: address.zip,
      aptSuite: address.aptSuite
    };
  }

}