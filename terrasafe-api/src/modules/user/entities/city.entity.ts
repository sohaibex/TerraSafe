import { Column, Entity, OneToMany } from "typeorm";
import { District } from "./district.entity";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity("cities")
export class City extends BaseEntity {
  @Column()
  code: number;

  @Column({ length: 240 })
  name: string;

  @Column({ length: 240 })
  arabicName: string;

  @OneToMany(() => District, district => district.city)
  districts: District[];
}
