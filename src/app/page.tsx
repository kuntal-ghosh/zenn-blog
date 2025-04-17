// import React from "react";
// import BlogListContainer from "@/features/blog/components/container/BlogListContainer";
// import Header from "../shared/components/layout/Header";
// import Footer from "../shared/components/layout/Footer";

// const HomePage = () => {
//   return (
//     <div>
//       <Header />
//       <main className="container mx-auto p-4">
//         <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
//         <BlogListContainer />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleCard from "@/components/article-card";
import ContentTabs from "@/components/content/content-tabs";
import type { ContentType, TimeFilter } from "@/lib/types";
import TimeTabs from "@/components/time-tabs";

interface HomePageProps {
  searchParams: {
    tab?: string;
    type?: ContentType;
    time?: TimeFilter;
  };
}

/**
 * HomePage component
 * Main page of the Zenn platform
 */
export default function HomePage({ searchParams }: HomePageProps) {
  // Extract search params with defaults
  const contentType = searchParams.type || "articles";
  const timeFilter = searchParams.time || "weekly";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Zenn" width={100} height={30} />
            </Link>

            <nav className="hidden md:flex">
              <Tabs defaultValue="explore">
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger
                    value="trending"
                    className="data-[state=inactive]:text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className="data-[state=inactive]:text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Following
                  </TabsTrigger>
                  <TabsTrigger
                    value="explore"
                    className="data-[state=inactive]:text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
                  >
                    Explore
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 overflow-hidden rounded-full bg-blue-500">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
                width={32}
                height={32}
              />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">Post</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Content Type Tabs */}
          <ContentTabs />

          {/* Recent Section */}
          <section className="mt-8">
            <h2 className="mb-6 text-2xl font-bold">Recent</h2>
            <div className="space-y-4">
              <ArticleCard
                icon="👨‍💻"
                title="Create your own MCP server and use the GitHub Copilot Agent to create less readable class names"
                author="Kandi Ota"
                authorDetail="in Microsoft (volunteer)"
                days={5}
                comments={38}
              />

              <ArticleCard
                icon="🖌️"
                title="I tried building a website without using CSS margins"
                author="Kandai"
                days={11}
                comments={25}
              />

              <ArticleCard
                icon="😊"
                title="Fixing someone who is late even though you knew they were going to be late 2 minutes before the meeting"
                author="nopee"
                days={20}
                comments={44}
              />

              <ArticleCard
                icon="📝"
                title="Building in-house tools with Deno"
                author="TechThinker"
                authorDetail="in Aldemy Tech Blog"
                days={30}
                comments={42}
              />

              <ArticleCard
                icon="✈️"
                title="Coding with MCP Router × Claude Desktop"
                author="O"
                days={5}
                comments={32}
              />
            </div>
          </section>

          {/* Tech Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Tech</h2>
              <TimeTabs />
            </div>

            <div className="space-y-4">
              <ArticleCard
                icon="🐤"
                title="By making our in-house design system on MCP server, UI implementation became extremely..."
                author="Goriko"
                authorDetail="in Ubie Tech Blog"
                days={5}
                comments={1031}
              />

              <ArticleCard
                icon="🔥"
                title="Write down everything you do to maximize the efficiency of AI-based development"
                author="Shizuka"
                days={4}
                comments={582}
              />

              <ArticleCard
                icon="🧑‍💻"
                title="How to implement a simple homemade MCP server for trial"
                author="kamasaaba"
                authorDetail="in Smart Round Tech Blog"
                days={7}
                comments={165}
              />

              <ArticleCard
                icon="📘"
                title="Hashing alone is no longer an option: Salt and pepper"
                author="kamoocloud"
                days={9}
                comments={151}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
