"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NewNoteCard } from "@/components/new-note-card"
import { NotesList } from "@/components/notes-list"
import { useNotesContext } from "@/contexts/notes-context"

export function NotesSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { 
    notes, 
    isLoaded, 
    addNote, 
    deleteNote, 
    openFloatingNote 
  } = useNotesContext()

  if (!isLoaded) {
    return (
      <Sidebar side="right" {...props}>
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </SidebarHeader>
      </Sidebar>
    )
  }

  return (
    <Sidebar side="right" {...props}>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">N</kbd> to toggle
        </p>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel>Create New</SidebarGroupLabel>
          <SidebarGroupContent>
            <NewNoteCard onSave={addNote} />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Your Notes ({notes.length})</SidebarGroupLabel>
          <SidebarGroupContent>
            <NotesList 
              notes={notes}
              onNoteClick={(note) => openFloatingNote(note.id)}
              onDeleteNote={deleteNote}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}