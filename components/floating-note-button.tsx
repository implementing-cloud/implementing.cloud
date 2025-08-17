"use client"

import { StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingNoteButtonProps {
  onClick: () => void
}

export function FloatingNoteButton({ onClick }: FloatingNoteButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Open notes"
    >
      <StickyNote className="size-5" />
    </Button>
  )
}