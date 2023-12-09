import { Injectable } from "@nestjs/common";
import { Media } from "../entities/media.entity";
import { Repository } from "typeorm";

@Injectable()
export class MediaRepository extends Repository<Media> {
}
