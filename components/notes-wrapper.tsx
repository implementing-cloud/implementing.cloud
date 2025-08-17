"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { FloatingNoteButton } from "@/components/floating-note-button"
import { FloatingNote } from "@/components/floating-note"
import { useNotesContext } from "@/contexts/notes-context"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export function NotesWrapper() {
  const { toggleSidebar } = useSidebar()
  const { 
    notes, 
    floatingNotes, 
    closeFloatingNote, 
    updateFloatingNote, 
    bringToFront,
    updateNoteById 
  } = useNotesContext()


  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    'n': toggleSidebar,
  })

  return (
    <>
      <FloatingNoteButton onClick={toggleSidebar} />
      
      {/* Render floating notes */}
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
            onUpdateNote={(updates) => updateNoteById(note.id, updates)}
          />
        )
      })}
    </>
  )
}