"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Creates a new article in the database
 */
export async function createArticle(data: { title: string; content: string }) {
  // Input validation
  if (!data.title || !data.content) {
    throw new Error("Title and content are required");
  }

  try {
    // Here you would typically save to your database
    // Example:
    // await prisma.article.create({
    //   data: {
    //     title: data.title,
    //     content: data.content,
    //     authorId: session.user.id,
    //   },
    // });

    // For this example, we'll just simulate a successful creation
    console.log("Article created:", data);

    // Revalidate the articles page to show the new article
    revalidatePath("/articles");

    // Redirect to the articles page
    redirect("/articles");
  } catch (error) {
    console.error("Failed to create article:", error);
    throw new Error("Failed to create article. Please try again.");
  }
}
