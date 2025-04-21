/**
 * Feature: User Logout
 * Description: API endpoint to clear user session and cookies
 */

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  // Clear the session cookie
  clearSessionCookie();

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
