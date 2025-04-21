/**
 * Feature: Prisma Client
 * Description: Singleton instance of Prisma Client for database connections
 */

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of Prisma Client
const prisma = global.prisma || new PrismaClient();

// Save the client instance in development so hot reloading doesn't create multiple instances
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
