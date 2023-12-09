import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { User } from "./user.entity";
import { Property } from "./property.entity";

@Entity("media")
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({
    type: "enum",
    enum: ["images", "attachments", "floorPlans"]
  })
  type: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => User)
  uploadedBy: User;

  @ManyToOne(() => Property, property => property.media)
  property: Property;
}
