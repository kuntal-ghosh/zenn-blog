/**
 * Container component for a single blog post
 * Handles data fetching and provides data to presentational components
 */

import { PostResponseDTO } from "@/core/application/dto/post-dto";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { BlogContentWithTOC } from "@/components/markdown/blog-content-with-toc";
// We'll still import BlogPost but use BlogContentWithTOC for the main content
import BlogPost from "../presentational/BlogPost";

interface BlogPostContainerProps {
  slug: string;
}

async function getPost(slug: string): Promise<PostResponseDTO | null> {
  try {
    // In a real implementation, this would use a service or repository
    // For now, we're using a direct fetch to the API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${slug}`,
      {
        next: { revalidate: false }, // Revalidate every minute
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function BlogPostContainer({
  slug,
}: BlogPostContainerProps) {
  const post = await getPost(slug);

  if (!post) {
    return <div className="py-8 text-center">Post not found</div>;
  }

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 mb-6 text-center">Published On: {post.createdAt}</p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-black text-white rounded-full p-1 text-xs">
              N
              </span>
              <span>Next.js</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-blue-400 text-white rounded-full p-1 text-xs">
              ⚛
              </span>
              <span>React</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-blue-600 text-white rounded-full p-1 text-xs">
              TS
              </span>
              <span>TypeScript</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-gray-200 text-gray-700 rounded-full p-1 text-xs">
              #
              </span>
              <span>design</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-blue-500 text-white rounded-full p-1 text-xs">
              □
              </span>
              <span>frontend</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 ">
              <span className="bg-yellow-400 text-white rounded-full p-1 text-xs">
              ≡
              </span>
              <span>Tech</span>
            </Badge>
            </div>
        </div>

        <div className="rounded-lg shadow-sm p-12 mb-8">
          {/* Replace BlogPost with BlogContentWithTOC for proper heading navigation */}
          <BlogContentWithTOC content={post.content} />
        </div>
      </div>
    </article>
  );
}
