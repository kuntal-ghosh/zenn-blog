/**
 * Blog Post Detail Page
 * Uses the BlogPostContainer from the blog feature
 */

import { Metadata } from "next";
import BlogPostContainer from "@/features/blog/components/container/BlogPostContainer";
import { Heart, Bookmark } from "lucide-react";

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
    <div className="min-h-screen relative">
          {/* Social Sidebar - Fixed on left side */}
          <aside className="fixed left-6 top-1/3 hidden lg:flex flex-col items-center gap-6 z-10">
            <div className="flex flex-col items-center">
              <button className="p-3 rounded-full bg-background hover:bg-muted transition-colors shadow-sm">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </button>
              <span className="text-sm text-muted-foreground mt-1">481</span>
            </div>
    
            <div className="flex flex-col items-center">
              <button className="p-3 rounded-full bg-background hover:bg-muted transition-colors shadow-sm">
                <Bookmark className="h-6 w-6 text-muted-foreground" />
              </button>
              <span className="text-sm text-muted-foreground mt-1">4</span>
            </div>
          </aside>
    
          <main className="container mx-auto px-4 py-8">
            <BlogPostContainer slug={slug} />
          </main>
    
          {/* Mobile Social Actions - Shown only on mobile/tablet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-muted p-3 flex justify-around">
            <button className="flex flex-col items-center">
              <Heart className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">481</span>
            </button>
            <button className="flex flex-col items-center">
              <Bookmark className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">4</span>
            </button>
          </div>
        </div>
  );
}