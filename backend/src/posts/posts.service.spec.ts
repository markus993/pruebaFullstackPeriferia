import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { PostsService } from "./posts.service";
import type { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CreatePostDto } from "./dto/create-post.dto";

type PrismaServiceMock = {
  post: {
    findMany: jest.Mock;
    create: jest.Mock;
    findUnique: jest.Mock;
  };
  like: {
    create: jest.Mock;
    deleteMany: jest.Mock;
  };
};

const buildPrismaServiceMock = (): PrismaServiceMock => ({
  post: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn()
  },
  like: {
    create: jest.fn(),
    deleteMany: jest.fn()
  }
});

describe("PostsService", () => {
  let service: PostsService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    const prismaMock = buildPrismaServiceMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ]
    }).compile();

    service = moduleRef.get(PostsService);
    prisma = moduleRef.get(PrismaService) as unknown as PrismaServiceMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve el feed transformado correctamente", async () => {
    const userId = "user-1";
    const publishedAt = new Date("2024-01-01T00:00:00.000Z");

    prisma.post.findMany.mockResolvedValue([
      {
        id: "post-1",
        message: "Hola mundo",
        publishedAt,
        author: {
          id: "user-2",
          alias: "user.two",
          firstName: "User",
          lastName: "Dos"
        },
        _count: { likes: 5 },
        likes: [{ userId }]
      }
    ]);

    const result = await service.getFeed(userId);

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      include: {
        author: true,
        _count: { select: { likes: true } },
        likes: {
          where: { userId }
        }
      },
      orderBy: { publishedAt: "desc" }
    });
    expect(result).toEqual([
      {
        id: "post-1",
        message: "Hola mundo",
        publishedAt,
        author: {
          id: "user-2",
          alias: "user.two",
          name: "User Dos"
        },
        likes: 5,
        likedByMe: true
      }
    ]);
  });

  it("crea una publicación y regresa el resumen", async () => {
    const author: AuthenticatedUser = {
      id: "author-1",
      alias: "author.one",
      email: "author@example.com",
      firstName: "Author",
      lastName: "Uno"
    };
    const dto: CreatePostDto = {
      message: "Nuevo post"
    };
    const publishedAt = new Date("2024-02-01T10:00:00.000Z");

    prisma.post.create.mockResolvedValue({
      id: "post-123",
      message: dto.message,
      publishedAt,
      author: {
        id: author.id,
        alias: author.alias,
        firstName: author.firstName,
        lastName: author.lastName
      },
      _count: { likes: 0 },
      likes: []
    });

    const result = await service.createPost(author, dto);

    expect(prisma.post.create).toHaveBeenCalledWith({
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
    expect(result).toEqual({
      id: "post-123",
      message: dto.message,
      publishedAt,
      author: {
        id: author.id,
        alias: author.alias,
        name: "Author Uno"
      },
      likes: 0,
      likedByMe: false
    });
  });

  it("lanza NotFoundException al intentar dar like a una publicación inexistente", async () => {
    prisma.post.findUnique.mockResolvedValue(null);

    await expect(service.likePost("post-404", "user-1")).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.post.findUnique).toHaveBeenCalledWith({ where: { id: "post-404" } });
    expect(prisma.like.create).not.toHaveBeenCalled();
  });

  it("tolera likes duplicados y retorna el resumen actualizado", async () => {
    const postId = "post-1";
    const userId = "user-1";
    const publishedAt = new Date("2024-03-01T08:00:00.000Z");

    prisma.post.findUnique
      .mockResolvedValueOnce({ id: postId }) // verificación inicial de existencia
      .mockResolvedValueOnce({
        id: postId,
        message: "Mensaje",
        publishedAt,
        author: {
          id: "author-1",
          alias: "author.one",
          firstName: "Author",
          lastName: "One"
        },
        _count: { likes: 7 },
        likes: [{ userId }]
      });

    const duplicateLikeError = new Prisma.PrismaClientKnownRequestError(
      "Duplicate like",
      {
        code: "P2002",
        clientVersion: "6.19.0"
      },
      undefined
    );

    prisma.like.create.mockRejectedValueOnce(duplicateLikeError);

    const result = await service.likePost(postId, userId);

    expect(prisma.like.create).toHaveBeenCalledWith({
      data: { postId, userId }
    });
    expect(prisma.post.findUnique).toHaveBeenLastCalledWith({
      where: { id: postId },
      include: {
        author: true,
        _count: { select: { likes: true } },
        likes: { where: { userId } }
      }
    });
    expect(result).toEqual({
      id: postId,
      message: "Mensaje",
      publishedAt,
      author: {
        id: "author-1",
        alias: "author.one",
        name: "Author One"
      },
      likes: 7,
      likedByMe: true
    });
  });

  it("elimina el like y devuelve el resumen al hacer unlike", async () => {
    const postId = "post-1";
    const userId = "user-1";
    const publishedAt = new Date("2024-03-05T12:00:00.000Z");

    prisma.post.findUnique
      .mockResolvedValueOnce({ id: postId }) // verificación inicial
      .mockResolvedValueOnce({
        id: postId,
        message: "Mensaje actualizado",
        publishedAt,
        author: {
          id: "author-2",
          alias: "author.two",
          firstName: "Author",
          lastName: "Two"
        },
        _count: { likes: 2 },
        likes: []
      });

    prisma.like.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.unlikePost(postId, userId);

    expect(prisma.like.deleteMany).toHaveBeenCalledWith({
      where: { postId, userId }
    });
    expect(result).toEqual({
      id: postId,
      message: "Mensaje actualizado",
      publishedAt,
      author: {
        id: "author-2",
        alias: "author.two",
        name: "Author Two"
      },
      likes: 2,
      likedByMe: false
    });
  });
});

