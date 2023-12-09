import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserRole } from "../../../utils/enums/useRoles.enum";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Property } from "./property.entity";
import { Payment } from "./payment.entity";


@Entity("users")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ length: 200 })
  username: string;

  @Unique(["email"])
  @Column()
  email: string;

  @Unique(["ice"])
  @Column({ nullable: true })
  ice?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;


  @Column({ nullable: true })
  fullName?: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  avatar?: string; // This will store the Firebase URL for the avatar media

  @Column({ nullable: true })
  agencyName?: string;

  @Column({ nullable: true })
  agencyDescription?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @OneToMany(() => Property, property => property.user)
  properties: Promise<Property[]>;

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];
}
