/**
 * Helper utilities for TipTap content formatting and validation
 */

/**
 * Creates an empty TipTap document structure
 */
export function createEmptyTipTapDocument() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: []
      }
    ]
  };
}

/**
 * Ensures the provided content is properly formatted as a valid TipTap document
 * Handles various edge cases like string content, partial content, or invalid formats
 */
export function ensureValidTipTapContent(content: any): any {
  // If content is null or undefined, return empty document
  if (!content) {
    return createEmptyTipTapDocument();
  }
  
  try {
    // If content is a string, try to parse it as JSON
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        // If parsing fails, wrap the string in a paragraph
        return {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: content }]
            }
          ]
        };
      }
    }
    
    // Check if content already has valid root structure
    if (content.type === 'doc' && Array.isArray(content.content)) {
      return content;
    }
    
    // If content is not properly structured but has content array
    if (Array.isArray(content.content)) {
      return {
        type: "doc",
        content: content.content
      };
    }
    
    // If content is a partial document (no type or no doc type)
    return {
      type: "doc",
      content: Array.isArray(content) ? content : [
        {
          type: "paragraph",
          content: [{ type: "text", text: JSON.stringify(content) }]
        }
      ]
    };
  } catch (error) {
    console.error("Error processing TipTap content:", error);
    // Return empty document as fallback
    return createEmptyTipTapDocument();
  }
}