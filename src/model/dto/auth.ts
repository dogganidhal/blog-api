

export interface LoginDto {
  username: string;
  password: string;
}

export interface SignUpDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthCredentialsDto {
  accessToken: string;
  expiresIn: number;
}
