import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";

@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getFeed(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.postsService.getFeed(user.id);
    return {
      ok: true,
      data
    };
  }

  @Post()
  async createPost(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePostDto) {
    const data = await this.postsService.createPost(user, dto);
    return {
      ok: true,
      data
    };
  }

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
