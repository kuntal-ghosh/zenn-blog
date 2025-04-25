"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BlogPostForm } from "@/components/BlogPostForm";
import Navigation from "@/components/layout/navigation";

/**
 * Feature: Blog Post Creation Page
 * Description: Page for users to create and publish new blog posts
 */
const WritePage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (blogData: {
    title: string;
    content: any;
    tags: { id?: string; name: string }[];
  }) => {
    try {
      setIsSubmitting(true);

      // Create a slug from the title (simple slugification)
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Prepare the post data
      const postData = {
        title: blogData.title,
        content: blogData.content,
        slug,
        tags: blogData.tags,
        published: true
      };

      // Send post request to create the blog post
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      console.log("🚀 ~ response:", response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish post");
      }

      const data = await response.json();
      console.log("🚀 ~ data:", data)

      // Show success toast
      toast({
        title: "Success!",
        description: "Your blog post has been published.",
        variant: "default",
      });

      // Redirect to the published post
      router.push(`/blog/${data.slug || data.id}`);
    } catch (error) {
      console.error("Error publishing post:", error);

      // Show error toast
      toast({
        title: "Publication failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Write a New Post</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Share your knowledge and ideas with the community
              </p>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
              <BlogPostForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WritePage;
