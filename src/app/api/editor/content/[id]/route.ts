/**
 * Feature: TipTap Editor Content API - Individual Post Operations
 * Description: API endpoints for retrieving, updating, and deleting specific editor content
 */

import {
  withErrorHandling,
  createSuccessResponse,
  notFound,
  unauthorized,
  forbidden,
} from "@/lib/api/errorHandler";
import { updateEditorContentSchema } from "@/lib/validators/editor";
import prisma from "@/lib/db/client";
import { auth } from "@/lib/auth";

/**
 * Helper function to get post by ID with author and tags
 */
async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
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
}

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

    if (!existingPost || existingPost.id === existingSlug) {
      break;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

/**
 * GET handler for retrieving a specific post by ID
 */
export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: { id: string } }) => {
    // 1. Extract post ID from params
    const { id } = params;

    // 2. Fetch post from database
    const post = await getPostById(id);

    // 3. Handle not found
    if (!post) {
      throw notFound("Post not found");
    }

    // 4. Check if post is published or user is authorized
    const session = await auth();
    const isAuthor = session?.user?.id === post.authorId;
    const isAdmin = session?.user?.id === "admin-id"; // Implement proper admin check based on your auth system

    if (!post.published && !isAuthor && !isAdmin) {
      throw notFound("Post not found"); // Using notFound instead of forbidden for security
    }

    // 5. Return post data
    return createSuccessResponse(post);
  }
);

/**
 * PUT handler for updating a specific post
 */
export const PUT = withErrorHandling(
  async (request: Request, { params }: { params: { id: string } }) => {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to update content");
    }

    // 2. Extract post ID from params
    const { id } = params;

    // 3. Fetch existing post
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw notFound("Post not found");
    }

    // 4. Check if user has permission to update
    if (existingPost.authorId !== session.user.id) {
      throw forbidden("You do not have permission to update this post");
    }

    // 5. Parse and validate request data
    const data = await request.json();
    const validatedData = updateEditorContentSchema.parse(data);

    // 6. Generate new slug if title is being updated
    let slug = existingPost.slug;
    if (validatedData.title) {
      slug = await generateSlug(validatedData.title, existingPost.id);
    }

    // 7. Process tags if provided
    let tagsData = undefined;
    if (validatedData.tags) {
      // If tags are provided, we replace all existing tags with the new ones
      tagsData = {
        set: [], // Clear existing tags
        connectOrCreate: validatedData.tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      };
    }

    // 8. Update post in database
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(validatedData.title ? { title: validatedData.title, slug } : {}),
        ...(validatedData.content ? { content: validatedData.content } : {}),
        ...(validatedData.published !== undefined
          ? { published: validatedData.published }
          : {}),
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

    // 9. Return updated post
    return createSuccessResponse(updatedPost, 200, "Post updated successfully");
  }
);

/**
 * DELETE handler for removing a specific post
 */
export const DELETE = withErrorHandling(
  async (_request: Request, { params }: { params: { id: string } }) => {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to delete content");
    }

    // 2. Extract post ID from params
    const { id } = params;

    // 3. Fetch existing post
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw notFound("Post not found");
    }

    // 4. Check if user has permission to delete
    if (existingPost.authorId !== session.user.id) {
      throw forbidden("You do not have permission to delete this post");
    }

    // 5. Delete post from database
    await prisma.post.delete({
      where: { id },
    });

    // 6. Return success message
    return createSuccessResponse({ id }, 200, "Post deleted successfully");
  }
);
