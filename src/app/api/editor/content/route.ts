/**
 * Feature: TipTap Editor Content API
 * Description: API endpoints for creating new editor content and listing all content
 */

import { NextRequest } from "next/server";
import {
  withErrorHandling,
  createSuccessResponse,
  unauthorized,
  ApiError,
  ErrorCode,
} from "@/lib/api/errorHandler";
import {
  createEditorContentSchema,
  paginationSchema,
} from "@/lib/validators/editor";
import prisma from "@/lib/db/client"; // Assuming this is your Prisma client instance
import { auth } from "@/lib/auth";
import { PaginatedResponse, EditorContentResponse } from "@/types/editor";

/**
 * Generate a URL-friendly slug from a title
 * @param title The title to generate a slug from
 * @param existingSlug Optional existing slug to check against
 * @returns A unique slug
 */
async function generateSlug(
  title: string,
  existingSlug?: string
): Promise<string> {
  // Convert title to lowercase, replace spaces with hyphens, and remove special characters
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // If slug is empty, generate a random one
  if (!slug) {
    slug = `post-${Date.now()}`;
  }

  // Check if slug already exists and append a suffix if needed
  let finalSlug = slug;
  let counter = 1;

  // Skip check if we're just validating the existing slug
  if (existingSlug && existingSlug === finalSlug) {
    return finalSlug;
  }

  while (true) {
    // Check if slug already exists in database
    const existingPost = await prisma.post.findUnique({
      where: { slug: finalSlug },
    });

    if (!existingPost) {
      break;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

/**
 * POST handler for creating new editor content
 */
export const POST = withErrorHandling(async (request: Request) => {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    throw unauthorized("You must be logged in to create content");
  }

  // 2. Parse and validate request data
  const data = await request.json();
  const validatedData = createEditorContentSchema.parse(data);

  // 3. Generate slug from title
  const slug = await generateSlug(validatedData.title);

  // 4. Process tags if provided
  let tagsData = undefined;
  if (validatedData.tags && validatedData.tags.length > 0) {
    tagsData = {
      connectOrCreate: validatedData.tags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      })),
    };
  }

  // 5. Create post in database
  const post = await prisma.post.create({
    data: {
      title: validatedData.title,
      slug,
      content: validatedData.content,
      published: validatedData.published ?? false,
      author: {
        connect: { id: session.user.id },
      },
      ...(tagsData ? { tags: tagsData } : {}),
    },
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
  });

  // 6. Return formatted response
  return createSuccessResponse(post, 201, "Content created successfully");
});

/**
 * GET handler for listing all editor content with pagination
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  // 1. Authenticate user (optional, depends on if you want to restrict access)
  const session = await auth();

  // 2. Parse and validate query parameters
  const searchParams = request.nextUrl.searchParams;

  // Get raw values from search params
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const authorId = searchParams.get("authorId");
  const publishedOnly = searchParams.get("publishedOnly");

  // Pre-process pagination values with defensive defaults
  const pageNumber = rawPage ? parseInt(rawPage, 10) : 1;
  const limitNumber = rawLimit ? parseInt(rawLimit, 10) : 10;

  // Ensure minimum valid values
  const page = Math.max(1, pageNumber); // Ensure page is at least 1
  const limit = Math.min(Math.max(1, limitNumber), 100); // Between 1 and 100

  try {
    // Validate with schema
    const validatedParams = paginationSchema.parse({
      page,
      limit,
      authorId,
      publishedOnly: publishedOnly === "true",
    });

    // 3. Build filter conditions
    const filter: any = {};

    // Filter by author if specified
    if (validatedParams.authorId) {
      filter.authorId = validatedParams.authorId;
    }

    // Filter by published status if specified
    if (validatedParams.publishedOnly) {
      filter.published = true;
    } else if (!session?.user?.id) {
      // If user is not authenticated, only show published content
      filter.published = true;
    }

    // 4. Calculate pagination values
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // 5. Execute query with pagination
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: filter,
        skip,
        take: validatedParams.limit,
        orderBy: { createdAt: "desc" },
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
    const totalPages = Math.ceil(totalCount / validatedParams.limit);

    const response: PaginatedResponse<EditorContentResponse> = {
      data: posts as any, // Type casting since our DB model maps to EditorContentResponse
      metadata: {
        total: totalCount,
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalPages,
        hasNext: validatedParams.page < totalPages,
        hasPrevious: validatedParams.page > 1,
      },
    };

    // 7. Return response
    return createSuccessResponse(response);
  } catch (error) {
    // Handle validation errors gracefully with default pagination
    console.error("Pagination validation error:", error);

    // Continue with default safe values
    const filter: any = {};

    // Apply authorization filter even if validation failed
    if (authorId) {
      filter.authorId = authorId;
    }

    // Handle published filter
    if (publishedOnly === "true") {
      filter.published = true;
    } else if (!session?.user?.id) {
      filter.published = true;
    }

    // Execute query with safe defaults
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: filter,
        skip: 0,
        take: 10, // Safe default
        orderBy: { createdAt: "desc" },
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

    // Return with default pagination
    const totalPages = Math.ceil(totalCount / 10);

    const response: PaginatedResponse<EditorContentResponse> = {
      data: posts as any,
      metadata: {
        total: totalCount,
        page: 1, // Default to first page
        limit: 10, // Default limit
        totalPages,
        hasNext: 1 < totalPages,
        hasPrevious: false, // First page has no previous
      },
    };

    return createSuccessResponse(response);
  }
});

