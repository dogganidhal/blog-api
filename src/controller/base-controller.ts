import { Context, ServiceContext, Abstract } from "typescript-rest";
import User from "../model/entity/user";
import { Inject, AutoWired } from "typescript-ioc";
import AuthManager from "../manager/auth-manager";


@Abstract
@AutoWired
export default abstract class BaseController { 

  @Inject
  protected authManager: AuthManager;

  @Context
  protected context: ServiceContext;

  protected async getUser(): Promise<User | undefined> {
    let token = this.context.request.headers.authorization.replace("Bearer ", "");
    return await this.authManager.decodeToken(token);
  }

}