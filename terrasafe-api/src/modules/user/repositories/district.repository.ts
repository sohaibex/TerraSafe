import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { District } from "../entities/district.entity";

@Injectable()
export class DistrictRepository extends Repository<District> {
}
