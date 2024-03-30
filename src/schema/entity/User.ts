import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  name: string;

  @Column({type: "enum", enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @Column()
  password: string;

  @Column()
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
