import { GetServerSideProps } from 'next';
import { getBlogPostBySlug } from '@/features/blog/api/blog-service.server';
import { BlogPost } from '@/features/blog/types';

interface BlogPostPageProps {
  post: BlogPost | null;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const post = await getBlogPostBySlug(slug as string);

  return {
    props: {
      post,
    },
  };
};

export default BlogPostPage;