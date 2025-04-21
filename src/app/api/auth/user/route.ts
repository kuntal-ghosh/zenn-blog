/**
 * Feature: Current User Information
 * Description: API endpoint to retrieve the currently authenticated user
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // Get the current user session
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return the user information
    return NextResponse.json(session.user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication error" },
      { status: 401 }
    );
  }
}
