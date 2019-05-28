import { Path, POST, Errors, GET } from "typescript-rest";
import { LoginDto, AuthCredentialsDto, SignUpDto } from "../model/dto";
import { AutoWired, Inject } from "typescript-ioc";
import AuthManager from "../manager/auth-manager";



@AutoWired
@Path("/auth")
export default class AuthController {

  @Inject
  private authManager: AuthManager;

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

}