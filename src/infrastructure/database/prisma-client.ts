/**
 * Prisma client singleton
 */

import { PrismaClient } from "@prisma/client";

// Create a global variable to store the prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma Client instance to be used throughout the application
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}