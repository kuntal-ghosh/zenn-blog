'use client';

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export default function SimplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Tiptap Editor with Tailwind</h1>
      <div className="mb-6">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          This is a minimal implementation of Tiptap with Tailwind CSS styling.
        </p>
      </div>
      <SimpleEditor />
    </div>
  );
}