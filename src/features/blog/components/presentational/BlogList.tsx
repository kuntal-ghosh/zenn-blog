"use client";

/**
 * Presentational component for displaying a list of blog posts
 * Handles UI display and pagination controls
 */

import { PostResponseDTO } from "@/core/application/dto/post-dto";
import Link from "next/link";
import { format } from "date-fns";

interface BlogListProps {
  posts: PostResponseDTO[];
  currentPage: number;
  totalPages: number;
}

export default function BlogList({ posts, currentPage, totalPages }: BlogListProps) {
  return (
    <div className="space-y-8">
      {/* Post list */}
      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
              </Link>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name || ""}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <span>{post.author.name || "Anonymous"}</span>
                <span className="mx-2">•</span>
                <time dateTime={post.createdAt.toString()}>
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </time>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Link
                      href={`/blog/tag/${tag.name}`}
                      key={tag.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No posts found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center mt-8">
          <ul className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <Link
                  href={`/blog?page=${page}`}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}