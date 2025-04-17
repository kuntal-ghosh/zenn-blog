import { Suspense } from "react";
import ArticleList from "@/components/articles/article-list";
import { DataService } from "@/lib/data-service";
import type { ContentType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentSectionProps {
  contentType?: ContentType;
}

/**
 * RecentSection component
 * Container component that fetches and displays recent articles
 */
export default async function RecentSection({
  contentType = "articles",
}: RecentSectionProps) {
  // Fetch recent articles
  const articles = await DataService.getArticles("recent", contentType);

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Recent</h2>
      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleList articles={articles} />
      </Suspense>
    </section>
  );
}

/**
 * ArticleListSkeleton component
 * Displays a loading skeleton for the article list
 */
function ArticleListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex rounded-lg border bg-white p-4 shadow-sm">
          <Skeleton className="mr-4 h-12 w-12 rounded-md" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
