import type { Article, ContentType, TimeFilter } from "@/lib/types";
// import { Article } from "./types";

// Mock article data
const mockArticles: Article[] = [
  {
    id: "1",
    slug: "create-mcp-server-with-github-copilot",
    title:
      "Create your own MCP server and use the GitHub Copilot Agent to create less readable class names",
    content: `## Create your own MCP server with GitHub Copilot 

Ever wondered how to create an MCP server that works seamlessly with GitHub Copilot? In this article, we'll explore the process step by step.
Ever wondered how to create an MCP server that works seamlessly with GitHub Copilot? In this article, we'll explore the process step by step.
Ever wondered how to create an MCP server that works seamlessly with GitHub Copilot? In this article, we'll explore the process step by step.
Ever wondered how to create an MCP server that works seamlessly with GitHub Copilot? In this article, we'll explore the process step by step.
Ever wondered how to create an MCP server that works seamlessly with GitHub Copilot? In this article, we'll explore the process step by step.

## What is an MCP Server?

An MCP (Model Context Protocol) server is a specialized server that handles context-aware model interactions...
An MCP (Model Context Protocol) server is a specialized server that handles context-aware model interactions...

An MCP (Model Context Protocol) server is a specialized server that handles context-aware model interactions...

An MCP (Model Context Protocol) server is a specialized server that handles context-aware model interactions...


## Setting Up Your Development Environment

First, let's set up our development environment with the necessary tools...
First, let's set up our development environment with the necessary tools...
First, let's set up our development environment with the necessary tools...
First, let's set up our development environment with the necessary tools...
First, let's set up our development environment with the necessary tools...


## Implementation Details

Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...
Here's how we can implement the core functionality...


## Testing and Validation

To ensure our server works correctly...
To ensure our server works correctly...
To ensure our server works correctly...
To ensure our server works correctly...
To ensure our server works correctly...`,
    icon: "👨‍💻",
    author: {
      name: "Kandi Ota",
      organization: "Microsoft (volunteer)",
    },
    daysAgo: 5,
    metrics: {
      comments: 38,
      likes: 120,
    },
    createdAt: "2025-04-12T10:00:00Z",
    updatedAt: "2025-04-12T10:00:00Z",
  },
  {
    id: "2",
    slug: "building-website-without-css-margins",
    title: "I tried building a website without using CSS margins",
    content: `# Building a Website Without CSS Margins

A challenging experiment in web design...

## The Challenge

Can we create modern layouts without relying on margins?...

## Alternative Approaches

Here are some techniques I discovered...`,
    icon: "🖌️",
    author: {
      name: "Kandai",
    },
    daysAgo: 11,
    metrics: {
      comments: 25,
      likes: 89,
    },
    createdAt: "2025-04-06T15:30:00Z",
    updatedAt: "2025-04-06T15:30:00Z",
  },
];

export class DataService {
  static async getArticles(): Promise<Article[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockArticles;
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockArticles.find((article) => article.slug === slug) || null;
  }
}
