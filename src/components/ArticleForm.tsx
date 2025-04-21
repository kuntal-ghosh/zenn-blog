"use client";

import { useState, FormEvent } from "react";
import ArticleEditor from "./ArticleEditor";

interface ArticleFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => void;
  isSubmitting?: boolean;
}

/**
 * Feature: Article Form Component
 * A form for creating and editing blog articles with a rich text editor
 */
export default function ArticleForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  isSubmitting = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setError(null);
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Article Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter article title"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Article Content
        </label>
        <div className="mt-1">
          <ArticleEditor initialContent={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
}

/**
 * Summary:
 * 1. Created a form component that incorporates the rich text editor
 * 2. Implemented form validation for required fields
 * 3. Added error handling and display
 * 4. Included loading state for the submit button
 *
 * Performance considerations:
 * - Only the form components that need interactivity are client components
 * - Form state is managed locally with submission handled by the parent
 *
 * Accessibility considerations:
 * - Form elements have proper labels with associated IDs
 * - Disabled states are properly managed with visual feedback
 * - Error messages are clearly displayed
 */
