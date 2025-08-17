"use client"

import { useCallback, useRef } from "react"

interface DebouncedSaveOptions {
  delay?: number
  onSave: (data: any) => void
  onSaveStart?: () => void
  onSaveComplete?: () => void
}

export function useDebouncedSave({ 
  delay = 1000, 
  onSave, 
  onSaveStart, 
  onSaveComplete 
}: DebouncedSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)

  const debouncedSave = useCallback((data: any) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set saving indicator
    if (!isSavingRef.current && onSaveStart) {
      isSavingRef.current = true
      onSaveStart()
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        onSave(data)
        isSavingRef.current = false
        if (onSaveComplete) {
          onSaveComplete()
        }
      } catch (error) {
        console.error("Auto-save error:", error)
        isSavingRef.current = false
        if (onSaveComplete) {
          onSaveComplete()
        }
      }
    }, delay)
  }, [delay, onSave, onSaveStart, onSaveComplete])

  const cancelSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (isSavingRef.current) {
      isSavingRef.current = false
      if (onSaveComplete) {
        onSaveComplete()
      }
    }
  }, [onSaveComplete])

  const forceSave = useCallback((data: any) => {
    cancelSave()
    onSave(data)
  }, [cancelSave, onSave])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    debouncedSave,
    cancelSave,
    forceSave,
    cleanup,
    isSaving: isSavingRef.current
  }
}