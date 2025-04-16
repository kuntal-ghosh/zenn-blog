import React from 'react';
import { BlogPost } from '../../types';

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
          <a href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default BlogList;