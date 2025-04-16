import React from 'react';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-md">
            <div className="flex justify-between">
              <span className="font-bold">{comment.author}</span>
              <span className="text-sm text-gray-500">{comment.createdAt}</span>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;