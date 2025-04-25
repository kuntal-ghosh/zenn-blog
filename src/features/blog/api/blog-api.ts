/**
 * Blog feature API adapter
 * Connects the application layer to the Next.js API routes
 */

import { PostUseCases } from "../../../core/application/use-cases/post-use-cases";
import { CreatePostDTO, UpdatePostDTO, PostListOptionsDTO } from "../../../core/application/dto/post-dto";

export class BlogApiAdapter {
  constructor(private postUseCases: PostUseCases) {}

  async createPost(data: CreatePostDTO) {
    try {
      const post = await this.postUseCases.createPost(data);
      return { success: true, data: post, status: 201 };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Failed to create post", 
        status: 400 
      };
    }
  }

  async getPostBySlug(slug: string) {
    try {
      const post = await this.postUseCases.getPostBySlug(slug);
      if (!post) {
        return { 
          success: false, 
          error: "Post not found", 
          status: 404 
        };
      }
      return { success: true, data: post, status: 200 };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch post",
        status: 500
      };
    }
  }

  async listPosts(options: PostListOptionsDTO) {
    try {
      const result = await this.postUseCases.listPosts(options);
      return { success: true, data: result, status: 200 };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch posts",
        status: 500
      };
    }
  }

  async updatePost(data: UpdatePostDTO) {
    try {
      const post = await this.postUseCases.updatePost(data);
      if (!post) {
        return {
          success: false,
          error: "Post not found",
          status: 404
        };
      }
      return { success: true, data: post, status: 200 };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update post",
        status: 400
      };
    }
  }

  async deletePost(id: string) {
    try {
      await this.postUseCases.deletePost(id);
      return { success: true, status: 200 };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete post",
        status: 500
      };
    }
  }
}