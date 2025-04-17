import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import type { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article
}

/**
 * ArticleCard component
 * Displays an article with its metadata in a card format
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  // Extract initials for avatar fallback
  const initials = article.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/articles/${article.slug}`} className="flex p-4">
        <div className="mr-4 flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-2xl">
            {article.icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="mb-2 font-medium leading-snug">{article.title}</h3>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span>{article.author.name}</span>
            </div>

            {article.author.organization && <span className="text-gray-500">in {article.author.organization}</span>}

            <span className="text-gray-500">{article.daysAgo} days ago</span>

            <div className="flex items-center gap-1 text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span>{article.metrics.comments}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
