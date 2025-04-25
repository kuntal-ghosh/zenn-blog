/**
 * Blog Post Detail Page
 * Uses the BlogPostContainer from the blog feature
 */

import { Metadata } from "next";
import BlogPostContainer from "@/features/blog/components/container/BlogPostContainer";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // This is a simplified approach - in a real app, you'd fetch the post
  // and generate metadata based on its title and content
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  return {
    title: `${slug.replace(/-/g, " ")} | Blog Site`,
    description: "Read this blog post on our site",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  return (
    <div className="container mx-auto py-8">
      <BlogPostContainer slug={slug} />
    </div>
  );
}