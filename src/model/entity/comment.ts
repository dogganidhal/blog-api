import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import Article from "./article";
import User from "./user";


@Entity()
export default class Comment {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public content: string;

  @CreateDateColumn()
  public created: Date;

  @ManyToOne(type => Article)
  public article: Article;

  @ManyToOne(type => User)
  public user: User;

  constructor()
  constructor(data: Partial<Comment>)
  constructor(data?: Partial<Comment>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}