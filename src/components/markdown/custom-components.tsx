import { ComponentProps } from "react";

export const MarkdownLink = ({ children, ...props }: ComponentProps<"a">) => (
  <a {...props} className="text-blue-500 hover:text-blue-600 no-underline hover:underline">
    {children}
  </a>
);

interface CodeProps extends ComponentProps<"code"> {
  inline?: boolean;
}

export const MarkdownCode = ({ inline, children, ...props }: CodeProps) => {
  const className = inline
    ? "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5"
    : "block bg-gray-100 dark:bg-gray-800 rounded p-4 my-4";
  
  return (
    <code {...props} className={className}>
      {children}
    </code>
  );
};

export const MarkdownBlockquote = ({ children, ...props }: ComponentProps<"blockquote">) => (
  <blockquote {...props} className="border-l-4 border-gray-200 pl-4 my-4 italic">
    {children}
  </blockquote>
);