import { AutoWired } from "typescript-ioc";
import { LoginDto, AuthCredentialsDto, SignUpDto } from "../model/dto";
import { Connection, getConnection } from "typeorm";
import User from "../model/entity/user";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

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

}