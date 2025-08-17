"use client"

import React, { memo } from "react"
import { Input } from "@/components/ui/input"
import { MDXEditor, headingsPlugin, quotePlugin, listsPlugin, linkPlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, BoldItalicUnderlineToggles, UndoRedo, Separator, BlockTypeSelect, CreateLink, InsertTable, toolbarPlugin } from "@mdxeditor/editor"

// Memoized title input to prevent unnecessary re-renders
export const OptimizedTitleInput = memo(function OptimizedTitleInput({
  value,
  onChange,
  className,
  autoFocus,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  autoFocus?: boolean
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      autoFocus={autoFocus}
    />
  )
})

// Memoized MDX editor to prevent unnecessary re-renders
export const OptimizedMDXEditor = memo(function OptimizedMDXEditor({
  markdown,
  onChange,
  className,
}: {
  markdown: string
  onChange: (markdown: string) => void
  className?: string
}) {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
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
      className={className}
    />
  )
})