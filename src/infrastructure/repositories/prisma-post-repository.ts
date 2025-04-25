/**
 * Prisma implementation of the PostRepository
 */

import { PrismaClient } from "@prisma/client";
import { PostRepository } from "../../core/domain/interfaces/repositories";
import { Post } from "../../core/domain/entities/post";

export class PrismaPostRepository implements PostRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
        comments: true,
      },
    });
    return post as unknown as Post;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: true,
        comments: true,
      },
    });
    return post as unknown as Post;
  }

  async findAll(options?: {
    authorId?: string;
    published?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ posts: Post[]; total: number }> {
    const where: any = {};
    
    if (options?.authorId) {
      where.authorId = options.authorId;
    }
    
    if (options?.published !== undefined) {
      where.published = options.published;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        skip: options?.offset || 0,
        take: options?.limit || 10,
        orderBy: options?.sortBy
          ? {
              [options.sortBy]: options.sortOrder || "desc",
            }
          : { createdAt: "desc" },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts as unknown as Post[],
      total,
    };
  }

  async create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const { tags, comments, author, ...postData } = post as any;

    const createdPost = await this.prisma.post.create({
      data: {
        ...postData,
      },
      include: {
        author: true,
        tags: true,
      },
    });

    return createdPost as unknown as Post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    // We need to handle relationships separately to avoid prisma errors
    const { tags, comments, author, ...updateData } = data as any;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        tags: true,
      },
    });

    return updatedPost as unknown as Post;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }
}