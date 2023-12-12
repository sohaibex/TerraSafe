import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { City } from "../entities/city.entity";
import { CityRepository } from "../repositories/city.repository";
import { CreateCityDto } from "../dtos/city/city.request.dto";


@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: CityRepository
  ) {
  }


  findAll(): Promise<City[]> {
    return this.citiesRepository.find({ where: { deletedAt: null } });
  }

  async findOne(id: number): Promise<City> {

    const city = await this.citiesRepository.findOne({ where: { id, deletedAt: null } });
    if (!city) {
      throw new NotFoundException(`City with code ${id} not found`);
    }
    return city;
  }

  async create(createCityDto: CreateCityDto): Promise<City> {
    const newCity = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(newCity);
  }

  async update(id: number, updateCityDto: CreateCityDto): Promise<City> {
    await this.findOne(id);
    await this.citiesRepository.update(id, updateCityDto);
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<void> {
    const city = await this.findOne(id);
    await this.citiesRepository.softDelete(city.id);
  }
}
