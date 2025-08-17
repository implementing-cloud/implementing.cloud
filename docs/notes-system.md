# Notes System Documentation

## Overview
The Quick Notes system allows users to capture thoughts, insights, and quotes from any page on the site with a simple keyboard shortcut or floating button. Notes can be edited, merged, and organized efficiently.

## Features

### 📝 Quick Note Creation
- **Keyboard Shortcut**: Press `N` anywhere on the site to open quick note input
- **Floating Button**: Click the floating notebook icon (positioned at `bottom-6 right-6` on mobile, `right-20` on desktop)
- **Quote Capture**: Selected text is automatically captured as a quoted source
- **Auto-save**: Notes are saved to localStorage on Enter, cancelled with Escape

### 📋 Note Management
- **View All Notes**: Navigate to `/notes` page to see all captured notes
- **Edit Notes**: Click "Edit" button to modify note content inline
- **Delete Confirmation**: Safe deletion with confirmation dialog
- **Responsive Layout**: Optimized layouts for mobile and desktop

### 🔗 Merge Functionality
- **Manual Selection**: Select multiple notes via checkboxes
- **Merge Button**: Appears when 2+ notes are selected
- **Smart Formatting**: Merged notes use markdown with inline source attribution
- **Quote Preservation**: All quotes are preserved with proper attribution
- **Chronological Order**: Notes are merged from oldest to newest

### 🎨 Visual Design
- **FlickeringGrid Background**: Animated grid background consistent with homepage
- **Markdown Rendering**: Merged notes render as interactive markdown
- **Mobile Optimization**: Icon-only buttons and separate action rows on mobile
- **Responsive Design**: Adapts seamlessly between mobile and desktop views

## Technical Implementation

### Data Structure
```typescript
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
```

### Storage
- **localStorage**: All notes stored in `quick-notes` key
- **Serialization**: Dates are properly serialized/deserialized
- **Error Handling**: Graceful fallbacks for corrupted data

### Merge Format (Strategy B - Inline Attribution)
```markdown
*Jan 15, 2025, 10:30 AM • [example.com](https://example.com)*

> **Quote:** "This is the quoted text from the source"

[Note content here]

---

*Jan 15, 2025, 11:45 AM • [about](/about)*

[Another note content]
```

## User Interface

### Desktop Layout
- **Single Row Footer**: Date/source on left, actions on right
- **Full Text Buttons**: "Merge Notes", "Edit", "Delete" with icons
- **Compact Design**: Optimized for mouse interaction

### Mobile Layout
- **Two Row Footer**: 
  - Row 1: Date and source info
  - Row 2: Action buttons (Edit/Delete or Save/Cancel)
- **Icon-Only Merge**: Shows only merge icon and count
- **Full-Width Buttons**: Easy touch targets with `flex-1`
- **URL Truncation**: Long URLs truncated with `max-w-[200px]`

### Responsive Behaviors
- **Floating Button**: `right-6` on mobile, `right-20` on desktop
- **Header Actions**: Icon-only on mobile, full text on desktop
- **Button Sizing**: Larger padding and touch targets on mobile

## Keyboard Shortcuts
- **`N`**: Open quick note input (when not in input fields)
- **`Enter`**: Save note and close input
- **`Shift+Enter`**: Add new line in note content
- **`Escape`**: Cancel note input and close

## Error Handling
- **Invalid Dates**: Graceful fallback to "Invalid date" display
- **Corrupted Data**: Safe parsing with try-catch blocks
- **Missing Fields**: Default values for optional properties
- **URL Parsing**: Handles both absolute and relative URLs

## Components

### Core Files
- `app/notes/page.tsx` - Main notes page with viewing, editing, merging
- `components/quick-notes.tsx` - Floating input and keyboard shortcuts
- `components/magicui/flickering-grid.tsx` - Animated background

### Dependencies
- `react-markdown` - Markdown rendering for merged notes
- `remark-gfm` - GitHub Flavored Markdown support
- `sonner` - Toast notifications for user feedback

## Development Notes

### State Management
- React useState for all local state
- No external state management library required
- localStorage sync on every change

### Performance Optimizations
- Intersection Observer for background animations
- Debounced textarea auto-resize
- Efficient re-renders with proper React patterns

### Accessibility
- Proper ARIA labels on buttons
- Keyboard navigation support
- Screen reader friendly confirmations
- Focus management in modals

## Future Enhancements
- [ ] Export notes to various formats
- [ ] Search and filter functionality
- [ ] Tag system for better organization
- [ ] Collaborative notes sharing
- [ ] Cloud sync capabilities
- [ ] Rich text editing support
- [ ] Note templates and snippets
- [ ] Bulk operations (select all, delete multiple)

## Testing Recommendations
- Test note creation from different pages
- Verify quote capture functionality
- Test merge functionality with various combinations
- Validate mobile responsive behaviors
- Test error scenarios (corrupted localStorage, invalid dates)
- Verify keyboard shortcuts work correctly
- Test confirmation dialogs and cancellation flows