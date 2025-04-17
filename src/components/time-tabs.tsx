"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TimeTabs() {
  return (
    <Tabs defaultValue="weekly" className="w-auto">
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
