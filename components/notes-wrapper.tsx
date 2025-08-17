"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { FloatingNoteButton } from "@/components/floating-note-button"
import { FloatingNote } from "@/components/floating-note"
import { useNotes, useFloatingNotes, useNotesActions } from "@/stores/notes-store"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export function NotesWrapper() {
  const { toggleSidebar } = useSidebar()
  const notes = useNotes()
  const floatingNotes = useFloatingNotes()
  const { 
    closeFloatingNote, 
    updateFloatingNote, 
    bringToFront,
    updateNote,
    createEmptyNote,
    cleanupEmptyNotes
  } = useNotesActions()

  // Auto-cleanup empty notes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      cleanupEmptyNotes()
    }, 30000) // Clean up every 30 seconds

    return () => clearInterval(interval)
  }, [cleanupEmptyNotes])

  // Set up keyboard shortcuts - N key creates empty note directly
  useKeyboardShortcuts({
    'n': () => {
      // Clean up empty notes first, then create new one
      cleanupEmptyNotes()
      createEmptyNote()
    },
    // Keep sidebar toggle for button click
    's': toggleSidebar,
  })

  return (
    <>
      <FloatingNoteButton onClick={toggleSidebar} />
      
      {/* Render floating notes with proper z-index */}
      {floatingNotes.map((floating) => {
        const note = notes.find(n => n.id === floating.noteId)
        if (!note) return null
        
        return (
          <FloatingNote
            key={floating.noteId}
            note={note}
            floating={floating}
            onClose={() => closeFloatingNote(floating.noteId)}
            onUpdate={(updates) => updateFloatingNote(floating.noteId, updates)}
            onBringToFront={() => bringToFront(floating.noteId)}
            onUpdateNote={(updates) => updateNote(note.id, updates)}
          />
        )
      })}
    </>
  )
}