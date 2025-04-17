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
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  icon?: string
  author: Author
  publishedAt: string
  daysAgo: number
  metrics: ArticleMetrics
  tags?: string[]
}

export type ContentType = "articles" | "books" | "scraps"
export type TimeFilter = "weekly" | "alltime"
export type NavigationTab = "trending" | "following" | "explore"
