"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ensureValidTipTapContent } from "@/lib/tiptap-content-helper";

interface TableItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  content: any; // TipTap content object
  activeHeading?: string | null; // Currently active heading ID from scroll position
}

export function TableOfContents({ content, activeHeading }: TableOfContentsProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Sync activeItem with activeHeading from props when scrolling
  useEffect(() => {
    if (activeHeading) {
      setActiveItem(activeHeading);
    }
  }, [activeHeading]);

  // Process the content to ensure it's in the correct format
  const processedContent = ensureValidTipTapContent(content);
  
  // Extract headings from TipTap JSON content
  const headings: TableItem[] = [];
  
  if (processedContent && typeof processedContent === 'object' && processedContent.content) {
    // Find all heading nodes in the content
    processedContent.content.forEach((node: any) => {
      if (node.type === 'heading') {
        // Extract heading level from attrs
        const level = node.attrs?.level || 1;
        
        // Extract text from the heading content
        let text = '';
        if (node.content && Array.isArray(node.content)) {
          // Concatenate all text nodes within the heading
          text = node.content
            .filter((textNode: any) => textNode.type === 'text')
            .map((textNode: any) => textNode.text || '')
            .join('');
        }
        
        // Generate slug for the heading
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        
        headings.push({ level, text, slug });
      }
    });
  }

  const handleItemClick = (slug: string) => {
    setActiveItem(slug);

    // Scroll to the target section
    const targetElement = document.getElementById(slug);
    if (targetElement) {
      // Add a small offset to account for fixed headers if needed
      const offset = 80; // Adjust based on your header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Don't render if there are no headings
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className=" rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Table of Contents
      </h2>
      <div className="relative ml-1.5">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <ul className="space-y-6">
          {headings.map((heading, index) => (
            <li 
              key={index} 
              className="relative" 
              style={{ 
                marginLeft: `${(heading.level - 1) * 16}px` 
              }}
            >
              <Link
                href={`#${heading.slug}`}
                className="flex items-center group pl-4"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(heading.slug);
                }}
              >
                {/* Circle indicator */}
                <span
                  className={`block w-4 h-4 rounded-full z-10 absolute left-0 top-1.5 ${
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
