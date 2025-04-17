"use client";

import { useState } from "react";
import Link from "next/link";

interface TableItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Extract headings from markdown content
  const headings = content.split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => {
      const level = line.match(/^#+/)?.[0].length || 0;
      const text = line.replace(/^#+\s+/, "").trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      return { level, text, slug };
    });

  const handleItemClick = (slug: string) => {
    setActiveItem(slug);

    // Scroll to the target section
    const targetElement = document.getElementById(slug);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
      <div className="relative ml-1.5">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <ul className="space-y-6">
          {headings.map((heading, index) => (
            <li key={index} className="relative">
              <Link
                href={`#${heading.slug}`}
                className="flex items-center group"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(heading.slug);
                }}
              >
                {/* Circle indicator */}
                <span
                  className={`block w-4 h-4 rounded-full z-10 ${
                    activeItem === heading.slug
                      ? "bg-blue-500"
                      : "bg-white border-2 border-blue-200"
                  }`}
                />

                {/* Text */}
                <span
                  className={`ml-4 text-lg ${
                    activeItem === heading.slug
                      ? "text-gray-800 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {heading.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}