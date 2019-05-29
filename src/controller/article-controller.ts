import { Path, Errors, PathParam, GET, Security, POST, PUT } from "typescript-rest";
import { AutoWired, Inject } from "typescript-ioc";
import { ApiUserRole } from "../manager/auth-manager";
import { ArticleWithCommentsDto, NewArticleDto, NewCommentDto } from "../model/dto/article";
import ArticleManager from "../manager/article-manager";
import BaseController from "./base-controller";


@AutoWired
@Path("/article")
export default class ArticleController extends BaseController {

  @Inject
  private articleManager: ArticleManager;

  @GET
  @Security([ApiUserRole.VISITOR, ApiUserRole.ADMIN])
  public async getAllArticles(): Promise<ArticleWithCommentsDto[]> {
    await this.assertAuthenticated();
    try {
      return await this.articleManager.findAllArticles();
    } catch (exception) {
      throw new Errors.NotFoundError(exception);
    }
  }

  @Path(":id")
  @GET
  @Security([ApiUserRole.VISITOR, ApiUserRole.ADMIN])
  public async getArticle(@PathParam("id") id: string): Promise<ArticleWithCommentsDto> {
    await this.assertAuthenticated();
    try {
      return await this.articleManager.findArticleById(id);
    } catch (exception) {
      throw new Errors.NotFoundError(exception);
    }
  }

  @POST
  @Security([ApiUserRole.ADMIN])
  public async createArticle(request: NewArticleDto) {
    await this.assertAdmin();
    try {
      this.articleManager.createArticle(request);
    } catch (exception) {
      return new Errors.BadRequestError(exception);
    }
  }

  @Path(":id")
  @PUT
  @Security([ApiUserRole.ADMIN])
  public async editArticle(@PathParam("id") id: string, request: NewArticleDto) {
    await this.assertAdmin();
    try {
      await this.articleManager.editArticle(id, request);
    } catch (exception) {
      return new Errors.BadRequestError(exception);
    }
  }

  @PUT
  @Path("like/:id")
  @Security([ApiUserRole.VISITOR, ApiUserRole.ADMIN])
  public async likeArticle(@PathParam("id") id: string) {
    let user = await this.getUserOrFail();
    try {
      await this.articleManager.likeArticle(user, id);
    } catch (exception) {
      return new Errors.BadRequestError(exception)
    }
  }

  @POST
  @Path("comment/:id")
  @Security([ApiUserRole.VISITOR, ApiUserRole.ADMIN])
  public async commentArticle(@PathParam("id") id: string, request: NewCommentDto) {
    let user = await this.getUserOrFail();
    try {
      await this.articleManager.commentArticle(id, user, request);
    } catch (exception) {
      return new Errors.BadRequestError(exception)
    }
  }

}