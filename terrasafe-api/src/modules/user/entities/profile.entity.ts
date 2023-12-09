// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
// import { User } from "./user.entity";
// import { BaseEntity } from "../../../shared/entities/base.entity";
// import { Property } from "./property.entity";
//
// @Entity("profiles")
// export class Profile extends BaseEntity {
//
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @ManyToOne(() => User, user => user.profile)
//   @JoinColumn({ name: "userId" })
//   user: User;
//
//
//   @Column({ nullable: true })
//   userId: number;
//
//   @Column()
//   firstName: string;
//
//   @Column()
//   lastName: string;
//
//   @Column()
//   phoneNumber: string;
//
//   @Column()
//   address: string;
//
//   @Column({ nullable: true })
//   avatar: string; // This will store the Firebase URL for the avatar media
//
//   @Column({ nullable: true })
//   agencyName?: string;
//
//   @Column({ nullable: true })
//   agencyDescription?: string;
//
//   @OneToMany(() => Property, property => property.agency)
//   properties: Promise<Property[]>;
//
//
// }
