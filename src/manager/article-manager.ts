import { AutoWired } from "typescript-ioc";
import { getConnection } from "typeorm";
import { ArticleWithCommentsDto, NewArticleDto, NewCommentDto, CommentDto, UserDto } from "../model/dto/article";
import Article from "../model/entity/article";
import Like from "../model/entity/like";
import User from "../model/entity/user";
import Comment from "../model/entity/comment";


@AutoWired
export default class ArticleManager {

  public async findArticleById(id: string): Promise<ArticleWithCommentsDto> {
    let article = await getConnection()
      .getRepository(Article)
      .findOne(id);
    if (!article) {
      throw "Article not found";
    }
    let comments = await getConnection()
      .getRepository(Comment)
      .find({ where: { article }, relations: ["user"] });
    let likes = await getConnection()
      .getRepository(Like)
      .count({ article: article });
    return {
      ...article,
      likes,
      comments: comments.map(comment => {
        return <CommentDto>{
          ...comment,
          user: <UserDto>{
            username: comment.user.username
          }
        };
      })
    };
  }

  public async findAllArticles(): Promise<ArticleWithCommentsDto[]> {
    let articles = await getConnection()
      .getRepository(Article)
      .find();
    return Promise.all(
      articles.map(async article => {
        let comments = await getConnection()
          .getRepository(Comment)
          .find({ where: { article }, relations: ["user"] });
        let likes = await getConnection()
          .getRepository(Like)
          .count({ article: article });
        return {
          ...article,
          likes,
          comments: comments.map(comment => {
            return <CommentDto>{
              ...comment,
              user: <UserDto>{
                username: comment.user.username
              }
            };
          })
        };
      })
    );
  }

  public async createArticle(request: NewArticleDto) {
    let article = new Article(request);
    await getConnection()
      .getRepository(Article)
      .insert(article);
  }

  public async editArticle(id: string, request: NewArticleDto) {
    let article = await getConnection()
      .getRepository(Article)
      .findOne(id);
    if (!article) {
      throw "Article not found";
    }
    article = {
      ...article,
      ...request
    };
    await getConnection()
      .getRepository(Article)
      .save(article);
  }

  public async likeArticle(user: User, id: string) {
    let article = await getConnection()
      .getRepository(Article)
      .findOne(id);
    if (!article) {
      throw "Article not found";
    }
    let userArticleLikes = await getConnection()
      .getRepository(Like)
      .count({ user: user, article: article });
    if (userArticleLikes > 0) {
      return;
    }
    let like = new Like({ user, article });
    await getConnection()
      .getRepository(Like)
      .insert(like);
  }

  public async commentArticle(id: string, user: User, request: NewCommentDto) {
    let article = await getConnection()
      .getRepository(Article)
      .findOne(id);
    if (!article) {
      throw "Article not found";
    }
    let comment = new Comment({
      ...request,
      user,
      article
    });
    await getConnection()
      .getRepository(Comment)
      .insert(comment);
  }

}