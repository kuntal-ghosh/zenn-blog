"use client";

/**
 * Presentational component for displaying a blog post
 * Purely focused on the UI without any data fetching logic
 */

import { PostResponseDTO } from "@/core/application/dto/post-dto";
import { EditorContent, useEditor } from "@tiptap/react";
import { format } from "date-fns";

// Core Extensions
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Typography } from '@tiptap/extension-typography';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Underline } from '@tiptap/extension-underline';

import { useEffect, useState } from 'react';
import { ensureValidTipTapContent } from "@/lib/tiptap-content-helper";

// Import styles for custom elements
import '@/styles/tiptap-content.scss'; // Create this file if it doesn't exist

interface BlogPostProps {
  post: PostResponseDTO;
}

export default function BlogPost({ post }: BlogPostProps) {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  
  // Format the date safely or use current date as fallback
  const formattedDate = post.createdAt 
    ? format(new Date(post.createdAt), "MMMM d, yyyy")
    : format(new Date(), "MMMM d, yyyy");

  // Process the content before passing it to the editor using our helper
  const processedContent = ensureValidTipTapContent(post.content);

  // Create a read-only editor instance for viewing content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      CodeBlock,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Typography,
      Subscript,
      Superscript,
      Underline,
    ],
    content: processedContent,
    editable: false,
    immediatelyRender: false, // Fix for SSR hydration issues
  });

  // Set loading state when editor is ready
  useEffect(() => {
    if (editor) {
      setIsContentLoading(false);
    }
  }, [editor]);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author?.name || ""}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span>{post.author?.name || "Anonymous"}</span>
          </div>
          <span className="mx-2">•</span>
          <time dateTime={post.createdAt?.toString() || new Date().toString()}>
            {formattedDate}
          </time>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="animate-pulse">Loading content...</div>
        )}
      </div>
    </article>
  );
}