import type { Article, ContentType, TimeFilter } from "@/lib/types"

/**
 * Data service for fetching content from the API
 * In a real application, this would make actual API calls
 */
export const DataService = {
  /**
   * Fetches articles based on section and filters
   */
  getArticles: async (
    section: "recent" | "tech",
    contentType: ContentType = "articles",
    timeFilter?: TimeFilter,
  ): Promise<Article[]> => {
    // In a real app, this would be an API call
    // For now, we'll return mock data
    return section === "recent" ? recentArticles : techArticles
  },
}

// Mock data
const recentArticles: Article[] = [
  {
    id: "1",
    slug: "create-mcp-server-github-copilot",
    title: "Create your own MCP server and use the GitHub Copilot Agent to create less readable class names",
    icon: "👨‍💻",
    author: {
      id: "user1",
      name: "Kandi Ota",
      avatar: "/placeholder.svg?height=20&width=20",
      organization: "Microsoft (volunteer)",
    },
    publishedAt: "2023-04-10T12:00:00Z",
    daysAgo: 5,
    metrics: {
      views: 1200,
      comments: 38,
    },
  },
  {
    id: "2",
    slug: "website-without-css-margins",
    title: "I tried building a website without using CSS margins",
    icon: "🖌️",
    author: {
      id: "user2",
      name: "Kandai",
      avatar: "/placeholder.svg?height=20&width=20",
    },
    publishedAt: "2023-04-04T09:30:00Z",
    daysAgo: 11,
    metrics: {
      views: 850,
      comments: 25,
    },
  },
  {
    id: "3",
    slug: "fixing-late-people",
    title: "Fixing someone who is late even though you knew they were going to be late 2 minutes before the meeting",
    icon: "😊",
    author: {
      id: "user3",
      name: "nopee",
      avatar: "/placeholder.svg?height=20&width=20",
    },
    publishedAt: "2023-03-26T14:15:00Z",
    daysAgo: 20,
    metrics: {
      views: 1500,
      comments: 44,
    },
  },
  {
    id: "4",
    slug: "azure-free-services",
    title:
      "Get started with Microsoft Azure for free | Learn how to get started and what services you can use for free",
    icon: "📚",
    author: {
      id: "user4",
      name: "kureri",
      avatar: "/placeholder.svg?height=20&width=20",
      organization: "ZEED Inc. Tech Blog",
    },
    publishedAt: "2023-03-21T10:00:00Z",
    daysAgo: 25,
    metrics: {
      views: 980,
      comments: 27,
    },
  },
  {
    id: "5",
    slug: "in-house-tools-deno",
    title: "Building in-house tools with Deno",
    icon: "📝",
    author: {
      id: "user5",
      name: "TechThinker",
      avatar: "/placeholder.svg?height=20&width=20",
      organization: "Aldemy Tech Blog",
    },
    publishedAt: "2023-03-16T11:45:00Z",
    daysAgo: 30,
    metrics: {
      views: 720,
      comments: 42,
    },
  },
  {
    id: "6",
    slug: "mcp-router-claude",
    title: "Coding with MCP Router × Claude Desktop",
    icon: "✈️",
    author: {
      id: "user6",
      name: "O",
      avatar: "/placeholder.svg?height=20&width=20",
    },
    publishedAt: "2023-04-10T16:20:00Z",
    daysAgo: 5,
    metrics: {
      views: 650,
      comments: 32,
    },
  },
]

const techArticles: Article[] = [
  {
    id: "7",
    slug: "in-house-design-system",
    title: "By making our in-house design system on MCP server, UI implementation became extremely efficient",
    icon: "🐤",
    author: {
      id: "user7",
      name: "Goriko",
      avatar: "/placeholder.svg?height=20&width=20",
      organization: "Ubie Tech Blog",
    },
    publishedAt: "2023-04-10T08:30:00Z",
    daysAgo: 5,
    metrics: {
      views: 3200,
      comments: 1031,
    },
  },
  {
    id: "8",
    slug: "ai-development-efficiency",
    title: "Write down everything you do to maximize the efficiency of AI-based development",
    icon: "🔥",
    author: {
      id: "user8",
      name: "Shizuka",
      avatar: "/placeholder.svg?height=20&width=20",
    },
    publishedAt: "2023-04-11T13:45:00Z",
    daysAgo: 4,
    metrics: {
      views: 2100,
      comments: 582,
    },
  },
  {
    id: "9",
    slug: "homemade-mcp-server",
    title: "How to implement a simple homemade MCP server for trial",
    icon: "🧑‍💻",
    author: {
      id: "user9",
      name: "kamasaaba",
      avatar: "/placeholder.svg?height=20&width=20",
      organization: "Smart Round Tech Blog",
    },
    publishedAt: "2023-04-08T09:15:00Z",
    daysAgo: 7,
    metrics: {
      views: 950,
      comments: 165,
    },
  },
  {
    id: "10",
    slug: "hashing-salt-pepper",
    title: "Hashing alone is no longer an option: Salt and pepper",
    icon: "📘",
    author: {
      id: "user10",
      name: "kamoocloud",
      avatar: "/placeholder.svg?height=20&width=20",
    },
    publishedAt: "2023-04-06T11:30:00Z",
    daysAgo: 9,
    metrics: {
      views: 1250,
      comments: 151,
    },
  },
]
