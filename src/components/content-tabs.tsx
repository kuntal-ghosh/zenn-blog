"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContentTabs() {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="articles" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="scraps">Scraps</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
