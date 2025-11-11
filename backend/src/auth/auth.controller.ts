import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import type { SafeUser } from "../users/users.service";

const loginResponseExample = {
  ok: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
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
  }
} satisfies Record<string, unknown>;

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Iniciar sesión",
    description:
      "Valida las credenciales del usuario y devuelve un token JWT junto con la información básica del usuario autenticado."
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: "Credenciales válidas. Devuelve token y datos del usuario.",
    schema: {
      example: loginResponseExample
    }
  })
  @ApiBadRequestResponse({ description: "El identificador o la contraseña no cumplen con el formato esperado." })
  @ApiUnauthorizedResponse({ description: "Credenciales inválidas." })
  @Post("login")
  async login(@Body() dto: LoginDto): Promise<{ ok: true; data: { token: string; user: SafeUser } }> {
    const result = await this.authService.login(dto);
    return {
      ok: true,
      data: result
    };
  }
}
