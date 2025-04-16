"use client";
import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import useForm from "@/shared/hooks/useForm";

const BlogEditor: React.FC<{
  onSubmit: (title: string, content: string) => void;
}> = ({ onSubmit }) => {
  const { values, handleChange, handleSubmit } = useForm({
    initialValues: { title: "", content: "" },
    onSubmit: (values) => {
      onSubmit(values.title, values.content);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={values.title}
        onChange={handleChange}
        required
        className="w-full"
      />
      <textarea
        name="content"
        placeholder="Write your blog content here..."
        value={values.content}
        onChange={handleChange}
        required
        className="w-full h-64 p-2 border rounded"
      />
      <Button type="submit" className="w-full">
        Publish
      </Button>
    </form>
  );
};

export default BlogEditor;
