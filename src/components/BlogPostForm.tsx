"use client";

import React, { useState } from "react";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

interface Tag {
  id?: string;
  name: string;
}

interface BlogPostFormProps {
  onSubmit: (data: {
    title: string;
    content: any; // Using any for TipTap's JSON content
    tags: Tag[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function BlogPostForm({ onSubmit, isSubmitting = false }: BlogPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Check for duplicates
    if (tags.some(tag => tag.name.toLowerCase() === tagInput.toLowerCase())) {
      return;
    }
    
    setTags([...tags, { name: tagInput.trim() }]);
    setTagInput("");
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content) {
      setError("Content is required");
      return;
    }

    setError(null);
    
    // Submit the form data
    await onSubmit({
      title: title.trim(),
      content,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your post title"
          className="text-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag and press Enter"
          />
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddTag}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md"
              >
                <span>{tag.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="text-primary hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="min-h-[500px] border rounded-md">
          <SimpleEditor onChange={handleContentChange} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2"
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
}