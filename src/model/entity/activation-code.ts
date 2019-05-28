import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import User from "./user";


@Entity()
export default class ActivationCode {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @JoinColumn()
  @OneToOne(type => User, { nullable: false })
  public user: User;

  constructor()
  constructor(data: Partial<ActivationCode>)
  constructor(data?: Partial<ActivationCode>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}