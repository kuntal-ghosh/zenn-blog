/**
 * Feature: TipTap Editor Image API
 * Description: API endpoint for uploading and managing images for the TipTap editor
 */

import {
  withErrorHandling,
  createSuccessResponse,
  unauthorized,
  ApiError,
  ErrorCode,
} from "@/lib/api/errorHandler";
import { imageUploadSchema } from "@/lib/validators/editor";
import prisma from "@/lib/db/client";
import { auth } from "@/lib/auth";
import { ImageUploadResponse } from "@/types/editor";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir, stat } from "fs/promises";
import sharp from "sharp"; // You may need to install sharp: npm install sharp

// Configuration for image uploads
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const THUMBNAIL_SIZE = 300;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Ensures the upload directory exists
 */
async function ensureUploadDir() {
  try {
    await stat(UPLOAD_DIR);
  } catch (error) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Generates a unique filename for uploaded images
 * @param originalName Original filename
 * @returns Unique filename with timestamp
 */
function generateUniqueFilename(originalName: string): string {
  const extension = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Processes and saves an uploaded image
 * @param file The uploaded file
 * @returns Object with image metadata and URLs
 */
async function processAndSaveImage(file: File): Promise<{
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}> {
  // 1. Ensure upload directory exists
  await ensureUploadDir();

  // 2. Read file data
  const fileData = Buffer.from(await file.arrayBuffer());

  // 3. Generate unique filenames
  const fileName = generateUniqueFilename(file.name);
  const thumbnailName = `thumb-${fileName}`;

  // 4. Process and save original image
  const filePath = join(UPLOAD_DIR, fileName);
  await writeFile(filePath, fileData);

  // 5. Create thumbnail
  const thumbnailPath = join(UPLOAD_DIR, thumbnailName);
  await sharp(fileData).resize(THUMBNAIL_SIZE).toFile(thumbnailPath);

  // 6. Get image dimensions with sharp
  const metadata = await sharp(fileData).metadata();

  // 7. Return image metadata and URLs
  return {
    url: `/uploads/${fileName}`,
    thumbnailUrl: `/uploads/${thumbnailName}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * POST handler for uploading images
 */
export const POST = withErrorHandling(async (request: Request) => {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    throw unauthorized("You must be logged in to upload images");
  }

  // 2. Parse and validate form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const alt = formData.get("alt") as string | null;

  // 3. Validate the file upload
  if (!file) {
    throw new ApiError("No file provided", ErrorCode.VALIDATION_ERROR, 400);
  }

  // 4. Validate using our schema
  const validatedData = imageUploadSchema.parse({
    file,
    alt: alt || undefined,
  });

  // 5. Process and save the image
  const imageData = await processAndSaveImage(validatedData.file);

  // 6. Store image metadata in database
  const image = await prisma.image.create({
    data: {
      url: imageData.url,
      thumbnailUrl: imageData.thumbnailUrl,
      alt: validatedData.alt || null,
      width: imageData.width,
      height: imageData.height,
      size: imageData.size,
      mimeType: imageData.mimeType,
      userId: session.user.id,
    },
  });

  // 7. Return image data
  const response: ImageUploadResponse = {
    id: image.id,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl,
    alt: image.alt,
    width: image.width,
    height: image.height,
    size: image.size,
    mimeType: image.mimeType,
  };

  return createSuccessResponse(response, 201, "Image uploaded successfully");
});

/**
 * GET handler for retrieving all images (with optional filtering)
 */
export const GET = withErrorHandling(async (request: Request) => {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    throw unauthorized("You must be logged in to view images");
  }

  // 2. Parse query parameters
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  // 3. Build filter
  const filter: any = {};
  if (userId) {
    filter.userId = userId;
  }

  // 4. Query database
  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.image.count({ where: filter }),
  ]);

  // 5. Return images with pagination metadata
  return createSuccessResponse({
    data: images,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    },
  });
});
