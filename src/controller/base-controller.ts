import { Context, ServiceContext, Abstract, Errors } from "typescript-rest";
import User, { UserRole } from "../model/entity/user";
import { Inject, AutoWired } from "typescript-ioc";
import AuthManager from "../manager/auth-manager";


@Abstract
@AutoWired
export default abstract class BaseController { 

  @Inject
  protected authManager: AuthManager;

  @Context
  protected context: ServiceContext;

  protected async getUserOrFail(): Promise<User> {
    let token = this.context.request.headers.authorization.replace("Bearer ", "");
    let user = await this.authManager.decodeToken(token);
    if (!user) {
      throw new Errors.UnauthorizedError();
    }
    return user;
  }

  protected async assertAuthenticated() {
    let user = await this.getUserOrFail();
    if (!user) {
      throw new Errors.UnauthorizedError();
    }
  }

  protected async assertAdmin() {
    let user = await this.getUserOrFail();
    if (!user) {
      throw new Errors.UnauthorizedError();
    }
    if (!(user.roles & UserRole.Admin)) {
      throw new Errors.ForbiddenError();
    }
  }

}