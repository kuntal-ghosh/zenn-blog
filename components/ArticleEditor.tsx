"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useState } from "react";

interface ArticleEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
}

/**
 * Feature: Article Editor Component
 * A rich text editor for writing blog articles using Tiptap
 */
export default function ArticleEditor({
  initialContent = "",
  onChange,
}: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent);

  // Initialize the editor with necessary extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      onChange?.(html);
    },
  });

  // Handle toggling text formatting options
  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const setLink = () => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <button
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold"
          type="button"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic"
          type="button"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={toggleUnderline}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("underline") ? "bg-gray-200" : ""
          }`}
          title="Underline"
          type="button"
        >
          <span className="underline">U</span>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          onClick={() => toggleHeading(1)}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 1"
          type="button"
        >
          <span className="font-bold text-lg">H1</span>
        </button>
        <button
          onClick={() => toggleHeading(2)}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 2"
          type="button"
        >
          <span className="font-bold">H2</span>
        </button>
        <button
          onClick={() => toggleHeading(3)}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 3"
          type="button"
        >
          <span className="font-bold text-sm">H3</span>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Add Link"
          type="button"
        >
          <span className="underline text-blue-600">Link</span>
        </button>
      </div>

      {/* Editor Content */}
      <div className="prose max-w-none p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/**
 * Summary:
 * 1. Created a client-side rich text editor component using Tiptap
 * 2. Implemented basic text formatting options (bold, italic, underline)
 * 3. Added heading formatting with different levels (H1, H2, H3)
 * 4. Implemented link creation functionality
 * 5. Built a responsive toolbar with active state indicators
 *
 * Performance considerations:
 * - Component is client-side only to ensure proper interaction
 * - Editor state is managed internally with onChange callback for parent components
 *
 * Accessibility considerations:
 * - All buttons have title attributes for screen readers
 * - Uses semantic HTML when possible
 */
