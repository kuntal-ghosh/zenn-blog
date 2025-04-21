/**
 * Feature: TipTap Editor Demo Page
 * Description: A page demonstrating the TipTap editor with API integration
 */

"use client";

import { useState, useEffect } from "react";
import { ConnectedEditor } from "@/components/tiptap-templates/simple/connected-editor";
import { EditorService } from "@/lib/services/editor-service";
import { EditorContentResponse } from "@/types/editor";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [posts, setPosts] = useState<EditorContentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load the list of posts when the component mounts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const response = await EditorService.listContent({ limit: 10 });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Handle navigation to a specific post
  const handleNavigateToPost = (id: string) => {
    router.push(`/simple-editor?id=${id}`);
  };

  // Handle post creation
  const handlePostCreated = (id: string) => {
    router.push(`/simple-editor?id=${id}`);
  };

  // Handle post deletion
  const handlePostDeleted = () => {
    router.push("/simple-editor");

    // Reload the list of posts
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const response = await EditorService.listContent({ limit: 10 });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">TipTap Editor</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create and edit rich content with our TipTap-powered editor
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with post list */}
        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Your Posts</h2>

          <button
            className="w-full p-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => router.push("/simple-editor")}
          >
            + New Post
          </button>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : posts.length > 0 ? (
            <ul className="space-y-2">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                    postId === post.id ? "bg-blue-100 dark:bg-blue-900" : ""
                  }`}
                  onClick={() => handleNavigateToPost(post.id)}
                >
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.updatedAt).toLocaleDateString()}
                    {post.published ? (
                      <span className="ml-2 px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                        Published
                      </span>
                    ) : (
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                        Draft
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No posts yet. Create your first post!
            </p>
          )}
        </div>

        {/* Editor area */}
        <div className="lg:col-span-3">
          <ConnectedEditor
            postId={postId || undefined}
            onSaved={handlePostCreated}
            onDeleted={handlePostDeleted}
          />
        </div>
      </div>
    </div>
  );
}
