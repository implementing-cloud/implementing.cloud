"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { NotesList } from "@/components/notes-list"
import { useNotes, useNotesLoaded, useNotesActions } from "@/stores/notes-store"

export function NotesSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const notes = useNotes()
  const isLoaded = useNotesLoaded()
  const { deleteNote, openFloatingNote, createEmptyNote, cleanupEmptyNotes } = useNotesActions()

  const handleNewNote = () => {
    cleanupEmptyNotes()
    createEmptyNote()
  }

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
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">N</kbd> to create note
        </p>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <Card 
              className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer" 
              onClick={handleNewNote}
            >
              <CardContent className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Plus className="size-4" />
                  New Note
                </div>
              </CardContent>
            </Card>
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