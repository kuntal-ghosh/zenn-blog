/**
 * Feature: TipTap Editor Service
 * Description: Frontend service layer for interacting with the TipTap Editor API
 */

import {
  CreateEditorContentRequest,
  EditorContentResponse,
  ImageUploadRequest,
  ImageUploadResponse,
  PaginatedResponse,
  PaginationParams,
  UpdateEditorContentRequest,
} from "@/types/editor";

/**
 * Class that provides methods to interact with the Editor API
 */
export class EditorService {
  /**
   * Creates new editor content
   * @param data The content data to create
   * @returns The created content
   */
  static async createContent(
    data: CreateEditorContentRequest
  ): Promise<EditorContentResponse> {
    const response = await fetch("/api/editor/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create content");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Retrieves editor content by ID
   * @param id The ID of the content to retrieve
   * @returns The requested content
   */
  static async getContentById(id: string): Promise<EditorContentResponse> {
    const response = await fetch(`/api/editor/content/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to retrieve content");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Updates existing editor content
   * @param id The ID of the content to update
   * @param data The updated content data
   * @returns The updated content
   */
  static async updateContent(
    id: string,
    data: UpdateEditorContentRequest
  ): Promise<EditorContentResponse> {
    const response = await fetch(`/api/editor/content/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update content");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Deletes editor content
   * @param id The ID of the content to delete
   * @returns The deletion result
   */
  static async deleteContent(id: string): Promise<{ id: string }> {
    const response = await fetch(`/api/editor/content/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete content");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Lists all editor content with pagination
   * @param params Optional pagination parameters
   * @returns Paginated list of content
   */
  static async listContent(
    params?: PaginationParams
  ): Promise<PaginatedResponse<EditorContentResponse>> {
    // Build query string from params
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.set("page", params.page.toString());
    }

    if (params?.limit) {
      queryParams.set("limit", params.limit.toString());
    }

    if (params?.authorId) {
      queryParams.set("authorId", params.authorId);
    }

    if (params?.publishedOnly !== undefined) {
      queryParams.set("publishedOnly", params.publishedOnly.toString());
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    const response = await fetch(`/api/editor/content${queryString}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to list content");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Uploads an image for use in the editor
   * @param image The image file to upload
   * @param alt Optional alt text for the image
   * @returns The uploaded image data
   */
  static async uploadImage(
    image: File,
    alt?: string
  ): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("file", image);

    if (alt) {
      formData.append("alt", alt);
    }

    const response = await fetch("/api/editor/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Lists all uploaded images with pagination
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 50)
   * @param userId Optional filter by user ID
   * @returns Paginated list of images
   */
  static async listImages(
    page = 1,
    limit = 50,
    userId?: string
  ): Promise<PaginatedResponse<ImageUploadResponse>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (userId) {
      queryParams.set("userId", userId);
    }

    const response = await fetch(
      `/api/editor/image?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to list images");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Lists all published blog posts without requiring authentication
   * Can be used for public facing blog pages
   * @param params Optional pagination and filter parameters
   * @returns Paginated list of published posts
   */
  static async listPublishedPosts(
    params: {
      page?: number;
      limit?: number;
      tag?: string;
      q?: string;
      sortBy?: "createdAt" | "updatedAt" | "title";
      sortOrder?: "asc" | "desc";
    } = {}
  ): Promise<PaginatedResponse<EditorContentResponse>> {
    const queryParams = new URLSearchParams();

    // Add all provided parameters to query string
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.tag) queryParams.set("tag", params.tag);
    if (params.q) queryParams.set("q", params.q);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

    // Fetch data from the public API endpoint
    const response = await fetch(`/api/blog/posts?${queryParams.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch published posts");
    }

    const result = await response.json();
    return result.data;
  }
}

/**
 * Summary:
 * - Created a comprehensive service class for interacting with the TipTap Editor API
 * - Implemented methods for managing content (create, read, update, delete, list)
 * - Added image upload and listing functionality
 * - Included proper error handling for all API calls
 * - Provided type safety through TypeScript interfaces
 *
 * Usage example:
 *
 * // Create new content
 * const newPost = await EditorService.createContent({
 *   title: "My New Post",
 *   content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world!" }] }] }
 * });
 *
 * // Upload an image
 * const imageFile = event.target.files[0];
 * const uploadedImage = await EditorService.uploadImage(imageFile, "My descriptive alt text");
 */
