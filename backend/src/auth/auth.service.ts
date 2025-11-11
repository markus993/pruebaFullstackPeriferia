import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";

import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { AuthenticatedUser } from "./types/authenticated-user.type";
import { JwtPayload } from "./types/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private buildPayload(user: AuthenticatedUser): JwtPayload {
    return {
      id: user.id,
      sub: user.id,
      username: user.username,
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }

  async validateCredentials(identifier: string, password: string) {
    const user = await this.usersService.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const passwordValid = await compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return user;
  }

  async login({ identifier, password }: LoginDto) {
    const user = await this.validateCredentials(identifier, password);
    const safeUser = this.usersService.toSafeUser(user);

    const payload = this.buildPayload({
      id: user.id,
      username: user.username,
      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName
    });

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: safeUser
    };
  }
}
