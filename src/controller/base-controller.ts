import { Context, ServiceContext } from "typescript-rest";
import User from "../model/entity/user";



export default class BaseController { 

  @Context
  protected context: ServiceContext;

  protected get user(): User | undefined {
    return this.context.request.user;
  }

}