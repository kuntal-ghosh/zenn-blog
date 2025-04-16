import { NextResponse } from "next/server";
import { prisma } from "@/shared/utils/db";
import { User } from "../types";

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in the response
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateUser(
  userId: string,
  userData: Partial<User>
): Promise<User | null> {
  try {
    // Make sure we never update the password through this method
    const { password, ...safeUserData } = userData as any;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: safeUserData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in the response
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        tags: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

export async function handleUserRequest(req: Request) {
  const { method } = req;
  const { userId, userData } = await req.json();

  switch (method) {
    case "GET":
      const user = await getUserById(userId);
      return NextResponse.json(user);
    case "PUT":
      const updatedUser = await updateUser(userId, userData);
      return NextResponse.json(updatedUser);
    case "DELETE":
      const success = await deleteUser(userId);
      return NextResponse.json({ success });
    default:
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
  }
}
