import { Suspense } from "react"
import ArticleList from "@/components/articles/article-list"
import TimeFilterTabs from "@/components/content/time-filter-tabs"
import { DataService } from "@/lib/data-service"
import type { ContentType, TimeFilter } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface TechSectionProps {
  contentType?: ContentType
  timeFilter?: TimeFilter
}

/**
 * TechSection component
 * Container component that fetches and displays tech articles
 */
export default async function TechSection({ contentType = "articles", timeFilter = "weekly" }: TechSectionProps) {
  // Fetch tech articles
  const articles = await DataService.getArticles("tech", contentType, timeFilter)

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tech</h2>
        <TimeFilterTabs />
      </div>
      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleList articles={articles} />
      </Suspense>
    </section>
  )
}

/**
 * ArticleListSkeleton component
 * Displays a loading skeleton for the article list
 */
function ArticleListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
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
  )
}
