import { PrimaryGeneratedColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import Article from "./article";
import User from "./user";


@Entity()
export default class Like {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @JoinColumn()
  @ManyToOne(type => Article)
  public article: Article;

  @JoinColumn()
  @ManyToOne(type => User)
  public user: User;

  constructor()
  constructor(data: Partial<Like>)
  constructor(data?: Partial<Like>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}