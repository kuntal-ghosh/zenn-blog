import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sanitize HTML content to prevent XSS attacks
export function sanitizeHtml(content: string): string {
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span',
      'ul', 'ol', 'li', 'a', 'strong', 'em', 'blockquote',
      'code', 'pre', 'img', 'br', 'hr', 's', 'u'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'style', 'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false
  };

  return DOMPurify.sanitize(content, sanitizeConfig);
}
