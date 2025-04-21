/**
 * Feature: TipTap Editor API Types
 * Description: TypeScript interfaces for TipTap Editor API requests and responses
 */

import { User } from "@prisma/client";

/**
 * Basic structure of TipTap content
 */
export interface TipTapContent {
  type: string;
  content: Array<TipTapNode>;
  [key: string]: any;
}

/**
 * Generic TipTap Node structure
 */
export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: Array<TipTapNode>;
  marks?: Array<TipTapMark>;
  text?: string;
  [key: string]: any;
}

/**
 * TipTap Mark structure
 */
export interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
  [key: string]: any;
}

/**
 * Request interface for creating editor content
 */
export interface CreateEditorContentRequest {
  title: string;
  content: TipTapContent;
  published?: boolean;
  tags?: string[];
}

/**
 * Request interface for updating editor content
 */
export interface UpdateEditorContentRequest {
  title?: string;
  content?: TipTapContent;
  published?: boolean;
  tags?: string[];
}

/**
 * Response interface for editor content
 */
export interface EditorContentResponse {
  id: string;
  title: string;
  slug: string;
  content: TipTapContent;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  authorId?: string;
  publishedOnly?: boolean;
}

/**
 * Interface for paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Interface for image upload request
 */
export interface ImageUploadRequest {
  file: File;
  alt?: string;
}

/**
 * Interface for image upload response
 */
export interface ImageUploadResponse {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

/**
 * Interface for API error response
 */
export interface ApiErrorResponse {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Interface for API success response
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}
