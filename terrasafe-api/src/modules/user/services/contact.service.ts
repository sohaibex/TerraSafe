import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "../entities/contact.entity";
import { ContactRepository } from "../repositories/contact.repository";
import { ContactRequestDto } from "../dtos/contact/contact.request.dto";
import { ContactResponseDto } from "../dtos/contact/contact.response.dto";
import { PropertyService } from "./property.service";
import { ContactUsRequestDto } from "../dtos/contact/contact-us.request.dto";

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: ContactRepository,
    private readonly propertyService: PropertyService
  ) {
  }

  // async createContact(dto: ContactRequestDto): Promise<ContactResponseDto> {
  //   const contact = this.contactRepo.create(dto);
  //   const savedContact = await this.contactRepo.save(contact);
  //   return this.mapToResponseDto(savedContact);
  // }
  async createContact(dto: ContactRequestDto): Promise<ContactResponseDto> {
    // Fetch the Property entity using the PropertyService
    const property = await this.propertyService.findEntityById(dto.propertyId);
    if (!property) {
      throw new BadRequestException(`Property with ID ${dto.propertyId} not found`);
    }

    const contact = new Contact();
    contact.name = dto.name;
    contact.phone = dto.phone;
    contact.email = dto.email;
    contact.message = dto.message;
    contact.property = property;

    const savedContact = await this.contactRepo.save(contact);
    return this.mapToResponseDto(savedContact);

  }

  async getAllContacts(): Promise<ContactResponseDto[]> {
    const contacts = await this.contactRepo.find({ where: { deletedAt: null } });
    return contacts.map(this.mapToResponseDto);
  }

  async getContactById(id: number): Promise<ContactResponseDto> {
    const contact = await this.findContactById(id);
    return this.mapToResponseDto(contact);
  }

  async updateContact(id: number, updateDto: ContactRequestDto): Promise<ContactResponseDto> {
    const contact = await this.findContactById(id);

    Object.assign(contact, updateDto);

    const updatedContact = await this.contactRepo.save(contact);
    return this.mapToResponseDto(updatedContact);
  }

  async deleteContact(id: number): Promise<void> {
    const contact = await this.findContactById(id);

    contact.deletedAt = new Date();
    await this.contactRepo.save(contact);
  }

  private async findContactById(id: number): Promise<Contact> {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async getContactsByUserId(userId: number): Promise<ContactResponseDto[]> {
    const contacts = await this.contactRepo.createQueryBuilder("contact")
      .innerJoinAndSelect("contact.property", "property")
      .innerJoin("property.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("contact.deletedAt IS NULL")
      .getMany();

    if (!contacts || contacts.length === 0) {
      return [];  // Return an empty array if no contacts found
    }

    return contacts.map(this.mapToResponseDto);
  }

  async createContactUsRequest(dto: ContactUsRequestDto): Promise<ContactResponseDto> {
    const contact = new Contact();
    contact.name = dto.name;
    contact.phone = dto.phone;
    contact.email = dto.email;
    contact.subject = dto.subject;
    contact.message = dto.message;

    const savedContact = await this.contactRepo.save(contact);
    return this.mapToResponseDto(savedContact);
  }

  private mapToResponseDto(contact: Contact): ContactResponseDto {
    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      propertyId: contact.property?.id,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    };
  }
}
