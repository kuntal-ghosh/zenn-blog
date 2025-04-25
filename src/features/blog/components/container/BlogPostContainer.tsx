/**
 * Container component for a single blog post
 * Handles data fetching and provides data to presentational components
 */

import { PostResponseDTO } from "@/core/application/dto/post-dto";
import BlogPost from "../presentational/BlogPost";

interface BlogPostContainerProps {
  slug: string;
}

async function getPost(slug: string): Promise<PostResponseDTO | null> {
  try {
    // In a real implementation, this would use a service or repository
    // For now, we're using a direct fetch to the API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${slug}`, {
      next: { revalidate: false }, // Revalidate every minute
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export default async function BlogPostContainer({ slug }: BlogPostContainerProps) {
  const post = await getPost(slug);
  console.log("🚀 ~ BlogPostContainer ~ post:", post)
  
  
  if (!post) {
    return <div className="py-8 text-center">Post not found</div>;
  }
  
  return <BlogPost post={post} />;
}