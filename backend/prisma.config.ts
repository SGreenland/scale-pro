import type { PrismaConfig } from "prisma";
import dotenv from 'dotenv';

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'src/notePatternSeeder.ts'
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  }
} satisfies PrismaConfig;