import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { City } from "../entities/city.entity";

@Injectable()
export class CityRepository extends Repository<City> {
}
