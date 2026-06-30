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

// Self-healing check for schema updates in development hot-reloads
if (process.env.NODE_ENV !== "production" && globalThis._prisma) {
  if (!("chatSession" in globalThis._prisma)) {
    console.log("[Prisma Helper] Chat models not found on cached Prisma client. Re-initializing client...");
    globalThis._prisma = undefined;
  }
}

export const prisma: PrismaClient =
  globalThis._prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);


if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = prisma;
}
