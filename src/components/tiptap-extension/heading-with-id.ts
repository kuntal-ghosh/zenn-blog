import Heading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'

// Custom heading extension that adds IDs to HTML output
const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    // Generate a slug from the node text content
    const slug = node.textContent
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
    
    // Original heading level (h1, h2, etc.)
    const level = node.attrs.level
    
    // Add the ID attribute to the HTML attributes
    const attrs = mergeAttributes(
      HTMLAttributes,
      { id: slug }
    )
    
    return [`h${level}`, attrs, 0]
  }
})

export default HeadingWithId