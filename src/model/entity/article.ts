import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import Comment from "./comment";


@Entity()
export default class Article {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public title: string;

  @Column({ nullable: false })
  public content: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;

  @OneToMany(type => Comment, comment => comment.article)
  public comments: Comment[];

  constructor()
  constructor(data: Partial<Article>)
  constructor(data?: Partial<Article>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  
}