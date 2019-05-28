import { AutoWired } from "typescript-ioc";
import { LoginDto, AuthCredentialsDto, SignUpDto } from "../model/dto";
import { Connection, getConnection } from "typeorm";
import User from "../model/entity/user";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import ActivationCode from "../model/entity/activation-code";

@AutoWired
export default class AuthManager {

  private connection: Connection = getConnection();
  private jwtSecret: string = "A_SUPER_SECRET_KEY";
  private jwtExpiresIn: number = 3600;

  public async signUp(request: SignUpDto) {
    let existingUsers = await this.connection
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
    await this.connection
      .getRepository(User)
      .save(user);
    
    let activationCodeEntity = new ActivationCode({ user: user })
    let activationCode = await this.connection
      .getRepository(ActivationCode)
      .insert(activationCodeEntity);
    console.log(activationCode.identifiers[0].id);
    // TODO: Send confirmation email
  }

  public async login(request: LoginDto): Promise<AuthCredentialsDto> {
    let user = await this.connection
      .getRepository(User)
      .findOne({ username: request.username })
    if (!user) {
      throw "User not found";
    }
    if (!await compare(request.password, user.passwordHash)) {
      throw "User not found";
    }
    let accessToken = await sign(
      { id: user.id, roles: user.roles },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
    return {
      accessToken: accessToken,
      expiresIn: this.jwtExpiresIn
    };
  }
  
  public async activate(activationCode: string) {
    try {
      let activationCodeEntity = await this.connection
        .getRepository(ActivationCode)
        .findOne({ id: activationCode }, { relations: ["user"] });
      await this.connection
        .getRepository(User)
        .save({
          ...activationCodeEntity.user,
          isActive: true
        });
      await this.connection
        .getRepository(ActivationCode)
        .delete(activationCodeEntity);
    } catch {
      throw "Invalid activation code";
    }
  }

}