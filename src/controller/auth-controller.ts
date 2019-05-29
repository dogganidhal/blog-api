import { Path, POST, Errors, PathParam } from "typescript-rest";
import { LoginDto, AuthCredentialsDto, SignUpDto } from "../model/dto";
import { AutoWired } from "typescript-ioc";
import BaseController from "./base-controller";


@AutoWired
@Path("/auth")
export default class AuthController extends BaseController {

  @Path("/signup")
  @POST
  public async signUp(loginRequest: SignUpDto) {
    try {
      await this.authManager.signUp(loginRequest);
    } catch (exception) {
      throw new Errors.BadRequestError(exception);
    }
  }

  @Path("/login")
  @POST
  public async login(loginRequest: LoginDto): Promise<AuthCredentialsDto> {
    try {
      return await this.authManager.login(loginRequest);
    } catch (exception) {
      throw new Errors.NotFoundError(exception);
    }
  }

  @Path("/activate/:activationCode")
  @POST
  public async activate(@PathParam("activationCode") activationCode: string) {
    try {
      await this.authManager.activate(activationCode);
    } catch (exception) {
      throw new Errors.NotFoundError(activationCode);
    }
  }

}