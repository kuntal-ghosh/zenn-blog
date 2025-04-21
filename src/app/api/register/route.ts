import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/api/auth-service.server";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  console.log("🚀 ~ POST ~ request:", request);

  // Parse request body as JSON
  const body = await request.json();

  // Extract email and password with type safety
  const { email, password } = body as { email?: string; password?: string };

  // Validate required fields
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser(email, password);

    if (user) {
      // Create a session token
      const sessionToken = await createSession(user.id);

      // Set the session cookie
      setSessionCookie(sessionToken);
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  try {
    const user = await registerUser(email, password);

    if (user) {
      // Create a session token
      const sessionToken = await createSession(user.id);

      // Set the session cookie
      setSessionCookie(sessionToken);
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
