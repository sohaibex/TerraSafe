import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity("contacts")
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subject: string;


  @Column()
  phone: string;

  @Column()
  email: string;

  @Column("text")
  message: string;

  @ManyToOne(() => Property, property => property.contacts)
  @JoinColumn({ name: "property_id" })
  property: Property;
}
