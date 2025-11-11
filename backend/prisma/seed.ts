import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Periferia123!";

const USERS = [
  {
    id: "c35c21f4-6790-4f66-a282-5ce3561c6920",
    email: "ana.romero@periferia.it",
    username: "aromero",
    alias: "anar",
    firstName: "Ana",
    lastName: "Romero",
    birthDate: new Date("1995-03-21"),
    posts: [
      {
        id: "a0d258c7-d471-4c7e-8828-1bdea5076a5f",
        message: "¡Hola Periferia! Emocionada de estrenar nuestra red social interna ✨"
      }
    ]
  },
  {
    id: "84a08381-3a58-4b3c-8d62-16ec3e6762d4",
    email: "carlos.mendez@periferia.it",
    username: "cmendez",
    alias: "carlitos",
    firstName: "Carlos",
    lastName: "Méndez",
    birthDate: new Date("1992-08-14"),
    posts: [
      {
        id: "f12be7ed-01ea-4594-951f-530d6ea09147",
        message: "¿Quién se apunta a una sesión de pair programming esta tarde?"
      }
    ]
  },
  {
    id: "5d7b3f54-6cd0-498b-9c59-089e35d3a1d7",
    email: "laura.castillo@periferia.it",
    username: "lcastillo",
    alias: "lauca",
    firstName: "Laura",
    lastName: "Castillo",
    birthDate: new Date("1998-01-05"),
    posts: [
      {
        id: "aaed0ef1-0a40-4a4a-a68b-0d08a93fd0e3",
        message: "Tip del día: documenta antes de desplegar 🚀"
      }
    ]
  }
];

const LIKES = [
  {
    postId: "f12be7ed-01ea-4594-951f-530d6ea09147",
    userId: "c35c21f4-6790-4f66-a282-5ce3561c6920"
  },
  {
    postId: "aaed0ef1-0a40-4a4a-a68b-0d08a93fd0e3",
    userId: "84a08381-3a58-4b3c-8d62-16ec3e6762d4"
  }
];

async function main() {
  console.log("🟢 Iniciando seed unificado...");

  for (const user of USERS) {
    const passwordHash = await hash(DEFAULT_PASSWORD, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        passwordHash
      },
      create: {
        id: user.id,
        email: user.email,
        username: user.username,
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        passwordHash
      }
    });

    for (const post of user.posts) {
      await prisma.post.upsert({
        where: { id: post.id },
        update: {
          message: post.message,
          authorId: user.id
        },
        create: {
          id: post.id,
          message: post.message,
          authorId: user.id
        }
      });
    }
  }

  for (const like of LIKES) {
    await prisma.like.upsert({
      where: {
        postId_userId: {
          postId: like.postId,
          userId: like.userId
        }
      },
      update: {},
      create: like
    });
  }

  console.log("✅ Seed unificado completado");
}

main()
  .catch((error) => {
    console.error("❌ Error durante el seed unificado", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
