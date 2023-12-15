import { Body, Controller, Get, Param, Post, Put, Res } from "@nestjs/common";
import { ContactService } from "../services/contact.service";
import { ContactRequestDto } from "../dtos/contact/contact.request.dto";
import { ContactResponseDto } from "../dtos/contact/contact.response.dto";
import * as nodemailer from "nodemailer";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PropertyService } from "../services/property.service";
import { ContactUsRequestDto } from "../dtos/contact/contact-us.request.dto";

@ApiTags("contacts")
@Controller("contacts")
export class ContactController {
  constructor(private readonly contactService: ContactService, private readonly propertyService: PropertyService) {
  }

  @Post()
  @ApiOperation({ summary: "Create a new contact" })
  @ApiResponse({ status: 201, description: "Contact created successfully.", type: ContactResponseDto })
  @ApiBody({ type: ContactRequestDto })
  async createContact(@Body() dto: ContactRequestDto): Promise<ContactResponseDto> {
    const response = await this.contactService.createContact(dto);
    const property = await this.propertyService.findOne(dto.propertyId);

    if (!property) {
      console.error("Property not found for ID:", dto.propertyId);
      return response;
    }

    if (!property.user || !property.user.email) {
      console.error("User or user email not found for property ID:", dto.propertyId);
      return response;
    }

    if (response) {
      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "03d4d0e59a1cc6",
          pass: "cc97c70ed447a1"
        }
      });

      const mailOptions = {
        from: dto.email,
        to: property.user.email,
        subject: `[MLR] contact : ${property.title}]`,
        text: dto.message + " " + "this email is sent from mylittleroof.com"
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    return response;
  }


  @Get()
  @ApiOperation({ summary: "Retrieve all contacts" })
  @ApiResponse({ status: 200, description: "List of all contacts", type: [ContactResponseDto] })
  async getAllContacts(): Promise<ContactResponseDto[]> {
    return await this.contactService.getAllContacts();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a contact by ID" })
  @ApiResponse({ status: 200, description: "Contact details", type: ContactResponseDto })
  @ApiParam({ name: "id", description: "ID of the contact to retrieve" })
  async getContactById(@Param("id") id: number): Promise<ContactResponseDto> {
    return await this.contactService.getContactById(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a contact by ID" })
  @ApiResponse({ status: 200, description: "Updated contact details", type: ContactResponseDto })
  @ApiParam({ name: "id", description: "ID of the contact to update" })
  @ApiBody({ type: ContactRequestDto })
  async updateContact(@Param("id") id: number, @Body() dto: ContactRequestDto): Promise<ContactResponseDto> {
    return await this.contactService.updateContact(id, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a contact by ID" })
  @ApiResponse({ status: 200, description: "Updated contact details", type: ContactResponseDto })
  @ApiParam({ name: "id", description: "ID of the contact to update" })
  @ApiBody({ type: ContactRequestDto })
  async deleteContact(@Param("id") id: number): Promise<void> {
    return await this.contactService.deleteContact(id);
  }


  @Get("/user/:userId")
  @ApiOperation({ summary: "Get contacts by user ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 200, description: "List of contacts by user ID or empty list", type: [ContactResponseDto] })
  async getContactsByUserId(@Param("userId") userId: number, @Res() res: any): Promise<any> {
    const contacts = await this.contactService.getContactsByUserId(userId);
    return res.status(200).json(contacts);
  }

  @Post("/contact-us")
  @ApiOperation({ summary: "Send a contact us message" })
  @ApiResponse({ status: 200, description: "Message sent successfully" })
  @ApiBody({ type: ContactUsRequestDto })
  async sendContactUsMessage(@Body() dto: ContactUsRequestDto): Promise<{ message: string }> {
    const savedContact = await this.contactService.createContactUsRequest(dto);
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "03d4d0e59a1cc6",
        pass: "cc97c70ed447a1"
      }
    });

    const mailOptions = {
      from: dto.email,
      to: "admin@mylittleroof.com",
      subject: `[MLR] contact : ${dto.subject}]`,
      text: `Name: ${dto.name}\nEmail: ${dto.email}\nPhone: ${dto.phone}\nMessage: ${dto.message}\nthis email is sent from mylittleroof.com`
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return { message: "Your message has been sent successfully." };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send message.");
    }
  }
}
