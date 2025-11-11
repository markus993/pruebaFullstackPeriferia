import { Controller, Get, NotFoundException, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { UsersService } from "./users.service";

const meResponseExample = {
  ok: true,
  data: {
    id: "c1c0b5b0-7f7a-4b5a-8a7b-123456789abc",
    email: "ana.romero@periferia.it",
    username: "aromero",
    alias: "@anar",
    firstName: "Ana",
    lastName: "Romero",
    birthDate: "1992-05-12T00:00:00.000Z",
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-01-05T15:30:00.000Z"
  }
} satisfies Record<string, unknown>;

@ApiTags("Users")
@ApiBearerAuth('access-token')
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Obtener perfil autenticado",
    description: "Devuelve la información básica del usuario autenticado usando el token Bearer proporcionado."
  })
  @ApiOkResponse({
    description: "Perfil encontrado.",
    schema: { example: meResponseExample }
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticación ausente o inválido." })
  @ApiNotFoundResponse({ description: "El usuario asociado al token no existe." })
  @ApiHeader({
    name: "Authorization",
    description: "Token JWT en formato `Bearer <token>`",
    required: true,
    schema: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
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
