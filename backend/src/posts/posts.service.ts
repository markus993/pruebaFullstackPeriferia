import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostResponse } from "./dto/post-response.dto";

type PostWithMeta = Prisma.PostGetPayload<{
  include: {
    author: true;
    likes: {
      where: {
        userId?: string;
      };
    };
    _count: {
      select: { likes: true };
    };
  };
}>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildAuthor(user: User) {
    return {
      id: user.id,
      alias: user.alias,
      name: `${user.firstName} ${user.lastName}`.trim()
    };
  }

  private toResponse(post: PostWithMeta, currentUserId: string): PostResponse {
    return {
      id: post.id,
      message: post.message,
      publishedAt: post.publishedAt,
      author: this.buildAuthor(post.author),
      likes: post._count.likes,
      likedByMe: post.likes.some((like) => like.userId === currentUserId)
    };
  }

  private async summarizePost(postId: string, userId: string): Promise<PostResponse> {
    const summary = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        _count: { select: { likes: true } },
        likes: {
          where: { userId }
        }
      }
    });

    if (!summary) {
      throw new NotFoundException("Publicación no encontrada");
    }

    return this.toResponse(summary, userId);
  }

  async getFeed(userId: string): Promise<PostResponse[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        author: true,
        _count: { select: { likes: true } },
        likes: {
          where: { userId }
        }
      },
      orderBy: { publishedAt: "desc" }
    });

    return posts.map((post) => this.toResponse(post, userId));
  }

  async createPost(author: AuthenticatedUser, dto: CreatePostDto): Promise<PostResponse> {
    const post = await this.prisma.post.create({
      data: {
        authorId: author.id,
        message: dto.message
      },
      include: {
        author: true,
        _count: { select: { likes: true } },
        likes: {
          where: { userId: author.id }
        }
      }
    });

    return this.toResponse(post, author.id);
  }

  async likePost(postId: string, userId: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException("Publicación no encontrada");
    }

    try {
      await this.prisma.like.create({
        data: {
          postId,
          userId
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // Like duplicado, continuar de forma idempotente
      } else {
        throw error;
      }
    }

    return this.summarizePost(postId, userId);
  }

  async unlikePost(postId: string, userId: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException("Publicación no encontrada");
    }

    await this.prisma.like.deleteMany({
      where: {
        postId,
        userId
      }
    });

    return this.summarizePost(postId, userId);
  }
}
