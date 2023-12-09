import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertyController } from "./controllers/property.controller";
import { PropertyService } from "./services/property.service";
import { UserService } from "./services/user.service";
import { Property } from "./entities/property.entity";
import { PropertyRepository } from "./repositories/property.repository";
import { UserRepository } from "./repositories/user.repository";
import { AddressController } from "./controllers/address.controller";
import { AddressService } from "./services/address.service";
import { AddressRepository } from "./repositories/address.repository";
import { Address } from "./entities/address.entity";
// import { Profile } from "./entities/profile.entity";
import { PropertyType } from "./entities/propertyType.entity";
import { Media } from "./entities/media.entity";
import { Exterior } from "./entities/exterior.entity";
import { MediaController } from "./controllers/media.controller";
import { ExteriorController } from "./controllers/exterior.controller";
import { MediaRepository } from "./repositories/media.repository";
import { ExteriorService } from "./services/exterior.service";
import { ExteriorRepository } from "./repositories/exterior.repository";
import { PropertyTypeRepository } from "./repositories/propertyType.repository";
import { PropertyTypeService } from "./services/propertyType.service";
import { AuthController } from "./controllers/auth.controller";
import { PropertyTypeController } from "./controllers/propertyType.controller";
import { MediaService } from "./services/media.service";
import { Contact } from "./entities/contact.entity";
import { ContactService } from "./services/contact.service";
import { ContactRepository } from "./repositories/contact.repository";
import { ContactController } from "./controllers/contact.controller";
import { Pricing } from "./entities/pricing.entity";
import { Payment } from "./entities/payment.entity";
import { PaymentController } from "./controllers/payement.controller";
import { PricingController } from "./controllers/pricing.controller";
import { PricingService } from "./services/pricing.service";
import { PaymentService } from "./services/payement.service";
import { PricingRepository } from "./repositories/pricing.repository";
import { PaymentRepository } from "./repositories/payment.repository";
import { FirebaseRepository } from "./repositories/firebase.repository";
import { FirebaseService } from "./services/firebase.service";
import { FirebaseAdminService } from "../../config/firebase-admin.service";
import { City } from "./entities/city.entity";
import { District } from "./entities/district.entity";
import { CityRepository } from "./repositories/city.repository";
import { DistrictRepository } from "./repositories/district.repository";
import { CityService } from "./services/city.service";
import { DistrictService } from "./services/district.service";
import { CityController } from "./controllers/city.controller";
import { DistrictController } from "./controllers/district.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Property, Address, PropertyType, Media, Exterior, Contact, Pricing, Payment, City, District])
  ],
  controllers: [UserController, PropertyController, AddressController, MediaController, ExteriorController, AuthController, PropertyTypeController, ContactController, PaymentController, PricingController, CityController, DistrictController],
  providers: [FirebaseAdminService, UserService, UserRepository, PropertyService, ExteriorService, MediaService, PropertyTypeService, FirebaseService, ContactService, PricingService, PaymentService,
    CityRepository, DistrictRepository, PropertyRepository, AddressRepository, CityService, DistrictService, AddressService, ExteriorRepository, MediaRepository, PropertyTypeRepository, FirebaseRepository, ContactRepository, PricingRepository, PaymentRepository
  ],
  exports: [FirebaseAdminService, UserService, PropertyService, AddressService, CityService, DistrictService, ExteriorService, MediaService, ContactService, PricingService, PaymentService, FirebaseService]
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes();
  }
}