"use client"

import { useState, useEffect } from "react"
import { NotebookPen, Calendar, ExternalLink, Edit2, Save, X, Merge, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FlickeringGrid } from "@/components/magicui/flickering-grid"

interface QuickNote {
  id: string
  content: string
  url: string
  timestamp: Date
  quotedText?: string
  isMerged?: boolean
  lastUpdated?: Date
  mergedFrom?: {
    id: string
    url: string
    timestamp: Date
    quotedText?: string
    content: string
  }[]
}

export default function NotesPage() {
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>("")
  const [mergeMode, setMergeMode] = useState<boolean>(false)
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  // Load notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
      if (typeof window === 'undefined') return []
      try {
        const stored = localStorage.getItem('quick-notes')
        if (!stored) return []
        const notes = JSON.parse(stored)
        return notes.map((note: QuickNote) => {
          const timestamp = note.timestamp ? new Date(note.timestamp) : new Date()
          const lastUpdated = note.lastUpdated ? new Date(note.lastUpdated) : undefined
          
          return {
            ...note,
            timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
            ...(lastUpdated && !isNaN(lastUpdated.getTime()) && { lastUpdated })
          }
        })
      } catch {
        return []
      }
    }

    setNotes(loadNotes())
  }, [])

  const formatDate = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  const openDeleteDialog = (id: string) => {
    setNoteToDelete(id)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setNoteToDelete(null)
  }

  const confirmDelete = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete)
      setNotes(updatedNotes)
      localStorage.setItem('quick-notes', JSON.stringify(updatedNotes))
    }
    closeDeleteDialog()
  }

  const startEdit = (note: QuickNote) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent("")
  }

  const saveEdit = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, content: editContent } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('quick-notes', JSON.stringify(updatedNotes))
    setEditingId(null)
    setEditContent("")
  }

  const toggleNoteSelection = (noteId: string) => {
    const newSelection = new Set(selectedNotes)
    if (newSelection.has(noteId)) {
      newSelection.delete(noteId)
    } else {
      newSelection.add(noteId)
    }
    setSelectedNotes(newSelection)
  }

  const toggleMergeMode = () => {
    setMergeMode(!mergeMode)
    setSelectedNotes(new Set())
  }

  const mergeSelectedNotes = () => {
    if (selectedNotes.size < 2) return

    const notesToMerge = notes.filter(note => selectedNotes.has(note.id))
    notesToMerge.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Create merged content with markdown formatting (Strategy B)
    const mergedContent = notesToMerge.map((note) => {
      const formattedTimestamp = formatDate(note.timestamp)
      
      // Handle both absolute and relative URLs
      let sourceInfo: string
      
      try {
        const url = new URL(note.url)
        sourceInfo = `[${url.hostname}](${note.url})`
      } catch {
        // Handle relative URLs - extract page name from path
        const pathParts = note.url.split('/')
        const pageName = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || 'page'
        sourceInfo = `[${pageName}](${note.url})`
      }
      
      let section = `*${formattedTimestamp} • ${sourceInfo}*\n\n`
      
      if (note.quotedText) {
        section += `> **Quote:** "${note.quotedText}"\n\n`
      }
      
      section += note.content
      return section
    }).join('\n\n---\n\n')

    const mergedNote: QuickNote = {
      id: Date.now().toString(),
      content: mergedContent,
      url: "merged-note", // Use special identifier for merged notes
      timestamp: notesToMerge[0].timestamp, // Use earliest timestamp
      lastUpdated: new Date(), // When the merge happened
      isMerged: true,
      mergedFrom: notesToMerge.map(note => ({
        id: note.id,
        url: note.url,
        timestamp: note.timestamp,
        quotedText: note.quotedText,
        content: note.content
      }))
    }

    // Remove merged notes and add the new merged note
    const remainingNotes = notes.filter(note => !selectedNotes.has(note.id))
    const updatedNotes = [mergedNote, ...remainingNotes]
    
    setNotes(updatedNotes)
    localStorage.setItem('quick-notes', JSON.stringify(updatedNotes))
    setSelectedNotes(new Set())
    setMergeMode(false)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>
      <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <NotebookPen className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Quick Notes</h1>
            <p className="text-muted-foreground">All your captured thoughts and quotes</p>
          </div>
        </div>
        {notes.length > 1 && (
          <div className="flex items-center gap-2">
            {mergeMode && selectedNotes.size >= 2 && (
              <Button
                onClick={mergeSelectedNotes}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Merge className="size-4 md:mr-2" />
                <span className="hidden md:inline">Merge {selectedNotes.size} Notes</span>
                <span className="md:hidden ml-1">{selectedNotes.size}</span>
              </Button>
            )}
            <Button
              onClick={toggleMergeMode}
              variant={mergeMode ? "destructive" : "outline"}
            >
              {mergeMode ? (
                <>
                  <X className="size-4 md:mr-2" />
                  <span className="hidden md:inline">Cancel</span>
                </>
              ) : (
                <>
                  <Merge className="size-4 md:mr-2" />
                  <span className="hidden md:inline">Merge Notes</span>
                </>
              )}
            </Button>
          </div>
        )}
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
            <div key={note.id} className={`bg-card border rounded-lg p-6 hover:shadow-md transition-all ${
              mergeMode 
                ? selectedNotes.has(note.id) 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border cursor-pointer hover:border-primary/50'
                : 'border-border'
            }`}
            onClick={() => mergeMode && toggleNoteSelection(note.id)}
            >
              {mergeMode && (
                <div className="flex items-center mb-4">
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      selectedNotes.has(note.id)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedNotes.has(note.id) && <Check className="size-3" />}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {selectedNotes.has(note.id) ? 'Selected' : 'Click to select'}
                  </span>
                </div>
              )}
              {note.isMerged && (
                <div className="mb-4 pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Merge className="size-3" />
                    Merged from {note.mergedFrom?.length || 0} notes
                  </div>
                </div>
              )}
              {note.quotedText && (
                <div className="mb-4 pb-4 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2">Quoted text:</div>
                  <div className="bg-muted/30 rounded px-3 py-2 text-sm border-l-2 border-primary/30">
                    {note.quotedText}
                  </div>
                </div>
              )}
              
              {editingId === note.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[100px] p-3 text-sm border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                  autoFocus
                />
              ) : note.isMerged ? (
                <div className="mb-4 markdown-content text-sm">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 hover:decoration-blue-600 transition-colors inline-flex items-center gap-1"
                        >
                          {children}
                          <ExternalLink className="size-3" />
                        </a>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/40 bg-primary/5 pl-4 py-3 my-4 italic rounded-r-md">
                          <div className="text-primary/80 font-medium">
                            {children}
                          </div>
                        </blockquote>
                      ),
                      hr: () => (
                        <div className="flex items-center justify-center my-8">
                          <hr className="flex-1 border-border/50" />
                          <div className="mx-4 text-muted-foreground">
                            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                          </div>
                          <hr className="flex-1 border-border/50" />
                        </div>
                      ),
                      em: ({ children }) => (
                        <em className="text-muted-foreground text-xs not-italic">
                          {children}
                        </em>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      )
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm mb-4 leading-relaxed">
                  {note.content}
                </div>
              )}
              
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {note.isMerged && note.lastUpdated 
                      ? formatDate(note.lastUpdated)
                      : formatDate(note.timestamp)
                    }
                  </div>
                  {note.isMerged ? (
                    <div className="flex items-center gap-1">
                      <Merge className="size-3" />
                      Merged Note
                    </div>
                  ) : (
                    <Link 
                      href={note.url} 
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      {note.url}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!mergeMode && editingId === note.id ? (
                    <>
                      <Button
                        onClick={() => saveEdit(note.id)}
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 h-auto p-1"
                      >
                        <Save className="size-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted h-auto p-1"
                      >
                        <X className="size-3 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : !mergeMode ? (
                    <>
                      <Button
                        onClick={() => startEdit(note)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-1"
                      >
                        <Edit2 className="size-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(note.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto p-1"
                      >
                        Delete
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                {/* Date and Source Row */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {note.isMerged && note.lastUpdated 
                      ? formatDate(note.lastUpdated)
                      : formatDate(note.timestamp)
                    }
                  </div>
                  {note.isMerged ? (
                    <div className="flex items-center gap-1">
                      <Merge className="size-3" />
                      Merged Note
                    </div>
                  ) : (
                    <Link 
                      href={note.url} 
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      <span className="truncate max-w-[200px]">{note.url}</span>
                    </Link>
                  )}
                </div>

                {/* Action Buttons Row */}
                {!mergeMode && (
                  <div className="flex items-center gap-2">
                    {editingId === note.id ? (
                      <>
                        <Button
                          onClick={() => saveEdit(note.id)}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-auto px-3 py-2 flex-1"
                        >
                          <Save className="size-3 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted h-auto px-3 py-2 flex-1"
                        >
                          <X className="size-3 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEdit(note)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto px-3 py-2 flex-1"
                        >
                          <Edit2 className="size-3 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(note.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto px-3 py-2 flex-1"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}