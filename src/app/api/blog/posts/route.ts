/**
 * Feature: Public Blog Posts API
 * Description: API endpoint for accessing published blog posts without authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BlogApiAdapter } from "@/features/blog/api/blog-api";
import { PostUseCases } from "@/core/application/use-cases/post-use-cases";
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post-repository";
import { prisma } from "@/infrastructure/database/prisma-client";
import { withErrorHandling } from "@/lib/middleware/with-error-handling";
import { UnauthorizedError, ValidationError, NotFoundError } from "@/types/errors";
import { ensureValidTipTapContent } from "@/lib/tiptap-content-helper";

/**
 * Creates a standardized success response with the provided data and metadata
 */
export function createSuccessResponse(data: any, meta: any = null, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: 'true',
      data,
      meta,
    },
    { status }
  );
}

/**
 * Creates metadata object for paginated responses
 */
export function createMetaResponse(page: number, limit: number, total: number, hasMore: boolean = false) {
  return {
    pagination: {
      page,
      limit,
      total,
      hasMore
    },
    timestamp: new Date().toISOString()
  };
}

// Create dependencies
const postRepository = new PrismaPostRepository(prisma);
// We're missing the tag repository implementation, but for now let's create a placeholder
const tagRepository = {
  findByName: () => Promise.resolve(null),
  findById: () => Promise.resolve(null),
  findAll: () => Promise.resolve([]),
  create: (tag: any) => Promise.resolve({ id: "placeholder", ...tag }),
  connectToPost: () => Promise.resolve(),
  disconnectFromPost: () => Promise.resolve(),
} as any;

const postUseCases = new PostUseCases(postRepository, tagRepository);
const blogApiAdapter = new BlogApiAdapter(postUseCases);

// Route Handlers with error handling middleware
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Parse pagination parameters
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  
  // Validate pagination parameters
  if (isNaN(page) || page < 1) {
    throw new ValidationError("Page must be a positive number");
  }
  if (isNaN(limit) || limit < 1 || limit > 50) {
    throw new ValidationError("Limit must be between 1 and 50");
  }
  
  // Parse filtering parameters
  const published = searchParams.get("published") === "true" ? true : undefined;
  const authorId = searchParams.get("authorId") ?? undefined;
  
  // Use the blogApiAdapter to get data
  const result = await blogApiAdapter.listPosts({
    page,
    limit,
    published,
    authorId,
    sortBy: searchParams.get("sortBy") ?? "createdAt",
    sortOrder: (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc",
  });
  
  // Handle adapter response
  if (!result.success) {
    // Map adapter errors to appropriate error types
    if (result.status === 404) {
      throw new NotFoundError(result.error);
    } else if (result.status === 400) {
      throw new ValidationError(result.error);
    } else {
      throw new Error(result.error);
    }
  }
  
  // Get the response data
  const responseData = result.data;
  
  // Create metadata for the response using available information
  // Assuming your API returns some count information, if not, we'll use sensible defaults
  const meta = createMetaResponse(
    page, 
    limit, 
    // Use appropriate properties from your API response or default values
    typeof responseData === 'object' && responseData !== null ? 
      (responseData as any).count ?? 0 : 0,
    // Determine if there are more pages based on available data
    typeof responseData === 'object' && responseData !== null ? 
      (responseData as any).hasMore ?? false : false
  );
  
  // Return standardized success response
  return createSuccessResponse(responseData, meta);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Check authentication
  const session = await auth();
  
  if (!session?.user) {
    throw new UnauthorizedError();
  }

  // Get user from session
  const userEmail = session.user.email;
  if (!userEmail) {
    throw new ValidationError("User email not found");
  }

  // Parse request body
  const body = await request.json();
  
  // Add the authorId to the request body
  const postData = {
    ...body,
    authorId: session.user.id
  };
  
  // Basic validation
  if (!postData.title || typeof postData.title !== 'string' || postData.title.trim() === '') {
    throw new ValidationError("Title is required");
  }
  
  if (!postData.content) {
    throw new ValidationError("Content is required");
  }
  
  // Call the adapter to get data
  const result = await blogApiAdapter.createPost(postData);
  
  // Handle adapter response
  if (!result.success) {
    // Map adapter errors to appropriate error types
    if (result.status === 404) {
      throw new NotFoundError(result.error);
    } else if (result.status === 400) {
      throw new ValidationError(result.error);
    } else {
      throw new Error(result.error);
    }
  }
  
  // Create metadata for the response
  const meta = {
    timestamp: new Date().toISOString(),
    createdBy: session.user.id
  };
  
  // Return standardized success response with status 201 for resource creation
  return createSuccessResponse(result.data, meta, 201);
}, {
  // Custom error handling for specific routes if needed
  customErrorMap: {
    // Example of route-specific error handling
    'PrismaClientKnownRequestError': (error) => {
      const meta = { timestamp: new Date().toISOString() };
      
      if (error.message.includes('Unique constraint failed on the fields: (`slug`)')) {
        return NextResponse.json(
          {
            status: 'error',
            error: { message: 'A post with this title already exists. Please choose a different title.', type: 'ConflictError' },
            meta
          },
          { status: 409 }
        );
      }
      // Fall back to default error handling
      return NextResponse.json(
        {
          status: 'error',
          error: { message: 'Database error occurred', type: 'InternalServerError' },
          meta
        },
        { status: 500 }
      );
    }
  }
});
