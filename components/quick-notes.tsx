"use client"

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { usePathname } from "next/navigation"
import { NotebookPen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface QuickNote {
  id: string
  content: string
  url: string
  timestamp: Date
  quotedText?: string
}

export interface QuickNotesRef {
  show: () => void
}

export const QuickNotes = forwardRef<QuickNotesRef>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState("")
  const [quotedText, setQuotedText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Get selected text
  const getSelectedText = useCallback(() => {
    const selection = window.getSelection()
    return selection ? selection.toString().trim() : ""
  }, [])

  // Show quick notes with optional selected text
  const showQuickNotes = useCallback(() => {
    const selectedText = getSelectedText()
    setQuotedText(selectedText)
    setIsVisible(true)
  }, [getSelectedText])

  // Expose show function to parent via ref
  useImperativeHandle(ref, () => ({
    show: () => showQuickNotes()
  }))

  // Load notes from localStorage
  const loadNotes = useCallback((): QuickNote[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('quick-notes')
      if (!stored) return []
      const notes = JSON.parse(stored)
      return notes.map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp)
      }))
    } catch {
      return []
    }
  }, [])

  // Save note to localStorage
  const saveNote = useCallback((noteContent: string) => {
    if (!noteContent.trim()) return

    const newNote: QuickNote = {
      id: crypto.randomUUID?.() || `note-${Date.now()}`,
      content: noteContent.trim(),
      url: pathname,
      timestamp: new Date(),
      ...(quotedText && { quotedText })
    }

    const existingNotes = loadNotes()
    const updatedNotes = [newNote, ...existingNotes]
    
    try {
      localStorage.setItem('quick-notes', JSON.stringify(updatedNotes))
      toast.success("Note saved successfully!", {
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to save note:', error)
      toast.error("Failed to save note")
    }
  }, [pathname, loadNotes, quotedText])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger N when not in input fields
      if (e.key.toLowerCase() === 'n' && 
          !isVisible && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement) && 
          !(e.target as Element)?.closest('[contenteditable="true"]')) {
        e.preventDefault()
        showQuickNotes()
      }

      // Handle Escape to close
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
        setContent("")
        setQuotedText("")
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, showQuickNotes])

  // Auto-focus when visible
  useEffect(() => {
    if (isVisible && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isVisible])

  // Handle textarea key events
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Add new line (default behavior)
        return
      } else {
        // Enter: Submit
        e.preventDefault()
        if (content.trim()) {
          saveNote(content)
          setContent("")
          setQuotedText("")
          setIsVisible(false)
        }
      }
    }
  }

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setContent(textarea.value)
    
    // Auto-resize
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }

  return (
    <>
      {/* Floating Quick Note Button */}
      <Button
        onClick={showQuickNotes}
        size="icon"
        className="fixed bottom-6 right-6 md:right-20 z-50 size-12 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
        aria-label="Quick note"
      >
        <NotebookPen className="size-5" />
      </Button>

      {/* Quick Note Input */}
      {isVisible && (
    <div className="fixed inset-x-0 bottom-0 md:bottom-0 md:top-auto top-16 z-50 animate-in slide-in-from-bottom-2 md:slide-in-from-bottom-2 slide-in-from-top-2 duration-300 ease-out">
      <div className="mx-auto max-w-4xl px-4 pb-4 md:pb-4 pt-4 md:pt-0">
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg relative">
          <Button
            onClick={() => {
              setIsVisible(false)
              setContent("")
              setQuotedText("")
            }}
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 z-10 size-8 hover:bg-muted/50 md:hidden"
            aria-label="Close quick note"
          >
            <X className="size-4" />
          </Button>
          {quotedText && (
            <div className="px-4 pt-4 pb-2 border-b border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Quoted text:</div>
              <div className="bg-muted/30 rounded px-3 py-2 text-sm border-l-2 border-primary/30 max-h-20 overflow-y-auto">
                {quotedText}
              </div>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleTextareaKeyDown}
            placeholder={`Quick note for ${pathname} - Press Enter to save, Shift+Enter for new line, Esc to cancel`}
            className="w-full min-h-[60px] max-h-[200px] p-4 bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground text-sm"
            rows={1}
          />
          <div className="px-4 pb-3 text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to save • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new line • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to cancel
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  )
})