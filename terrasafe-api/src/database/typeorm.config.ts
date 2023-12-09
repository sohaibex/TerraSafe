import { DataSource } from "typeorm";
import { User } from "../modules/user/entities/user.entity";
import { Property } from "../modules/user/entities/property.entity";
import { Exterior } from "../modules/user/entities/exterior.entity";
import { Media } from "../modules/user/entities/media.entity";
import { PropertyType } from "../modules/user/entities/propertyType.entity";
import { Address } from "../modules/user/entities/address.entity";
import { Contact } from "../modules/user/entities/contact.entity";
import { Pricing } from "../modules/user/entities/pricing.entity";
import { Payment } from "../modules/user/entities/payment.entity";
import { City } from "../modules/user/entities/city.entity";
import { District } from "../modules/user/entities/district.entity";
import { config } from "dotenv";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
config({ path: envFile });
console.log("*********************************Hi**********************************");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

console.log("*********************************Hi**********************************");
export default new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Property, Exterior, Media, PropertyType, Address, Contact, Pricing, Payment, City, District],
  synchronize: false,
  logging: true,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: "migrations"
} as any);
