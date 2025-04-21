/**
 * Feature: Authentication Management
 * Description: User authentication and session management for the blog platform
 */

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import prisma from "@/lib/db/client";
import { cache } from "react";

// Type definitions for auth-related data structures
export interface UserSession {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: UserRole;
  };
  expiresAt: number;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface AuthOptions {
  /** Whether to throw an error when unauthorized (instead of returning null) */
  required?: boolean;
}

// Constants
const TOKEN_NAME = "blog_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_for_development_only"
);
const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Authenticates the current user and returns session data
 * @param options Authentication options
 * @returns User session or null if not authenticated
 */
export const auth = cache(
  async (options: AuthOptions = {}): Promise<UserSession | null> => {
    const { required = false } = options;

    // Get session token from cookies
    const cookieStore =  await cookies();
    const sessionToken = cookieStore.get(TOKEN_NAME)?.value;

    if (!sessionToken) {
      if (required) {
        throw new Error("Authentication required");
      }
      return null;
    }

    try {
      // Verify JWT token
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET, {
        algorithms: ["HS256"],
      });

      // Extract user ID from token
      const userId = payload.sub as string;
      if (!userId) {
        if (required) {
          throw new Error("Invalid session token");
        }
        return null;
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // Add role field if it exists in your User model, otherwise default to USER
          // role: true,
        },
      });

      if (!user) {
        if (required) {
          throw new Error("User not found");
        }
        return null;
      }

      return {
        user: {
          ...user,
          role: UserRole.USER, // Default role if no role field in DB
        },
        expiresAt: (payload.exp as number) || 0,
      };
    } catch (error) {
      // Handle token validation errors
      console.error("Auth error:", error);

      if (required) {
        throw new Error("Authentication failed");
      }

      return null;
    }
  }
);

/**
 * Creates a new user session and returns the session token
 * @param userId The user ID to create a session for
 * @returns JWT session token
 */
export async function createSession(userId: string): Promise<string> {
  // Current timestamp in seconds
  const now = Math.floor(Date.now() / 1000);

  // Create JWT token with user ID and expiry
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Sets the session cookie in the response
 * @param token JWT session token
 */
export function setSessionCookie(token: string): void {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRY,
    path: "/",
  });
}

/**
 * Clears the session cookie (logout)
 */
export function clearSessionCookie(): void {
  cookies().delete(TOKEN_NAME);
}

/**
 * Checks if the current user is authorized for a specific action
 * @param session User session
 * @param authorId The author ID of the resource (for ownership checks)
 * @param requiredRole Minimum role required (optional)
 * @returns Whether the user is authorized
 */
export function isAuthorized(
  session: UserSession | null,
  authorId?: string,
  requiredRole: UserRole = UserRole.USER
): boolean {
  // No session means not authorized
  if (!session?.user) {
    return false;
  }

  // Admin users have access to everything
  if (session.user.role === UserRole.ADMIN) {
    return true;
  }

  // Check role requirements
  if (session.user.role !== requiredRole && requiredRole === UserRole.ADMIN) {
    return false;
  }

  // Check resource ownership (if authorId is provided)
  if (authorId && session.user.id !== authorId) {
    return false;
  }

  return true;
}

/**
 * Summary:
 * 1. Implemented a JWT-based authentication system with cookie storage
 * 2. Created functions for managing user sessions (create, validate, clear)
 * 3. Added authorization utilities for role-based and ownership-based access control
 * 4. Used TypeScript features like enums, interfaces, and explicit return types
 * 5. Implemented caching for performance optimization
 *
 * Security considerations:
 * - Uses secure, HTTP-only cookies in production
 * - JWT tokens are signed and have expiration times
 * - Explicit error handling for authentication failures
 * - Separation between authentication and authorization concerns
 */
