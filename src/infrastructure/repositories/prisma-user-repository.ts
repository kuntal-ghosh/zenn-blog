/**
 * Prisma implementation of the UserRepository interface
 */

import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../core/domain/interfaces/repositories";
import { User } from "../../core/domain/entities/user";

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user as unknown as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as unknown as User;
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: user as any,
    });
    return createdUser as unknown as User;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser as unknown as User;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}