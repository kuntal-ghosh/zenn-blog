"use client";
import React from "react";
import useBlogPosts from "../../hooks/useBlogPosts";
import BlogList from "../presentational/BlogList";

const BlogListContainer: React.FC = () => {
  const { blogPosts, loading, error } = useBlogPosts();

  //   validate blogPosts
  if (!Array.isArray(blogPosts)) {
    return <div>Invalid blog posts data</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blog posts: {error}</div>;
  }

  return <BlogList posts={blogPosts} />;
};

export default BlogListContainer;
