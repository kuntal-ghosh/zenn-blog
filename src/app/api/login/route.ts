import { NextResponse } from "next/server";
import { loginUser } from "@/features/auth/api/auth-service.server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await loginUser(email, password);
    return NextResponse.json(user, { status: 200 });
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
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}
