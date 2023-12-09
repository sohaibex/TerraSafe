import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./city.entity";
import { Address } from "./address.entity";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity("districts")
export class District extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City, (city) => city.districts)
  @JoinColumn({ name: "cityId", referencedColumnName: "id" })
  city: City;

  @Column()
  code: number;

  @Column({ length: 240 })
  name: string;

  @Column({ length: 240 })
  arabicName: string;

  @OneToMany(() => Address, (address) => address.district)
  addresses: Address[];
}
