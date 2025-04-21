"use client"

import * as React from "react"
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react"
import { ImageZoom } from "@/components/tiptap-ui/image-zoom/image-zoom"
import { Search } from "lucide-react"

export function ZoomableImageNode(props: NodeViewProps) {
  const [isZoomOpen, setIsZoomOpen] = React.useState(false)
  const { src, alt, title } = props.node.attrs
  const isSelected = props.selected

  return (
    <NodeViewWrapper>
      <div className="tiptap-zoomable-image relative group">
        <img 
          src={src} 
          alt={alt || ""} 
          title={title || alt || ""} 
          className="cursor-pointer max-w-full"
        />
        
        {/* Zoom indicator that appears on hover */}
        <div 
          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsZoomOpen(true)}
          role="button"
          aria-label="Zoom image"
        >
          <Search size={16} />
        </div>
        
        {/* Click handler for the image */}
        <div 
          className="absolute inset-0 cursor-zoom-in" 
          onClick={() => setIsZoomOpen(true)}
          role="button"
          aria-label="View larger image"
        />

        <ImageZoom 
          src={src} 
          alt={alt} 
          isOpen={isZoomOpen} 
          onClose={() => setIsZoomOpen(false)} 
        />
      </div>
    </NodeViewWrapper>
  )
}