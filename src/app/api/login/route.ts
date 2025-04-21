import { NextResponse } from "next/server";
import { loginUser } from "@/features/auth/api/auth-service.server";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await loginUser(email, password);
    
    if (user) {
      // Create a session token
      const sessionToken = await createSession(user.id);
      
      // Set the session cookie
      setSessionCookie(sessionToken);
      
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  try {
    const user = await loginUser(email, password);
    
    if (user) {
      // Create a session token
      const sessionToken = await createSession(user.id);
      
      // Set the session cookie
      setSessionCookie(sessionToken);
      
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}
