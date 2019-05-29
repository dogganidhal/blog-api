import { AutoWired } from "typescript-ioc";
import { getConnection } from "typeorm";
import { ArticleWithCommentsDto, NewArticleDto } from "../model/dto/article";
import Article from "../model/entity/article";
import Like from "../model/entity/like";


@AutoWired
export default class ArticleManager {

  public async findArticleById(id: string): Promise<ArticleWithCommentsDto> {
    let article = await getConnection()
      .getRepository(Article)
      .findOne(id);
    if (!article) {
      throw "Article not found";
    }
    let likes = await getConnection()
      .getRepository(Like)
      .count({ article: article });
    return {
      ...article,
      likes: likes
    };
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

}