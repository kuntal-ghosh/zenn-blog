import { useState, useEffect } from 'react';
import { fetchComments, submitComment } from '../api/blog-service.client';
import { Comment } from '../types';

const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const addComment = async (newComment: Omit<Comment, 'id'>) => {
    try {
      const savedComment = await submitComment(postId, newComment);
      setComments((prevComments) => [...prevComments, savedComment]);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  return { comments, loading, error, addComment };
};

export default useComments;