import { Injectable } from "@nestjs/common";
import { Address } from "../entities/address.entity";
import { Repository } from "typeorm";

@Injectable()
export class AddressRepository extends Repository<Address> {
}
