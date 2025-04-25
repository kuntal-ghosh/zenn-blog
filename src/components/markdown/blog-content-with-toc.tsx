"use client";

import React, { useEffect, useState } from "react";
import { TableOfContents } from "./table-of-contents";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Link as EditorLink } from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CodeBlock from "@tiptap/extension-code-block";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Typography } from "@tiptap/extension-typography";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { common, createLowlight } from "lowlight";
import HeadingWithId from "../tiptap-extension/heading-with-id";
import { ensureValidTipTapContent } from "@/lib/tiptap-content-helper";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Github, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BlogContentWithTOCProps {
  content: any; // TipTap content object
}

export function BlogContentWithTOC({ content }: BlogContentWithTOCProps) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Process the content before passing it to the editor
  const processedContent = ensureValidTipTapContent(content);

  // Initialize lowlight with common languages
  const lowlight = createLowlight(common);

  // Set up the editor with our custom heading extension for display-only
  const editor = useEditor({
    extensions: [
      // Use StarterKit without the default heading
      StarterKit.configure({
        heading: false, // Disable default heading to use our custom one
      }),
      // Add our custom heading with ID support
      HeadingWithId,
      EditorLink.configure({ openOnClick: false }),
      Image,
      CodeBlock,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
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

  // Set up intersection observer to update active heading during scroll
  useEffect(() => {
    if (typeof window !== "undefined" && editor) {
      const headingElements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      if (!headingElements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHeading(entry.target.id);
            }
          });
        },
        {
          rootMargin: "0px 0px -80% 0px",
          threshold: 0.1,
        }
      );

      headingElements.forEach((heading) => {
        observer.observe(heading);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [editor]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <div className="flex-grow lg:w-2/3">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {editor && <EditorContent editor={editor} />}
        </div>
      </div>

      {/* Table of contents (sticky on desktop) */}
      <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
        <Card className="mb-8">
          <CardContent className="">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between gap-x-4">
                <span>Image</span>
                <div className="flex flex-col  mb-2">
                  <h2 className="text-xl font-semibold ">Yoshiko</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="outline" className="mb-2">
                      Follow
                    </Button>
                    <div className="flex gap-2 mb-2">
                      <a href="#" className="text-gray-500 hover:text-gray-700">
                        <Github className="h-5 w-5" />
                      </a>
                      <Link
                        href="#"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" w-full text-sm">
                <p className="flex col-gap-2">
                  <span className="text-gray-700">💼</span>
                  <span>
                    Front-end Engineer @{" "}
                    <a
                      href="https://kwork.studio"
                      className="text-blue-500 hover:underline"
                    >
                      kwork.studio
                    </a>
                  </span>
                </p>
              </div>

              <Button className="w-full mt-2 bg-blue-500 hover:bg-blue-600">
                Give a badge
              </Button>

              <a
                href="#"
                className="text-sm text-gray-500 mt-2 flex items-center"
              >
                What is a badge giver? <span className="ml-1">→</span>
              </a>
            </div>
          </CardContent>
        </Card>
        <TableOfContents content={content} activeHeading={activeHeading} />
      </div>
    </div>
  );
}
