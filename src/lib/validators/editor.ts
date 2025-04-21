/**
 * Feature: TipTap Editor Validation
 * Description: Zod validation schemas for TipTap editor content
 */

import { z } from "zod";

/**
 * Step 1: Define base schema for TipTap node validation
 * Creates a recursive schema that can validate the nested structure of TipTap content
 */
// Define a recursive schema for TipTap nodes
export const tipTapMarkSchema = z
  .object({
    type: z.string(),
    attrs: z.record(z.any()).optional(),
  })
  .passthrough();

// Using z.lazy for recursion to allow nodes to contain other nodes
export const tipTapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      type: z.string(),
      attrs: z.record(z.any()).optional(),
      content: z.array(tipTapNodeSchema).optional(),
      marks: z.array(tipTapMarkSchema).optional(),
      text: z.string().optional(),
    })
    .passthrough()
);

/**
 * Step 2: Create schema for TipTap document structure
 * Ensures the document has the required 'doc' type as the root element
 */
export const tipTapDocumentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(tipTapNodeSchema),
  })
  .passthrough();

/**
 * Step 3: Define validation schemas for API requests
 */

// Schema for pagination parameters
export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  authorId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  publishedOnly: z.coerce.boolean().optional().default(false),
});

// Schema for creating new editor content
export const createEditorContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  content: tipTapDocumentSchema,
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
});

// Schema for updating existing editor content
export const updateEditorContentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be 255 characters or less")
      .optional(),
    content: tipTapDocumentSchema.optional(),
    published: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Schema for image uploads
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "A file must be provided" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be 5MB or less",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        ),
      {
        message: "File must be a valid image format (JPEG, PNG, GIF, or WEBP)",
      }
    ),
  alt: z.string().optional(),
});

/**
 * Summary:
 * 1. Created recursive Zod schemas to validate complex TipTap JSON structure
 * 2. Implemented validation for document root with required 'doc' type
 * 3. Developed dedicated schemas for each API operation (create, update, pagination)
 * 4. Added image upload validation with file type and size restrictions
 *
 * Schema design considerations:
 * - Used recursive schema definition to handle nested content structure
 * - Applied strict validation for required fields while allowing optional fields
 * - Added refinements to ensure data integrity (e.g., requiring update fields)
 * - Implemented transformations for query parameters to handle null values
 */
