/**
 * Data Transfer Objects (DTOs) for posts
 */

export interface PostAuthorDTO {
  id: string;
  name: string | null;
  image: string | null;
  bio?: string | null;
}

export interface TagDTO {
  id: string;
  name: string;
}

export interface CommentDTO {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthorDTO;
}

export interface PostResponseDTO {
  id: string;
  title: string;
  slug: string;
  content: any; // Stored as JSON for TipTap editor
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: PostAuthorDTO;
  tags: TagDTO[];
  comments?: CommentDTO[];
}

export interface CreatePostDTO {
  title: string;
  content: any; // JSON content from TipTap
  slug: string;
  published: boolean;
  tags: { id?: string; name: string }[];
}

export interface UpdatePostDTO {
  id: string;
  title?: string;
  content?: any;
  published?: boolean;
  tags?: string[];
}

export interface PostListOptionsDTO {
  authorId?: string;
  published?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PostListResponseDTO {
  posts: PostResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}