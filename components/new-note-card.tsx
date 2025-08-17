"use client"

import { useState } from "react"
import { Plus, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MDXEditor, headingsPlugin, quotePlugin, listsPlugin, linkPlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, BoldItalicUnderlineToggles, UndoRedo, Separator, BlockTypeSelect, CreateLink, InsertTable, toolbarPlugin } from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"

interface NewNoteCardProps {
  onSave: (title: string, content: string) => void
}

export function NewNoteCard({ onSave }: NewNoteCardProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), content)
      setTitle("")
      setContent("")
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setIsCreating(false)
  }

  if (!isCreating) {
    return (
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setIsCreating(true)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Plus className="size-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Create new note</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-medium"
            autoFocus
          />
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
            <Save className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <MDXEditor
            markdown={content}
            onChange={setContent}
            plugins={[
              headingsPlugin(),
              quotePlugin(),
              listsPlugin(),
              linkPlugin(),
              tablePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <CreateLink />
                    <InsertTable />
                  </>
                )
              })
            ]}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}