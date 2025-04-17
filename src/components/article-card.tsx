import Link from "next/link"
import Image from "next/image"
import { MessageSquare } from "lucide-react"

interface ArticleCardProps {
  readonly icon: string;
  readonly title: string;
  readonly author: string;
  readonly authorDetail?: string;
  readonly days: number;
  readonly comments: number;
  readonly slug: string;
}

export default function ArticleCard({ icon, title, author, authorDetail, days, comments, slug }: ArticleCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 text-2xl flex items-center justify-center bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <Link href={`/blog/${slug}`} className="block mb-2 font-medium hover:text-blue-500">
          {title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 overflow-hidden rounded-full bg-gray-200">
              <Image src="/placeholder.svg?height=20&width=20" alt={author} width={20} height={20} />
            </div>
            <span>{author}</span>
          </div>

          {authorDetail && <span className="text-gray-500">{authorDetail}</span>}
          <span className="text-gray-500">{days} days ago</span>
          <div className="flex items-center gap-1 text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
