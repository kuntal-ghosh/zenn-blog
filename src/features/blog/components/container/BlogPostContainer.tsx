import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchBlogPost } from '../../api/blog-service.client';
import { BlogPost } from '../../types';

const BlogPostContainer: React.FC = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            const getBlogPost = async () => {
                try {
                    const post = await fetchBlogPost(slug as string);
                    setBlogPost(post);
                } catch (err) {
                    setError('Failed to load blog post');
                } finally {
                    setLoading(false);
                }
            };

            getBlogPost();
        }
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!blogPost) return <div>Blog post not found</div>;

    return (
        <div>
            <h1>{blogPost.title}</h1>
            <div>{blogPost.content}</div>
        </div>
    );
};

export default BlogPostContainer;