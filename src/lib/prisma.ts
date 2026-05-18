// Prisma 7 client singleton
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma: PrismaClient =
  globalThis._prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  } as any);

if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = prisma;
}
