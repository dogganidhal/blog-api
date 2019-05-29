import { AutoWired } from "typescript-ioc";
import { LoginDto, AuthCredentialsDto, SignUpDto } from "../model/dto";
import { getConnection } from "typeorm";
import User, { UserRole } from "../model/entity/user";
import { compare, hash } from "bcrypt";
import { sign, decode, verify } from "jsonwebtoken";
import ActivationCode from "../model/entity/activation-code";

export enum ApiUserRole {
  VISITOR = "VISITOR",
  ADMIN = "ADMIN"
}

export interface TokenPayload {
  id: string;
  roles: UserRole;
}

@AutoWired
export default class AuthManager {

  private static jwtSecret: string = "A_SUPER_SECRET_KEY";
  private static jwtExpiresIn: number = 3600;

  public async signUp(request: SignUpDto) {
    let existingUsers = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .select("User")
      .where("username = :username", { username: request.username })
      .orWhere("email = :email", { email: request.email })
      .printSql()
      .getCount();
    if (existingUsers > 0) {
      throw "User already exists";
    }
    let passwordHash = await hash(request.password, 10);
    let user = new User({
      username: request.username,
      email: request.email,
      passwordHash: passwordHash
    });
    await getConnection()
      .getRepository(User)
      .save(user);
    
    let activationCodeEntity = new ActivationCode({ user: user })
    let activationCode = await getConnection()
      .getRepository(ActivationCode)
      .insert(activationCodeEntity);
    console.log(activationCode.identifiers[0].id);
    // TODO: Send confirmation email
  }

  public async login(request: LoginDto): Promise<AuthCredentialsDto> {
    let user = await getConnection()
      .getRepository(User)
      .findOne({ username: request.username })
    if (!user) {
      throw "User not found";
    }
    if (!await compare(request.password, user.passwordHash)) {
      throw "User not found";
    }
    let accessToken = await sign(
      <TokenPayload>{ id: user.id, roles: user.roles },
      AuthManager.jwtSecret,
      { expiresIn: AuthManager.jwtExpiresIn }
    );
    return {
      accessToken: accessToken,
      expiresIn: AuthManager.jwtExpiresIn
    };
  }

  public async decodeToken(token: string): Promise<User | undefined> {
    let payload = await verify(token, AuthManager.jwtSecret) as TokenPayload;
    return getConnection()
      .getRepository(User)
      .findOne(payload.id);
  }
  
  public async activate(activationCode: string) {
    try {
      let activationCodeEntity = await getConnection()
        .getRepository(ActivationCode)
        .findOne({ id: activationCode }, { relations: ["user"] });
      await getConnection()
        .getRepository(User)
        .save({
          ...activationCodeEntity.user,
          isActive: true
        });
      await getConnection()
        .getRepository(ActivationCode)
        .delete(activationCodeEntity);
    } catch {
      throw "Invalid activation code";
    }
  }

}