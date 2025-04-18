import ArticleCard from "@/components/article-card";
import ContentTabs from "@/components/content/content-tabs";
import type { ContentType, TimeFilter } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface HomePageProps {
  readonly searchParams: {
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
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <ContentTabs />
            <Link href="/write">
              <Button className="flex items-center gap-2">
                <PenLine size={16} />
                <span>Create Post</span>
              </Button>
            </Link>
          </div>

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
                slug="create-mcp-server-with-github-copilot"
              />

              <ArticleCard
                icon="🖌️"
                title="I tried building a website without using CSS margins"
                author="Kandai"
                days={11}
                comments={25}
                slug="building-website-without-css-margins"
              />

              <ArticleCard
                icon="😊"
                title="Fixing someone who is late even though you knew they were going to be late 2 minutes before the meeting"
                author="nopee"
                days={20}
                comments={44}
                slug="fixing-someone-who-is-late"
              />

              <ArticleCard
                icon="📝"
                title="Building in-house tools with Deno"
                author="TechThinker"
                authorDetail="in Aldemy Tech Blog"
                days={30}
                comments={42}
                slug="building-in-house-tools-with-deno"
              />

              <ArticleCard
                icon="✈️"
                title="Coding with MCP Router × Claude Desktop"
                author="O"
                days={5}
                comments={32}
                slug="coding-with-mcp-router-claude-desktop"
              />
            </div>
          </section>

          {/* Tech Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6"></div>
            <div className="space-y-4">
              <ArticleCard
                icon="🐤"
                title="By making our in-house design system on MCP server, UI implementation became extremely..."
                author="Goriko"
                authorDetail="in Ubie Tech Blog"
                days={5}
                comments={1031}
                slug="in-house-design-system-mcp-server"
              />

              <ArticleCard
                icon="🔥"
                title="Write down everything you do to maximize the efficiency of AI-based development"
                author="Shizuka"
                days={4}
                comments={582}
                slug="maximize-efficiency-ai-based-development"
              />

              <ArticleCard
                icon="🧑‍💻"
                title="How to implement a simple homemade MCP server for trial"
                author="kamasaaba"
                authorDetail="in Smart Round Tech Blog"
                days={7}
                comments={165}
                slug="implement-simple-homemade-mcp-server"
              />

              <ArticleCard
                icon="📘"
                title="Hashing alone is no longer an option: Salt and pepper"
                author="kamoocloud"
                days={9}
                comments={151}
                slug="hashing-salt-and-pepper"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
