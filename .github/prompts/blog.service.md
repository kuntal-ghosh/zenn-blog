# TipTap Editor API Service Implementation

## Overview

Implement a complete API service for our TipTap-based rich text editor that handles storing, retrieving, and manipulating editor content from our Simple Editor component at `/src/components/tiptap-templates/simple/simple-editor.tsx`.

## Requirements

### API Endpoints

Create the following RESTful endpoints:

1. `POST /api/editor/content` - Create new editor content

   - Request body should include title, content (JSON), authorId
   - Return created post with 201 status code

2. `GET /api/editor/content/:id` - Retrieve specific editor content

   - Return full post data including author details
   - Include appropriate error handling for not found (404)

3. `PUT /api/editor/content/:id` - Update existing editor content

   - Support partial updates (content, title, published status)
   - Return updated post with 200 status code

4. `DELETE /api/editor/content/:id` - Delete editor content

   - Implement soft delete or hard delete based on project requirements
   - Return success message with 200 status code

5. `GET /api/editor/contents` - List all editor contents with pagination
   - Support query parameters: page, limit, authorId, publishedOnly
   - Return paginated results with metadata (total count, pages)

### Data Model

Implement a Prisma schema for the Post model with the following structure:

```typescript
model Post {
  id        String    @id @default(cuid())
  title     String
  slug      String    @unique
  content   Json      // Store TipTap JSON content structure
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  comments  Comment[]
  tags      Tag[]     @relation("PostToTag")
  // Add versioning fields if needed
}
```

### Content Requirements

The API should support all TipTap editor features:

- Text formatting (bold, italic, underline)
- Headings (levels 1-6)
- Lists (bullet, ordered, task lists)
- Code blocks and blockquotes
- Text alignment
- Links and highlights
- Images with storage solution

### Technical Implementation

1. **TypeScript Types**:

   - Create interfaces for request/response models
   - Use strong typing for all functions and variables

2. **Image Handling**:

   - Implement separate endpoint for image uploads
   - Store image metadata in database
   - Generate optimized versions (thumbnails)

3. **Content Processing**:

   - Validate TipTap JSON structure
   - Sanitize HTML content for security
   - Generate and validate unique slugs

4. **Authentication**:

   - Protect all endpoints with authentication middleware
   - Implement proper authorization checks

5. **Error Handling**:
   - Use consistent error pattern
   - Return appropriate HTTP status codes
   - Include descriptive error messages

## Implementation Guide

### File Structure

Follow the Next.js API route convention:

- `/src/app/api/editor/content/route.ts` (POST, GET all)
- `/src/app/api/editor/content/[id]/route.ts` (GET, PUT, DELETE)
- `/src/app/api/editor/image/route.ts` (image upload handling)
- `/src/lib/validators/editor.ts` (validation schemas)
- `/src/types/editor.ts` (TypeScript interfaces)

### Implementation Pattern

For each API route, follow this pattern:

```typescript
import {
  withErrorHandling,
  createSuccessResponse,
} from "@/lib/api/errorHandler";
import prisma from "@/prisma/client";
import { auth } from "@/lib/auth";

export const POST = withErrorHandling(async (request: Request) => {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Parse and validate request data
  const data = await request.json();

  // 3. Process data (create slug, sanitize content, etc.)
  const slug = generateSlug(data.title);

  // 4. Perform database operation
  const result = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      authorId: session.user.id,
      // other fields
    },
  });

  // 5. Return standardized success response
  return createSuccessResponse(result, 201, "editor.content.createSuccess");
});
```

### Image Processing Example

```typescript
export const POST = withErrorHandling(async (request: Request) => {
  // Authentication check

  // Parse form data with uploaded file
  const formData = await request.formData();
  const file = formData.get("image") as File;

  // Validate file (type, size, etc.)

  // Process image (resize, optimize)

  // Store to cloud storage (S3, Cloudinary, etc.)

  // Return URL and metadata
});
```

## Testing Requirements

- Write unit tests for validation logic
- Create integration tests for each API endpoint
- Test error scenarios and edge cases

## Security Considerations

- Implement rate limiting
- Validate all user inputs
- Sanitize HTML content
- Ensure proper authentication and authorization
