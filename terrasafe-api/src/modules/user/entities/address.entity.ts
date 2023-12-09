import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Property } from './property.entity';
import { District } from './district.entity';
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity('address')
export class Address extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne(() => District, district => district.addresses)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column({ nullable: true })
  aptSuite: string;

  @Column()
  zip: string;

  @OneToMany(() => Property, property => property.location)
  properties: Property[];
}
