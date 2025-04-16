import React from "react";
import BlogListContainer from "@/features/blog/components/container/BlogListContainer";

const BlogPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <BlogListContainer />
    </div>
  );
};

export default BlogPage;
