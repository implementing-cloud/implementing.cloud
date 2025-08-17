"use client"

import { useState, useEffect } from "react"
import { NotebookPen, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuickNote {
  id: string
  content: string
  url: string
  timestamp: Date
  quotedText?: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<QuickNote[]>([])

  // Load notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
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
    }

    setNotes(loadNotes())
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem('quick-notes', JSON.stringify(updatedNotes))
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <NotebookPen className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Quick Notes</h1>
          <p className="text-muted-foreground">All your captured thoughts and quotes</p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <NotebookPen className="size-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-4">
            Start taking quick notes by pressing <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd> anywhere on the site
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              {note.quotedText && (
                <div className="mb-4 pb-4 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2">Quoted text:</div>
                  <div className="bg-muted/30 rounded px-3 py-2 text-sm border-l-2 border-primary/30">
                    {note.quotedText}
                  </div>
                </div>
              )}
              
              <div className="whitespace-pre-wrap text-sm mb-4 leading-relaxed">
                {note.content}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(note.timestamp)}
                  </div>
                  <Link 
                    href={note.url} 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="size-3" />
                    {note.url}
                  </Link>
                </div>
                <Button
                  onClick={() => deleteNote(note.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto p-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}