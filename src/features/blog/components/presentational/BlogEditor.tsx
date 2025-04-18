"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlogEditorProps {
  onSubmit: (blogData: {
    title: string;
    content: string;
    category: string;
    coverImage?: string;
    tags: string[];
  }) => void;
  initialData?: {
    title: string;
    content: string;
    category: string;
    coverImage?: string;
    tags: string[];
  };
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  onSubmit,
  initialData = {
    title: "",
    content: "",
    category: "technology",
    coverImage: "",
    tags: [],
  },
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [category, setCategory] = useState(initialData.category);
  const [coverImage, setCoverImage] = useState(initialData.coverImage);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData.tags);
  const [activeTab, setActiveTab] = useState("edit");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      coverImage,
      tags,
    });
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Simple preview of markdown content
  const renderPreview = () => {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <h1>{title}</h1>
        <div>
          {content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6">
        {/* Article Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Article Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title..."
            className="w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cover Image URL */}
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium mb-1"
          >
            Cover Image URL (optional)
          </label>
          <Input
            id="coverImage"
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Enter image URL..."
            className="w-full"
          />
          {coverImage && (
            <div className="mt-2 relative w-full h-40 bg-slate-100 rounded-md overflow-hidden">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Editor with Tabs */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Card>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <CardContent className="p-4">
                <TabsContent value="edit" className="mt-0">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content here... (Markdown supported)"
                    className="min-h-[300px] w-full resize-y"
                    required
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className="min-h-[300px] border rounded-md p-4 overflow-auto">
                    {content ? (
                      renderPreview()
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">
                        Preview will appear here
                      </p>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Publish Article
        </Button>
      </div>
    </form>
  );
};

export default BlogEditor;
