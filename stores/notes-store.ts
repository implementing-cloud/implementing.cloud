"use client"

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { persist } from "zustand/middleware"
import { Note, FloatingNote, createNote, updateNote } from "@/lib/notes"

interface NotesState {
  // State
  notes: Note[]
  floatingNotes: FloatingNote[]
  isLoaded: boolean

  // Actions
  addNote: (title: string, content?: string) => Note
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void
  deleteNote: (id: string) => void
  
  // Floating note actions
  openFloatingNote: (noteId: string, position?: { x: number; y: number }) => void
  closeFloatingNote: (noteId: string) => void
  updateFloatingNote: (noteId: string, updates: Partial<FloatingNote>) => void
  bringToFront: (noteId: string) => void
  
  // Utility actions
  createEmptyNote: () => Note
  cleanupEmptyNotes: () => void
  setLoaded: (loaded: boolean) => void
}

// Helper function to generate safe positions
function getSafePosition(position?: { x: number; y: number }) {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  
  return {
    x: position?.x ?? Math.random() * Math.max(200, windowWidth - 400),
    y: position?.y ?? Math.random() * Math.max(100, windowHeight - 300),
  }
}

export const useNotesStore = create<NotesState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        notes: [],
        floatingNotes: [],
        isLoaded: false,

        // Note management
        addNote: (title: string, content: string = "") => {
          const newNote = createNote(title, content)
          set((state) => ({
            notes: [newNote, ...state.notes],
          }))
          return newNote
        },

        updateNote: (id: string, updates) => {
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? updateNote(note, updates) : note
            ),
          }))
        },

        deleteNote: (id: string) => {
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
            floatingNotes: state.floatingNotes.filter((floating) => floating.noteId !== id),
          }))
        },

        // Floating note management
        openFloatingNote: (noteId: string, position?) => {
          const state = get()
          
          // Check if note is already floating
          const existingFloating = state.floatingNotes.find((f) => f.noteId === noteId)
          if (existingFloating) {
            // Bring to front
            const maxZ = Math.max(...state.floatingNotes.map((f) => f.zIndex), 0)
            set((state) => ({
              floatingNotes: state.floatingNotes.map((f) =>
                f.noteId === noteId ? { ...f, zIndex: maxZ + 1 } : f
              ),
            }))
            return
          }

          // Create new floating note
          const maxZ = Math.max(...state.floatingNotes.map((f) => f.zIndex), 0)
          const safePosition = getSafePosition(position)
          
          const newFloating: FloatingNote = {
            noteId,
            x: safePosition.x,
            y: safePosition.y,
            width: 400,
            height: 300,
            zIndex: maxZ + 1,
          }

          set((state) => ({
            floatingNotes: [...state.floatingNotes, newFloating],
          }))
        },

        closeFloatingNote: (noteId: string) => {
          set((state) => ({
            floatingNotes: state.floatingNotes.filter((f) => f.noteId !== noteId),
          }))
        },

        updateFloatingNote: (noteId: string, updates) => {
          set((state) => ({
            floatingNotes: state.floatingNotes.map((f) =>
              f.noteId === noteId ? { ...f, ...updates } : f
            ),
          }))
        },

        bringToFront: (noteId: string) => {
          const state = get()
          const maxZ = Math.max(...state.floatingNotes.map((f) => f.zIndex), 0)
          set((state) => ({
            floatingNotes: state.floatingNotes.map((f) =>
              f.noteId === noteId ? { ...f, zIndex: maxZ + 1 } : f
            ),
          }))
        },

        // Utility functions
        createEmptyNote: () => {
          const title = `Note ${new Date().toLocaleTimeString()}`
          const newNote = get().addNote(title, "")
          
          // Open as floating note immediately
          get().openFloatingNote(newNote.id)
          
          return newNote
        },

        cleanupEmptyNotes: () => {
          const state = get()
          const emptyNoteIds = state.notes
            .filter((note) => !note.title.trim() && !note.content.trim())
            .map((note) => note.id)
          
          if (emptyNoteIds.length > 0) {
            set((state) => ({
              notes: state.notes.filter((note) => !emptyNoteIds.includes(note.id)),
              floatingNotes: state.floatingNotes.filter((floating) => !emptyNoteIds.includes(floating.noteId)),
            }))
          }
        },

        setLoaded: (loaded: boolean) => {
          set({ isLoaded: loaded })
        },
      }),
      {
        name: "notes-storage",
        partialize: (state) => ({
          notes: state.notes,
          floatingNotes: state.floatingNotes,
        }),
        // Add merge strategy to prevent unnecessary writes
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as object),
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert date strings back to Date objects after rehydration
            state.notes = state.notes.map((note: any) => ({
              ...note,
              createdAt: new Date(note.createdAt),
              updatedAt: new Date(note.updatedAt),
            }))
            state.setLoaded(true)
          }
        },
        // Reduce localStorage frequency with skipHydration for better performance
        skipHydration: false,
      }
    )
  )
)

// Utility hooks for selective subscriptions (prevents unnecessary re-renders)
export const useNotes = () => useNotesStore((state) => state.notes)
export const useFloatingNotes = () => useNotesStore((state) => state.floatingNotes)
export const useNotesLoaded = () => useNotesStore((state) => state.isLoaded)

// Action hooks
export const useNotesActions = () => {
  const store = useNotesStore()
  return {
    addNote: store.addNote,
    updateNote: store.updateNote,
    deleteNote: store.deleteNote,
    openFloatingNote: store.openFloatingNote,
    closeFloatingNote: store.closeFloatingNote,
    updateFloatingNote: store.updateFloatingNote,
    bringToFront: store.bringToFront,
    createEmptyNote: store.createEmptyNote,
    cleanupEmptyNotes: store.cleanupEmptyNotes,
  }
}