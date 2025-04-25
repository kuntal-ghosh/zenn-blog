import ArticleCard from "@/components/article-card";
import ContentTabs from "@/components/content/content-tabs";
import type { ContentType, TimeFilter } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import Navigation from "@/components/layout/navigation";
import { PostListResponseDTO } from "@/core/application/dto/post-dto";
import { Key } from "react";

interface HomePageProps {
  readonly searchParams: {
    tab?: string;
    type?: ContentType;
    time?: TimeFilter;
  };
}

async function getPosts(
  page: number = 1,
  limit: number = 50,
  tag?: string
): Promise<any> {
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
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts?${params.toString()}`,
      {
        // next: { revalidate: false }, // Revalidate every minute
      }
    );
    
    if (!res.status ) {
      throw new Error("Failed to fetch posts");
    }
    const {data} = await res.json();
    
    return data?.posts;
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

/**
 * Utility function to calculate days since a date
 */
function getDaysSince(dateString: string): number {
  const postDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * HomePage component
 * Main page of the Zenn platform
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  let page = 1;
  let limit = 50;

  // Fetch posts from API
  const posts = await getPosts(page, limit);
  console.log("🚀 ~ HomePage ~ response:", posts)
  // const { posts  } = response;

  return (
    <>
      <Navigation />
      <div className="min-h-screen z-1">
        <div className="container px-4 py-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <ContentTabs />
              <Link href="/write">
                <Button className="flex items-center gap-2">
                  <PenLine size={16} />
                  <span>Create Post</span>
                </Button>
              </Link>
            </div>

            {/* Recent Section */}
            <section className="mt-8">
              <h2 className="mb-6 text-2xl font-bold">Recent</h2>
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post: { id: Key | null | undefined; title: string; author: { name: any; bio: any; }; createdAt: string; comments: string | any[]; slug: string; }) => (
                    <ArticleCard
                      key={post.id}
                      icon="📝" // You might want to make this dynamic based on post content/category
                      title={post.title}
                      author={post.author?.name || "Anonymous"}
                      authorDetail={post.author?.bio ? `in ${post.author.bio}` : undefined}
                      days={post.createdAt ? getDaysSince(post.createdAt) : 0}
                      comments={post.comments?.length || 0}
                      slug={post.slug}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts found. Create your first post!
                  </div>
                )}
              </div>
            </section>

            {/* If you want to keep the Tech section with hardcoded data, you can leave it */}
            {/* Or remove it if you want to only show dynamic content */}
          </div>
        </div>
      </div>
    </>
  );
}
