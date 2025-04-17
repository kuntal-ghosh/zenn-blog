"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContentType } from "@/lib/types"

/**
 * ContentTabs component
 * Allows users to filter content by type (articles, books, scraps)
 */
export default function ContentTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current content type from URL or default to 'articles'
  const contentType = (searchParams.get("type") as ContentType) || "articles"

  // Handle content type change
  const handleContentTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("type", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-center">
      <Tabs value={contentType} onValueChange={handleContentTypeChange} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="scraps">Scraps</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
