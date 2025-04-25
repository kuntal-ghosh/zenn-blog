/**
 * Container component for listing blog posts
 * Handles data fetching and pagination
 */

import { PostListResponseDTO } from "@/core/application/dto/post-dto";
import BlogList from "../presentational/BlogList";

interface BlogListContainerProps {
  page?: number;
  limit?: number;
  tag?: string;
}

async function getPosts(
  page: number = 1,
  limit: number = 10,
  tag?: string
): Promise<PostListResponseDTO> {
  try {
    // Construct query parameters
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("published", "true"); // Only show published posts
    
    if (tag) {
      params.set("tag", tag);
    }
    
    // In a real implementation, we would use a repository or service
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/posts?${params.toString()}`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    );
    
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    // Return empty response as fallback
    return {
      posts: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export default async function BlogListContainer({
  page = 1,
  limit = 10,
  tag,
}: BlogListContainerProps) {
  const response = await getPosts(page, limit, tag);
  
  return (
    <BlogList 
      posts={response.posts}
      currentPage={response.page}
      totalPages={response.totalPages}
    />
  );
}
