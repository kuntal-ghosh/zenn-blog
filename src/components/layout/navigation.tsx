"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NavigationTab } from "@/lib/types"

/**
 * Navigation component for the Zenn platform
 * Handles main navigation tabs and updates URL
 */
export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current tab from URL or default to 'explore'
  const currentTab = (searchParams.get("tab") as NavigationTab) || "explore"

  // Handle tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <nav className="border-b bg-white">
      <div className="container">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )
}
