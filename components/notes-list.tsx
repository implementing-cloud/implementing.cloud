"use client"

import { FileText, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Note, formatDate } from "@/lib/notes"

interface NotesListProps {
  notes: Note[]
  onNoteClick: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesList({ notes, onNoteClick, onDeleteNote }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="size-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No notes yet</p>
        <p className="text-xs text-muted-foreground mt-1">Create your first note above</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <Card 
          key={note.id} 
          className="cursor-pointer hover:bg-accent/50 transition-colors group"
          onClick={() => onNoteClick(note)}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate mb-1">
                  {note.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatDate(note.updatedAt)}
                </p>
                {note.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.content.substring(0, 60)}...
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteNote(note.id)
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="size-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}