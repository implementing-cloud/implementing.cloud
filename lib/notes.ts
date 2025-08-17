export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface FloatingNote {
  noteId: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

// Helper function to generate unique IDs
function generateId(): string {
  // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback: timestamp + random string
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Helper functions for note management
export function createNote(title: string, content: string = ""): Note {
  const now = new Date()
  return {
    id: generateId(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  }
}

export function updateNote(note: Note, updates: Partial<Pick<Note, 'title' | 'content'>>): Note {
  return {
    ...note,
    ...updates,
    updatedAt: new Date(),
  }
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}