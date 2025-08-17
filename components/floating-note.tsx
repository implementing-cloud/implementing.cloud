"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { X, Maximize2, Minimize2, Edit3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Note, FloatingNote as FloatingNoteType } from "@/lib/notes"
import { useDebouncedSave } from "@/hooks/use-debounced-save"
import { OptimizedTitleInput, OptimizedMDXEditor } from "@/components/optimized-inputs"
import "@mdxeditor/editor/style.css"

interface FloatingNoteProps {
  note: Note
  floating: FloatingNoteType
  onClose: () => void
  onUpdate: (updates: Partial<FloatingNoteType>) => void
  onBringToFront: () => void
  onUpdateNote: (updates: Partial<Pick<Note, 'title' | 'content'>>) => void
}

// Throttle function for performance optimization
function throttle<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = wait - (now - previous)
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }) as T
}

export function FloatingNote({ 
  note, 
  floating, 
  onClose, 
  onUpdate, 
  onBringToFront,
  onUpdateNote 
}: FloatingNoteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditing, setIsEditing] = useState(true) // Default to edit mode
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)
  
  // Use refs for stable values that don't cause re-renders
  const dragStartRef = useRef({ x: 0, y: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Stable throttled update function using useRef to prevent recreation
  const throttledUpdateRef = useRef(
    throttle((updates: Partial<FloatingNoteType>) => {
      onUpdate(updates)
    }, 16)
  )

  // Update the onUpdate reference when it changes, but don't recreate throttle
  useEffect(() => {
    throttledUpdateRef.current = throttle((updates: Partial<FloatingNoteType>) => {
      onUpdate(updates)
    }, 16)
  }, [onUpdate])

  // Debounced auto-save for content (eliminates typing lag)
  const { debouncedSave: debouncedNoteSave, forceSave, cleanup } = useDebouncedSave({
    delay: 1000, // 1 second after stopping typing
    onSave: (updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      onUpdateNote(updates)
    },
    onSaveStart: () => setIsSaving(true),
    onSaveComplete: () => setIsSaving(false)
  })

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).closest('.drag-handle')) {
      onBringToFront()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX - floating.x,
        y: e.clientY - floating.y,
      }
    }
  }, [floating.x, floating.y, onBringToFront])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onBringToFront()
    setIsResizing(true)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: floating.width,
      height: floating.height,
    }
  }, [floating.width, floating.height, onBringToFront])

  const handleSave = () => {
    // Force immediate save when user manually saves
    forceSave({
      title: editTitle,
      content: editContent,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsEditing(false)
  }

  // Immediate UI update + debounced save for smooth typing
  const handleContentChange = useCallback((content: string) => {
    setEditContent(content) // Immediate UI update - no lag
    debouncedNoteSave({ content }) // Debounced save - waits for typing pause
  }, [debouncedNoteSave])

  // Handle title changes with debounced save
  const handleTitleChange = useCallback((title: string) => {
    setEditTitle(title) // Immediate UI update
    debouncedNoteSave({ title }) // Debounced save
  }, [debouncedNoteSave])

  // Separate drag/resize effect with minimal dependencies
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        
        throttledUpdateRef.current({
          x: Math.max(0, Math.min(windowWidth - floating.width, e.clientX - dragStartRef.current.x)),
          y: Math.max(0, Math.min(windowHeight - floating.height, e.clientY - dragStartRef.current.y)),
        })
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x
        const deltaY = e.clientY - resizeStartRef.current.y
        
        throttledUpdateRef.current({
          width: Math.max(300, resizeStartRef.current.width + deltaX),
          height: Math.max(200, resizeStartRef.current.height + deltaY),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, floating.width, floating.height]) // Removed problematic dependencies

  // Memoize expensive style calculations to prevent recalculation on every render
  const cardStyles = useMemo(() => ({
    left: floating.x,
    top: floating.y,
    width: floating.width,
    height: floating.height,
    zIndex: Math.max(9999, floating.zIndex),
    cursor: isDragging ? 'grabbing' : 'default',
    willChange: isDragging || isResizing ? 'transform' : 'auto',
    // Pre-calculated complex shadow for better performance
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.07))',
  }), [floating.x, floating.y, floating.width, floating.height, floating.zIndex, isDragging, isResizing])

  // Memoize className to prevent unnecessary recalculations
  const cardClassName = useMemo(() => 
    "fixed border-2 border-border/20 bg-background/95 backdrop-blur-md",
    []
  )

  return (
    <Card
      ref={cardRef}
      className={cardClassName}
      style={cardStyles}
      onMouseDown={handleMouseDown}
      onClick={onBringToFront}
    >
      <CardHeader className="pb-2 drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <OptimizedTitleInput
              value={editTitle}
              onChange={handleTitleChange}
              className="font-medium text-sm h-7"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-sm truncate">{note.title}</h3>
          )}
          <div className="flex items-center gap-1">
            {/* Save indicator */}
            {isSaving && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3 animate-pulse" />
                <span>Saving...</span>
              </div>
            )}
            
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" className="size-6 p-0" onClick={handleSave}>
                  <Maximize2 className="size-3" />
                </Button>
                <Button size="sm" variant="ghost" className="size-6 p-0" onClick={handleCancel}>
                  <Minimize2 className="size-3" />
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                className="size-6 p-0" 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <Edit3 className="size-3" />
              </Button>
            )}
            <Button size="sm" variant="ghost" className="size-6 p-0" onClick={onClose}>
              <X className="size-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 h-full overflow-hidden">
        <div className="h-full overflow-auto">
          {isEditing ? (
            <div className="prose prose-sm max-w-none h-full">
              <OptimizedMDXEditor
                markdown={editContent}
                onChange={handleContentChange}
                className="h-full"
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {note.content || "No content"}
            </div>
          )}
        </div>
        
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-border" />
        </div>
      </CardContent>
    </Card>
  )
}