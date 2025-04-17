import ArticleCard from "@/components/articles/article-card"
import type { Article } from "@/lib/types"

interface ArticleListProps {
  articles: Article[]
  className?: string
}

/**
 * ArticleList component
 * Displays a grid of article cards
 */
export default function ArticleList({ articles, className = "" }: ArticleListProps) {
  // Handle empty state
  if (articles.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-white p-8 text-center">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
