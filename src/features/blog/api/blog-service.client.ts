import axios from 'axios';

const API_URL = '/api/blog';

export const fetchBlogPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
};

export const fetchBlogPostBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        throw error;
    }
};

export const createBlogPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, postData);
        return response.data;
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
};