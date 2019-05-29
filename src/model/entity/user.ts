import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  Member = 0,
  Admin = 1 << 0,
  All = ~(~0 << 2)
}

@Entity()
export default class User {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: true, nullable: false })
  public username: string;

  @Column({ nullable: false })
  public passwordHash: string;

  @Column({ nullable: false, default: UserRole.Member })
  public roles: UserRole;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ nullable: false, default: false })
  public isActive: boolean;

  constructor()
  constructor(data: Partial<User>)
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}