/**
 * Core data types for the Zenn platform
 */

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Author extends User {
  organization?: string
}

export interface ArticleMetrics {
  views: number
  comments: number
  likes?: number
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  icon: string;
  author: {
    name: string;
    avatar?: string;
    organization?: string;
  };
  daysAgo: number;
  metrics: {
    comments: number;
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type ContentType = "articles" | "questions" | "books";
export type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";
export type NavigationTab = "trending" | "following" | "explore"
