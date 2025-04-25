/**
 * Core repository interfaces
 * These define how the application interacts with data stores
 */

import { User } from "../entities/user";
import { Post } from "../entities/post";
import { Comment } from "../entities/comment";
import { Tag } from "../entities/tag";
import { Image } from "../entities/image";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findAll(options?: { 
    authorId?: string;
    published?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    posts: Post[];
    total: number;
  }>;
  create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
}

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  create(comment: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment>;
  update(id: string, data: Partial<Comment>): Promise<Comment>;
  delete(id: string): Promise<void>;
}

export interface TagRepository {
  findById(id: string): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  create(tag: Omit<Tag, "id">): Promise<Tag>;
  connectToPost(tagId: string, postId: string): Promise<void>;
  disconnectFromPost(tagId: string, postId: string): Promise<void>;
}

export interface ImageRepository {
  findById(id: string): Promise<Image | null>;
  findByUserId(userId: string): Promise<Image[]>;
  create(image: Omit<Image, "id" | "createdAt" | "updatedAt">): Promise<Image>;
  update(id: string, data: Partial<Image>): Promise<Image>;
  delete(id: string): Promise<void>;
}