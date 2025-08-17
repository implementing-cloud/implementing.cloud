"use client"

import { useState, useRef, useEffect } from "react"
import { X, Maximize2, Minimize2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MDXEditor, headingsPlugin, quotePlugin, listsPlugin, linkPlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, BoldItalicUnderlineToggles, UndoRedo, Separator, BlockTypeSelect, CreateLink, InsertTable, toolbarPlugin } from "@mdxeditor/editor"
import { Note, FloatingNote as FloatingNoteType } from "@/lib/notes"
import "@mdxeditor/editor/style.css"

interface FloatingNoteProps {
  note: Note
  floating: FloatingNoteType
  onClose: () => void
  onUpdate: (updates: Partial<FloatingNoteType>) => void
  onBringToFront: () => void
  onUpdateNote: (updates: Partial<Pick<Note, 'title' | 'content'>>) => void
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
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).closest('.drag-handle')) {
      onBringToFront()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - floating.x,
        y: e.clientY - floating.y,
      })
    }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBringToFront()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: floating.width,
      height: floating.height,
    })
  }

  const handleSave = () => {
    onUpdateNote({
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate({
          x: Math.max(0, Math.min(window.innerWidth - floating.width, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - floating.height, e.clientY - dragStart.y)),
        })
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        onUpdate({
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY),
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
  }, [isDragging, isResizing, dragStart, resizeStart, floating, onUpdate])

  return (
    <Card
      ref={cardRef}
      className="fixed border shadow-lg bg-background/95 backdrop-blur"
      style={{
        left: floating.x,
        top: floating.y,
        width: floating.width,
        height: floating.height,
        zIndex: floating.zIndex,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onClick={onBringToFront}
    >
      <CardHeader className="pb-2 drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-medium text-sm h-7"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-sm truncate">{note.title}</h3>
          )}
          <div className="flex items-center gap-1">
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
              <MDXEditor
                markdown={editContent}
                onChange={setEditContent}
                plugins={[
                  headingsPlugin(),
                  quotePlugin(),
                  listsPlugin(),
                  linkPlugin(),
                  tablePlugin(),
                  thematicBreakPlugin(),
                  markdownShortcutPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <BlockTypeSelect />
                        <Separator />
                        <CreateLink />
                        <InsertTable />
                      </>
                    )
                  })
                ]}
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