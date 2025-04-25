/**
 * Error handling middleware for Next.js route handlers
 * Provides consistent error responses while allowing route-specific customization
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  AppError, 
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError
} from "@/types/errors";

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

type ErrorHandlingOptions = {
  logErrors?: boolean;
  customErrorMap?: Record<string, (error: Error) => NextResponse>;
};

/**
 * Wraps a route handler with standardized error handling
 * 
 * @param handler The route handler function to wrap
 * @param options Configuration options for error handling
 * @returns A wrapped handler with error handling
 */
export const withErrorHandling = (
  handler: RouteHandler,
  options: ErrorHandlingOptions = { logErrors: true }
): RouteHandler => {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error: unknown) {
      // Default to logging errors unless explicitly disabled
      if (options.logErrors !== false) {
        console.error(`[API Error] ${request.method} ${request.url}:`, error);
      }
      
      // Handle custom error mappings if provided
      if (options.customErrorMap && error instanceof Error) {
        const customHandler = options.customErrorMap[error.constructor.name];
        if (customHandler) {
          return customHandler(error);
        }
      }
      
      // Handle known AppError types
      if (error instanceof AppError) {
        return NextResponse.json(
          { 
            error: {
              message: error.message,
              type: error.name
            }
          },
          { status: error.statusCode }
        );
      }
      
      // Handle Prisma errors
      if (error instanceof Error && error.name.startsWith('Prisma')) {
        if (error.message.includes('Record to update not found') || 
            error.message.includes('Record to delete does not exist')) {
          return NextResponse.json(
            { error: { message: 'Resource not found', type: 'NotFoundError' } },
            { status: 404 }
          );
        }
        
        if (error.message.includes('Unique constraint failed')) {
          return NextResponse.json(
            { error: { message: 'Resource already exists', type: 'ConflictError' } },
            { status: 409 }
          );
        }
      }
      
      // Handle unexpected errors
      return NextResponse.json(
        { 
          error: { 
            message: 'An unexpected error occurred',
            type: 'InternalServerError'
          } 
        },
        { status: 500 }
      );
    }
  };
};