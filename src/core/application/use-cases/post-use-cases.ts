/**
 * Post Use Cases
 * Contains the business logic for post-related operations
 */

import { PostRepository, TagRepository } from "../../domain/interfaces/repositories";
import { 
  CreatePostDTO, 
  UpdatePostDTO, 
  PostListOptionsDTO,
  PostResponseDTO,
  PostListResponseDTO 
} from "../dto/post-dto";

export class PostUseCases {
  constructor(
    private postRepository: PostRepository,
    private tagRepository: TagRepository
  ) {}

  async createPost(data: CreatePostDTO): Promise<PostResponseDTO> {
    // Generate slug from title
    const slug = this.generateSlug(data.title);

    // Create post entity
    const post = await this.postRepository.create({
      title: data.title,
      slug,
      content: data.content,
      published: data.published ?? false,
      authorId: data.authorId,
    });

    // Process tags if provided
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        // Find or create tag
        let tag = await this.tagRepository.findByName(tagName);
        if (!tag) {
          tag = await this.tagRepository.create({ name: tagName });
        }
        // Connect tag to post
        await this.tagRepository.connectToPost(tag.id, post.id);
      }
    }

    // Return the created post
    return this.mapToPostResponseDTO(post);
  }

  async getPostById(id: string): Promise<PostResponseDTO | null> {
    const post = await this.postRepository.findById(id);
    if (!post) return null;
    return this.mapToPostResponseDTO(post);
  }

  async getPostBySlug(slug: string): Promise<PostResponseDTO | null> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) return null;
    return this.mapToPostResponseDTO(post);
  }

  async listPosts(options: PostListOptionsDTO): Promise<PostListResponseDTO> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const { posts, total } = await this.postRepository.findAll({
      authorId: options.authorId,
      published: options.published,
      limit,
      offset: (page - 1) * limit,
      sortBy: options.sortBy || 'createdAt',
      sortOrder: options.sortOrder || 'desc'
    });

    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts.map(this.mapToPostResponseDTO),
      total,
      page,
      limit,
      totalPages
    };
  }

  async updatePost(data: UpdatePostDTO): Promise<PostResponseDTO | null> {
    const post = await this.postRepository.findById(data.id);
    if (!post) return null;

    // Update basic post data
    const updatedPost = await this.postRepository.update(data.id, {
      title: data.title,
      content: data.content,
      published: data.published,
      slug: data.title ? this.generateSlug(data.title) : undefined,
    });

    // Process tags if provided
    if (data.tags) {
      // This is simplified - in a real implementation, you'd handle
      // tag addition and removal more efficiently
      for (const tagName of data.tags) {
        let tag = await this.tagRepository.findByName(tagName);
        if (!tag) {
          tag = await this.tagRepository.create({ name: tagName });
        }
        await this.tagRepository.connectToPost(tag.id, post.id);
      }
    }

    return this.mapToPostResponseDTO(updatedPost);
  }

  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }

  private mapToPostResponseDTO(post: any): PostResponseDTO {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
        image: post.author.image,
      },
      tags: post.tags?.map((tag: any) => ({
        id: tag.id,
        name: tag.name
      }))
    };
  }
}