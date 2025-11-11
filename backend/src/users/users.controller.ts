import { Controller, Get, NotFoundException, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.usersService.findById(user.id);

    if (!profile) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return {
      ok: true,
      data: this.usersService.toSafeUser(profile)
    };
  }
}
