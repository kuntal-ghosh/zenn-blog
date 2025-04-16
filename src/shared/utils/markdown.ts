import { marked } from 'marked';

export const convertMarkdownToHtml = (markdown: string): string => {
    return marked(markdown);
};

export const sanitizeHtml = (html: string): string => {
    // Implement sanitization logic here if needed
    return html;
};