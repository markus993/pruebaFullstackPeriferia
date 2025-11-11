import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";

const postExample = {
  id: "ab1c2d3e-4567-8901-2345-6789abcdef01",
  message: "¡Hola equipo! Hoy lanzamos la nueva funcionalidad.",
  publishedAt: "2025-01-15T14:30:00.000Z",
  author: {
    id: "c1c0b5b0-7f7a-4b5a-8a7b-123456789abc",
    alias: "@anar",
    name: "Ana Romero"
  },
  likes: 8,
  likedByMe: true
};

const feedResponseExample = {
  ok: true,
  data: [postExample]
} satisfies Record<string, unknown>;

const singlePostResponseExample = {
  ok: true,
  data: postExample
} satisfies Record<string, unknown>;

@ApiTags("Posts")
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: "Listar publicaciones del feed",
    description:
      "Obtiene las publicaciones más recientes ordenadas por fecha, con metadatos de likes y si el usuario autenticado ya reaccionó."
  })
  @ApiOkResponse({
    description: "Listado de publicaciones.",
    schema: { example: feedResponseExample }
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticación ausente o inválido." })
  @ApiHeader({
    name: "Authorization",
    description: "Token JWT en formato `Bearer <token>`",
    required: true,
    schema: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
  @Get()
  async getFeed(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.postsService.getFeed(user.id);
    return {
      ok: true,
      data
    };
  }

  @ApiOperation({
    summary: "Crear una publicación",
    description: "Crea una nueva publicación asociada al usuario autenticado."
  })
  @ApiBody({
    description: "Datos necesarios para crear la publicación.",
    type: CreatePostDto
  })
  @ApiCreatedResponse({
    description: "Publicación creada correctamente.",
    schema: { example: singlePostResponseExample }
  })
  @ApiBadRequestResponse({ description: "El cuerpo de la solicitud no cumple con las validaciones." })
  @ApiUnauthorizedResponse({ description: "Token de autenticación ausente o inválido." })
  @ApiHeader({
    name: "Authorization",
    description: "Token JWT en formato `Bearer <token>`",
    required: true,
    schema: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
  @Post()
  async createPost(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePostDto) {
    const data = await this.postsService.createPost(user, dto);
    return {
      ok: true,
      data
    };
  }

  @ApiOperation({
    summary: "Agregar like a una publicación",
    description:
      "Registra un like del usuario autenticado sobre la publicación indicada. La operación es idempotente: múltiples solicitudes no duplican el like."
  })
  @ApiOkResponse({
    description: "Publicación actualizada con el conteo de likes.",
    schema: { example: singlePostResponseExample }
  })
  @ApiBadRequestResponse({ description: "El identificador de publicación no tiene formato UUID v4." })
  @ApiUnauthorizedResponse({ description: "Token de autenticación ausente o inválido." })
  @ApiNotFoundResponse({ description: "La publicación solicitada no existe." })
  @ApiHeader({
    name: "Authorization",
    description: "Token JWT en formato `Bearer <token>`",
    required: true,
    schema: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
  @Post(":id/like")
  async likePost(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string
  ) {
    const data = await this.postsService.likePost(id, user.id);
    return {
      ok: true,
      data
    };
  }

  @ApiOperation({
    summary: "Retirar like de una publicación",
    description: "Elimina el like del usuario autenticado en la publicación indicada."
  })
  @ApiOkResponse({
    description: "Publicación actualizada tras remover el like.",
    schema: { example: singlePostResponseExample }
  })
  @ApiBadRequestResponse({ description: "El identificador de publicación no tiene formato UUID v4." })
  @ApiUnauthorizedResponse({ description: "Token de autenticación ausente o inválido." })
  @ApiNotFoundResponse({ description: "La publicación solicitada no existe." })
  @ApiHeader({
    name: "Authorization",
    description: "Token JWT en formato `Bearer <token>`",
    required: true,
    schema: {
      type: "string",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
  @Post(":id/unlike")
  async unlikePost(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string
  ) {
    const data = await this.postsService.unlikePost(id, user.id);
    return {
      ok: true,
      data
    };
  }
}
