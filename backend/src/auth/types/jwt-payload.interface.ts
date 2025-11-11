import { AuthenticatedUser } from "./authenticated-user.type";

export interface JwtPayload extends AuthenticatedUser {
  sub: string;
  iat?: number;
  exp?: number;
}
