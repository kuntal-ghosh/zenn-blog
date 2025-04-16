import React from 'react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, excerpt, author, date, slug }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold">
        <a href={`/blog/${slug}`}>{title}</a>
      </h2>
      <p className="text-gray-600">{excerpt}</p>
      <div className="text-sm text-gray-500">
        <p>By {author} on {date}</p>
      </div>
    </div>
  );
};

export default BlogCard;