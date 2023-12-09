import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Contact } from "../entities/contact.entity";

@Injectable()
export class ContactRepository extends Repository<Contact> {
}
