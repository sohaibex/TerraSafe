import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DistrictRepository } from "../repositories/district.repository";
import { District } from "../entities/district.entity";
import { CreateDistrictDto } from "../dtos/district/district.request.dto";
import { DistrictResponseDto } from "../dtos/district/district.response.dto";

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: DistrictRepository
  ) {
  }

  private toResponseDto(district: District): DistrictResponseDto {
    return {
      id: district.id,
      cityId: district.city ? district.city.id : null,
      code: district.code,
      name: district.name,
      arabicName: district.arabicName
    };
  }

  private async findDistrictOrThrow(id: number): Promise<District> {
    const district = await this.districtRepository.findOne({ where: { id, deletedAt: null } });
    if (!district) throw new NotFoundException(`District with id ${id} not found`);
    return district;
  }

  async findAll(): Promise<DistrictResponseDto[]> {
    const districts = await this.districtRepository.find({ relations: ["city"], where: { deletedAt: null } });
    return districts.map(this.toResponseDto);
  }

  async findById(id: number): Promise<DistrictResponseDto> {
    const district = await this.findDistrictOrThrow(id);
    return this.toResponseDto(district);
  }

  async create(createDistrictDto: CreateDistrictDto): Promise<DistrictResponseDto> {
    const district = this.districtRepository.create(createDistrictDto);
    const savedDistrict = await this.districtRepository.save(district);
    return this.toResponseDto(savedDistrict);
  }

  async update(id: number, updateDistrictDto: CreateDistrictDto): Promise<DistrictResponseDto> {
    await this.findDistrictOrThrow(id);
    await this.districtRepository.update(id, updateDistrictDto);
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.districtRepository.softDelete(id);
  }

  async findDistrictsByCities(cityIds: number[]) {
    console.log("hhhhelllllooo eveyr");
    return await this.districtRepository
      .createQueryBuilder("district")
      .innerJoinAndSelect("district.city", "city") // Adjust according to your entity relationship
      .where("district.cityId IN (:...cityIds)", { cityIds }) // Filtering by cityId
      .getMany();
  }



}
