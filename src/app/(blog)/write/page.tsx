"use client";
import React, { useState } from "react";
import BlogEditor from "../../../features/blog/components/presentational/BlogEditor";
import { useRouter } from "next/navigation"; // For App Router

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      router.push("/blog");
    } else {
      // Handle error
      console.error("Failed to submit the blog post");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Write a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <BlogEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default WritePage;
