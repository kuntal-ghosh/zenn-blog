import { NextResponse } from "next/server";
import { prisma } from "../../../shared/utils/db";
import { User } from "../types";
import * as bcrypt from "bcrypt";

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Check if user exists and password is correct (should use proper password hashing)
  if (user && (await bcrypt.compare(password, user.password))) {
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  return null;
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user in the database
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Don't return the password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}
