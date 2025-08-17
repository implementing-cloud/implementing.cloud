"use client"

import { useState, useEffect, useCallback } from "react"
import { Note, FloatingNote, createNote, updateNote } from "@/lib/notes"

const NOTES_STORAGE_KEY = "notes"
const FLOATING_NOTES_STORAGE_KEY = "floating-notes"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
      const savedFloatingNotes = localStorage.getItem(FLOATING_NOTES_STORAGE_KEY)
      
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes)
        // Convert date strings back to Date objects
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(notesWithDates)
      }

      if (savedFloatingNotes) {
        setFloatingNotes(JSON.parse(savedFloatingNotes))
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoaded])

  // Save floating notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FLOATING_NOTES_STORAGE_KEY, JSON.stringify(floatingNotes))
    }
  }, [floatingNotes, isLoaded])

  const addNote = useCallback((title: string, content: string = "") => {
    const newNote = createNote(title, content)
    setNotes(prev => [newNote, ...prev])
    return newNote
  }, [])

  const updateNoteById = useCallback((id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? updateNote(note, updates) : note
    ))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    setFloatingNotes(prev => prev.filter(floating => floating.noteId !== id))
  }, [])

  const openFloatingNote = useCallback((noteId: string, position?: { x: number; y: number }) => {
    // Check if note is already floating
    const existingFloating = floatingNotes.find(f => f.noteId === noteId)
    if (existingFloating) {
      // Bring to front
      const maxZ = Math.max(...floatingNotes.map(f => f.zIndex), 0)
      setFloatingNotes(prev => prev.map(f => 
        f.noteId === noteId ? { ...f, zIndex: maxZ + 1 } : f
      ))
      return
    }

    // Create new floating note
    const maxZ = Math.max(...floatingNotes.map(f => f.zIndex), 0)
    
    // Safe window access with fallbacks
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    
    const newFloating: FloatingNote = {
      noteId,
      x: position?.x ?? Math.random() * Math.max(200, windowWidth - 400),
      y: position?.y ?? Math.random() * Math.max(100, windowHeight - 300),
      width: 400,
      height: 300,
      zIndex: maxZ + 1,
    }
    
    setFloatingNotes(prev => [...prev, newFloating])
  }, [floatingNotes])

  const closeFloatingNote = useCallback((noteId: string) => {
    setFloatingNotes(prev => prev.filter(f => f.noteId !== noteId))
  }, [])

  const updateFloatingNote = useCallback((noteId: string, updates: Partial<FloatingNote>) => {
    setFloatingNotes(prev => prev.map(f => 
      f.noteId === noteId ? { ...f, ...updates } : f
    ))
  }, [])

  const bringToFront = useCallback((noteId: string) => {
    const maxZ = Math.max(...floatingNotes.map(f => f.zIndex), 0)
    setFloatingNotes(prev => prev.map(f => 
      f.noteId === noteId ? { ...f, zIndex: maxZ + 1 } : f
    ))
  }, [floatingNotes])

  return {
    notes,
    floatingNotes,
    isLoaded,
    addNote,
    updateNoteById,
    deleteNote,
    openFloatingNote,
    closeFloatingNote,
    updateFloatingNote,
    bringToFront,
  }
}