import { Injectable } from "@nestjs/common";
import { Media } from "../entities/media.entity";
import { MediaRepository } from "../repositories/media.repository";
import { MediaResponseDto } from "../dtos/media/media.response.dto";
import { EntityNotFoundException } from "../../../exceptions/baseEntityException";
import { InjectRepository } from "@nestjs/typeorm";
import { MediaRequestDto } from "../dtos/media/media.request.dto";


@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: MediaRepository
  ) {
  }

  async findAll(): Promise<MediaResponseDto[]> {
    const mediaList = await this.mediaRepo.find({ where: { deletedAt: null } });
    return mediaList.map(media => this.convertToResponseDto(media));
  }

  async findOne(id: number): Promise<MediaResponseDto> {
    const media = await this.mediaRepo.findOne({ where: { id, deletedAt: null } });
    if (!media) {
      throw new EntityNotFoundException("Media", id);
    }
    return this.convertToResponseDto(media);
  }

  async create(dto: MediaRequestDto): Promise<MediaResponseDto> {
    const media = this.mediaRepo.create(dto);
    const savedMedia = await this.mediaRepo.save(media);
    return this.convertToResponseDto(savedMedia);
  }

  async update(id: number, dto: MediaRequestDto): Promise<MediaResponseDto> {
    const media = await this.mediaRepo.findOne({ where: { id, deletedAt: null } });
    if (!media) {
      throw new EntityNotFoundException("Media", id);
    }
    Object.assign(media, dto);
    const updatedMedia = await this.mediaRepo.save(media);
    return this.convertToResponseDto(updatedMedia);
  }

  async softDelete(id: number): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id, deletedAt: null } });
    if (!media) {
      throw new EntityNotFoundException("Media", id);
    }
    media.deletedAt = new Date();
    await this.mediaRepo.save(media);
  }

  private convertToResponseDto(media: Media): MediaResponseDto {
    const uploadedBy = media.uploadedBy ? {
      id: media.uploadedBy.id,
      username: media.uploadedBy.username,
      email: media.uploadedBy.email,
      role: media.uploadedBy.role,
      createdAt: media.uploadedBy.createdAt,
      updatedAt: media.uploadedBy.updatedAt
    } : null;

    return {
      id: media.id,
      url: media.url,
      type: media.type,
      description: media.description,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
      uploadedBy:media.uploadedBy
    };
  }
}