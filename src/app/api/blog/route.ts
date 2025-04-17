import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/features/blog/api/blog-service.server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Await params before accessing its properties
  const slugParam = await Promise.resolve(params);
  const { slug } = slugParam;

  try {
    const blogPost = await getBlogPostBySlug(slug);

    if (!blogPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching blog post" },
      { status: 500 }
    );
  }
}
