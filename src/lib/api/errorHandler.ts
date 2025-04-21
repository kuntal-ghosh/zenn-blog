/**
 * Feature: API Error Handling
 * Description: Utility functions for consistent API error handling and responses
 */

import { ApiErrorResponse, ApiSuccessResponse } from "@/types/editor";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

/**
 * Error codes for API responses
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

/**
 * Custom API Error class with standardized structure
 */
export class ApiError extends Error {
  code: string;
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    code: string = ErrorCode.INTERNAL_SERVER_ERROR,
    status: number = 500,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.errors = errors;
  }

  /**
   * Convert to JSON response
   */
  toResponse(): Response {
    const errorResponse: ApiErrorResponse = {
      message: this.message,
      code: this.code,
      status: this.status,
    };

    if (this.errors) {
      errorResponse.errors = this.errors;
    }

    return new Response(JSON.stringify(errorResponse), {
      status: this.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

/**
 * Create standardized success response
 * @param data Response data
 * @param status HTTP status code
 * @param message Success message
 * @returns Response object
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  message: string = "Success"
): Response {
  const successResponse: ApiSuccessResponse<T> = {
    data,
    message,
  };

  return new Response(JSON.stringify(successResponse), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Higher-order function to wrap API route handlers with error handling
 * @param handler API route handler function
 * @returns Wrapped handler function with error handling
 */
export function withErrorHandling(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async function (request: Request, ...args: any[]): Promise<Response> {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error("API Error:", error);

      // Handle specific error types
      if (error instanceof ApiError) {
        return error.toResponse();
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          const path = err.path.join(".");
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });

        return new ApiError(
          "Validation error",
          ErrorCode.VALIDATION_ERROR,
          400,
          formattedErrors
        ).toResponse();
      }

      // Generic error handling
      return new ApiError(
        error instanceof Error ? error.message : "An unexpected error occurred",
        ErrorCode.INTERNAL_SERVER_ERROR,
        500
      ).toResponse();
    }
  };
}

/**
 * Utility function to create a not found error response
 * @param message Error message
 * @returns ApiError instance
 */
export function notFound(message: string = "Resource not found"): ApiError {
  return new ApiError(message, ErrorCode.NOT_FOUND, 404);
}

/**
 * Utility function to create an unauthorized error response
 * @param message Error message
 * @returns ApiError instance
 */
export function unauthorized(message: string = "Unauthorized"): ApiError {
  return new ApiError(message, ErrorCode.UNAUTHORIZED, 401);
}

/**
 * Utility function to create a forbidden error response
 * @param message Error message
 * @returns ApiError instance
 */
export function forbidden(message: string = "Forbidden"): ApiError {
  return new ApiError(message, ErrorCode.FORBIDDEN, 403);
}

/**
 * Utility function to create a conflict error response
 * @param message Error message
 * @returns ApiError instance
 */
export function conflict(message: string = "Resource conflict"): ApiError {
  return new ApiError(message, ErrorCode.CONFLICT, 409);
}
