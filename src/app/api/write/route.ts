import { NextResponse } from 'next/server';
import { createBlogPost } from '@/features/blog/api/blog-service.server';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const newPost = await createBlogPost(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}