"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay,
  DialogClose
} from "@/components/ui/dialog"
import { ZoomIn, ZoomOut, X, RotateCw, RotateCcw } from "lucide-react"

interface ImageZoomProps {
  src: string
  alt?: string
  isOpen: boolean
  onClose: () => void
}

export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  const [scale, setScale] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const imageRef = React.useRef<HTMLImageElement>(null)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotateClockwise = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleRotateCounterclockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  // Reset scale and rotation when dialog is opened
  React.useEffect(() => {
    if (isOpen) {
      setScale(1)
      setRotation(0)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            ref={imageRef}
            src={src}
            alt={alt || "Zoomed image"}
            style={{ 
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease"
            }}
            className="max-w-full max-h-[80vh] object-contain"
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white rounded-full px-4 py-2">
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-white/20 rounded-full" 
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <div className="text-sm font-medium min-w-[40px] text-center">
              {Math.round(scale * 100)}%
            </div>
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-white/20 rounded-full" 
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button 
              onClick={handleRotateCounterclockwise}
              className="p-2 hover:bg-white/20 rounded-full" 
              aria-label="Rotate counter-clockwise"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={handleRotateClockwise}
              className="p-2 hover:bg-white/20 rounded-full" 
              aria-label="Rotate clockwise"
            >
              <RotateCw size={20} />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button 
              onClick={handleReset}
              className="text-xs font-medium p-2 hover:bg-white/20 rounded-full"
            >
              Reset
            </button>
          </div>
          
          <DialogClose className="absolute right-4 top-4 bg-black/60 text-white p-2 rounded-full hover:bg-white/20">
            <X size={20} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}