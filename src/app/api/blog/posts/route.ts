/**
 * Feature: Public Blog Posts API
 * Description: API endpoint for accessing published blog posts without authentication
 */

import { NextRequest } from "next/server";
import {
  withErrorHandling,
  createSuccessResponse,
  ApiError,
  ErrorCode,
} from "@/lib/api/errorHandler";
import prisma from "@/lib/db/client";
import { PaginatedResponse, EditorContentResponse } from "@/types/editor";

/**
 * GET handler for public access to published posts
 * This endpoint returns published blog posts without requiring authentication
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  // 1. Parse and validate query parameters
  const searchParams = request.nextUrl.searchParams;

  // Get raw values from search params
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const tagName = searchParams.get("tag");
  const searchQuery = searchParams.get("q");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Pre-process pagination values with defensive defaults
  const pageNumber = rawPage ? parseInt(rawPage, 10) : 1;
  const limitNumber = rawLimit ? parseInt(rawLimit, 10) : 10;

  // Ensure minimum valid values
  const page = Math.max(1, pageNumber);
  const limit = Math.min(Math.max(1, limitNumber), 100); // Between 1 and 100

  // 2. Build filter conditions
  const filter: any = {
    published: true, // Only return published posts for public access
  };

  // Filter by tag if specified
  if (tagName) {
    filter.tags = {
      some: {
        name: tagName,
      },
    };
  }

  // Add search query filter if provided
  if (searchQuery) {
    filter.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      {
        tags: {
          some: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
      },
    ];
  }

  // 3. Determine sort order
  const validSortFields = ["createdAt", "title", "updatedAt"];
  const validSortOrders = ["asc", "desc"];

  // Use defaults if invalid values are provided
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const finalSortOrder = validSortOrders.includes(sortOrder as any)
    ? sortOrder
    : "desc";

  const orderBy: any = {
    [finalSortBy]: finalSortOrder,
  };

  // 4. Calculate pagination values
  const skip = (page - 1) * limit;

  // 5. Execute query with pagination
  try {
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.post.count({ where: filter }),
    ]);

    // 6. Prepare paginated response
    const totalPages = Math.ceil(totalCount / limit);

    const response: PaginatedResponse<EditorContentResponse> = {
      data: posts as any,
      metadata: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };

    // 7. Return response
    return createSuccessResponse(response);
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw new ApiError(
      "Failed to fetch published posts",
      ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
});
