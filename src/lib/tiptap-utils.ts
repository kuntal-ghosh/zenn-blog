import { Editor } from "@tiptap/react"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Checks if a mark exists in the editor schema
 *
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 */
export const isMarkInSchema = (markName: string, editor: Editor | null) =>
  editor?.schema.spec.marks.get(markName) !== undefined

/**
 * Checks if a node exists in the editor schema
 *
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
  editor?.schema.spec.nodes.get(nodeName) !== undefined

/**
 * Handles image upload with progress tracking and abort capability
 */
export const handleImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  try {
    // For real progress
    for (let progress = 0; progress <= 90; progress += 10) {
      if (abortSignal?.aborted) {
        throw new Error("Upload cancelled")
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
      onProgress?.({ progress })
    }
    
    // Use actual file conversion for the final result
    const result = await convertFileToBase64(file, abortSignal)
    onProgress?.({ progress: 100 })
    return result
  } catch (error) {
    console.error("Image upload failed:", error)
    throw error
  }
}

/**
 * Converts a File to base64 string
 */
export const convertFileToBase64 = (
  file: File,
  abortSignal?: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const abortHandler = () => {
      reader.abort()
      reject(new Error("Upload cancelled"))
    }

    if (abortSignal) {
      abortSignal.addEventListener("abort", abortHandler)
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener("abort", abortHandler)
      }

      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert File to base64"))
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Adds ID attributes to heading nodes in TipTap JSON content
 * This allows the table of contents to link directly to headings
 */
export function addIdsToHeadings(content: any): any {
  if (!content || typeof content !== 'object') {
    return content;
  }

  // If this is a doc node, process its content
  if (content.type === 'doc' && Array.isArray(content.content)) {
    return {
      ...content,
      content: content.content.map(node => addIdsToHeadings(node))
    };
  }

  // If this is a heading node, add an ID attribute
  if (content.type === 'heading' && content.attrs) {
    // Extract text from the heading content
    let text = '';
    if (Array.isArray(content.content)) {
      text = content.content
        .filter((textNode: any) => textNode.type === 'text')
        .map((textNode: any) => textNode.text || '')
        .join('');
    }

    // Generate slug for the heading
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Add the ID to the heading's attributes
    return {
      ...content,
      attrs: {
        ...content.attrs,
        id: slug
      },
      // Process any nested content
      content: Array.isArray(content.content)
        ? content.content.map(node => addIdsToHeadings(node))
        : content.content
    };
  }

  // For all other nodes, process their content if it exists
  if (Array.isArray(content.content)) {
    return {
      ...content,
      content: content.content.map(node => addIdsToHeadings(node))
    };
  }

  // Return unchanged for nodes without content
  return content;
}
