"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TimeFilter } from "@/lib/types"

/**
 * TimeFilterTabs component
 * Allows users to filter content by time period
 */
export default function TimeFilterTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current time filter from URL or default to 'weekly'
  const timeFilter = (searchParams.get("time") as TimeFilter) || "weekly"

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("time", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs value={timeFilter} onValueChange={handleTimeFilterChange} className="w-auto">
      <TabsList className="h-8 bg-gray-100">
        <TabsTrigger value="weekly" className="h-7 px-3 text-xs">
          Weekly
        </TabsTrigger>
        <TabsTrigger value="alltime" className="h-7 px-3 text-xs">
          AllTime
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
