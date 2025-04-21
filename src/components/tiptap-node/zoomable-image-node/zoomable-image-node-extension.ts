import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ZoomableImageNode } from "./zoomable-image-node"

interface ZoomableImageOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    zoomableImage: {
      /**
       * Add an image with zoom capability
       */
      setZoomableImage: (options: { src: string, alt?: string, title?: string }) => ReturnType
    }
  }
}

export const ZoomableImage = Node.create<ZoomableImageOptions>({
  name: 'zoomableImage',
  
  group: 'block',
  
  content: '',
  
  draggable: true,
  
  selectable: true,
  
  inline: false,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'img[data-zoomable]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { 'data-zoomable': 'true' })]
  },
  
  addCommands() {
    return {
      setZoomableImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ZoomableImageNode)
  },
})

export default ZoomableImage