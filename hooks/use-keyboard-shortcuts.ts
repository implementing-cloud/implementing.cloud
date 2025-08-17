"use client"

import { useEffect } from "react"

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in input fields
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('[contenteditable="true"]') ||
        target.closest('.mdxeditor')
      ) {
        return
      }

      // Check for shortcuts
      const key = event.key.toLowerCase()
      if (shortcuts[key]) {
        event.preventDefault()
        shortcuts[key]()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}