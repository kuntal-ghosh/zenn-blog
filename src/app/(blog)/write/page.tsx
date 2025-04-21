"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/features/blog/components/presentational/BlogEditor";
import { toast } from "@/components/ui/use-toast";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

/**
 * Feature: Article Editor Page
 * Description: Page for users to create and publish new articles
 */
const WritePage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (blogData: {
    title: string;
    content: string;
    category: string;
    coverImage?: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);

      // Send post request to create the article
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish article");
      }

      const data = await response.json();

      // Show success toast
      toast({
        title: "Success!",
        description: "Your article has been published.",
        variant: "default",
      });

      // Redirect to the published article
      router.push(`/blog/${data.slug || data.id}`);
    } catch (error) {
      console.error("Error publishing article:", error);

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
    // <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
    //   <div className="container px-4 mx-auto">
    //     <div className="max-w-3xl mx-auto">
    //       <header className="mb-8">
    //         <h1 className="text-3xl font-bold">Write a New Article</h1>
    //         <p className="text-slate-500 dark:text-slate-400 mt-2">
    //           Share your knowledge and ideas with the community
    //         </p>
    //       </header>

    //       <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
    //         <BlogEditor
    //           onSubmit={handleSubmit}
    //           initialData={{
    //             title: "",
    //             content: "",
    //             category: "technology",
    //             coverImage: "",
    //             tags: [],
    //           }}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <SimpleEditor/>
  );
};

export default WritePage;
