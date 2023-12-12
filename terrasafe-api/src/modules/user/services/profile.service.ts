// import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Profile } from "../entities/profile.entity";
// import { ProfileRepository } from "../repositories/profile.repository";
// import { ProfileRequestDto } from "../dtos/profile/profile.request.dto";
// import { ProfileResponseDto } from "../dtos/profile/profile.response.dto";
// import { BasicProfileResponseDto } from "../dtos/profile/basicProfile.response.dto";
// import { PropertyService } from "./property.service";
// import { EntityNotFoundException } from "../../../exceptions/baseEntityException";
// import { Property } from "../entities/property.entity";
//
// @Injectable()
// export class ProfileService {
//   constructor(
//     @InjectRepository(Profile)
//     private readonly profileRepo: ProfileRepository
//     // @InjectRepository(Property)
//     // private readonly propertyService: PropertyService
//   ) {
//   }
//
//   async findAll(): Promise<BasicProfileResponseDto[]> {
//     const profiles = await this.profileRepo.find();
//     return profiles.map(profile => this.convertToBasicResponseDto(profile));
//   }
//
//   async findOne(id: number): Promise<ProfileResponseDto> {
//     if (!id) {
//       throw new EntityNotFoundException("Profile", id);
//     }
//
//     const profile = await this.profileRepo.findOneBy({ id });
//
//     if (!profile) {
//       throw new EntityNotFoundException("Profile", id);
//     }
//
//     return this.convertToResponseDto(profile);
//   }
//
//   async update(id: number, dto: ProfileRequestDto): Promise<ProfileResponseDto> {
//     if (!id) {
//       throw new NotFoundException("ID is not provided.");
//     }
//
//     const profile = await this.profileRepo.findOne({ where: { id } });
//
//     if (!profile) {
//       throw new EntityNotFoundException("Profile", id);
//     }
//
//     Object.assign(profile, dto);
//     await this.profileRepo.save(profile);
//     return this.convertToResponseDto(profile);
//   }
//
//   async create(dto: ProfileRequestDto): Promise<ProfileResponseDto> {
//     const profile = this.profileRepo.create(dto);
//     const savedProfile = await this.profileRepo.save(profile);
//     return this.convertToResponseDto(savedProfile);
//   }
//
//   async delete(id: number): Promise<void> {
//     const profile = await this.profileRepo.findOne({ where: { id } });
//     if (!profile) {
//       throw new EntityNotFoundException("Profile", id);
//     }
//     await this.profileRepo.remove(profile);
//   }
//
//   private async convertToResponseDto(profile: Profile): Promise<ProfileResponseDto> {
//     const properties = await profile.properties;
//     // const convertedProperties = await Promise.all(properties.map(property => this.propertyService.convertToResponseDto(property)));
//
//     return {
//       id: profile.id,
//       userId: profile.userId,
//       firstName: profile.firstName,
//       lastName: profile.lastName,
//       phoneNumber: profile.phoneNumber,
//       address: profile.address,
//       avatar: profile.avatar,
//       agencyName: profile.agencyName,
//       agencyDescription: profile.agencyDescription,
//       createdAt: profile.createdAt,
//       updatedAt: profile.updatedAt,
//       user: {
//         id: profile.user.id,
//         username: profile.user.username,
//         email: profile.user.email,
//         role: profile.user.role,
//         firebaseUid:profile.user.firebaseUid,
//         createdAt: profile.user.createdAt,
//         updatedAt: profile.user.updatedAt
//       },
//       properties: null
//     };
//   }
//
//
//   private convertToBasicResponseDto(profile: Profile): BasicProfileResponseDto {
//     return {
//       id: profile.id,
//       userId: profile.userId,
//       firstName: profile.firstName,
//       lastName: profile.lastName,
//       phoneNumber: profile.phoneNumber,
//       address: profile.address,
//       avatar: profile.avatar,
//       agencyName: profile.agencyName,
//       agencyDescription: profile.agencyDescription,
//       createdAt: profile.createdAt,
//       updatedAt: profile.updatedAt
//     };
//   }
// }
