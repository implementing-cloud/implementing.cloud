# Notes System Documentation

An optimized note-taking system with instant note creation, floating windows, and high-performance editing built into the blog template.

## Overview

The notes system provides a streamlined way to create, edit, and manage notes while browsing the site. Notes appear as draggable floating windows with full MDX editing capabilities, designed for maximum performance and minimal interruption.

## Features

### ✨ Core Features

- **Instant Note Creation**: Press N to create a note immediately
- **High-Performance**: Zustand state management with optimized re-renders
- **Floating Notes**: Smooth draggable and resizable note windows
- **Persistent Storage**: Notes saved to localStorage automatically
- **Smart Z-Index**: Notes always appear above page content
- **Auto-Cleanup**: Empty notes are automatically removed
- **Throttled Performance**: 60fps smooth drag/resize interactions

### 🎯 User Interface

- **Floating Action Button**: Always-visible note icon in bottom-right corner
- **Management Sidebar**: Clean list of notes with actions (no cramped editor)
- **Floating Windows**: Full-screen MDX editor in draggable windows
- **Responsive Design**: Optimized for desktop and mobile devices

## Usage Guide

### Creating Notes

#### Method 1: Instant Creation (Recommended)
- Press **`N`** key (when not typing in input fields)
- A new floating note appears instantly ready for editing

#### Method 2: From Sidebar
- Press **`S`** or click floating button to open sidebar
- Click the "New Note" card

### Managing Notes

#### Viewing Notes
- **In Sidebar**: Clean list showing title, last update time
- **As Floating**: Click any note in sidebar to open as floating editor

#### Editing Notes
- **Auto-Edit Mode**: New notes open directly in edit mode
- **Click Edit**: Use edit icon (✏️) in existing floating notes
- **Auto-Save**: Changes are saved automatically while typing

### Managing Notes

#### Viewing Notes
- **In Sidebar**: All notes show title, last update time, and content preview
- **As Floating**: Click any note in the sidebar to open as a floating window

#### Editing Notes
- **In Floating Window**: Click the edit icon (✏️) to switch to edit mode
- **Save Changes**: Click the save button when done editing
- **Cancel Edits**: Click the cancel button to discard changes

#### Deleting Notes
- Click the three-dot menu (⋮) on any note in the sidebar
- Select "Delete" from the dropdown menu

### Floating Notes

#### Opening Floating Notes
- Click any note in the sidebar list
- The note opens as a draggable window overlay

#### Moving Notes
- Click and drag the note header to reposition
- Notes can be moved anywhere on the screen
- Position is automatically saved

#### Resizing Notes
- Hover over the bottom-right corner until resize cursor appears
- Drag to resize the note window
- Minimum size: 300x200 pixels
- Size is automatically saved

#### Managing Multiple Floating Notes
- Click any floating note to bring it to the front
- Each note maintains its own position and size
- Notes stack with proper z-index management

#### Closing Floating Notes
- Click the X button in the note header
- This only closes the floating window, doesn't delete the note

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Create new floating note instantly |
| `S` | Toggle notes sidebar for management |

**Note**: Shortcuts only work when not typing in input fields, textareas, or editors.

## Technical Details

### State Management
- **Store**: Zustand with selective subscriptions
- **Performance**: Optimized re-renders, only affected components update
- **Persistence**: Browser localStorage with automatic serialization
- **Auto-Cleanup**: Empty notes removed every 30 seconds

### Performance Optimizations
- **Throttled Updates**: 60fps drag/resize with 16ms throttling
- **Smart Z-Index**: Dynamic z-index management (minimum 9999)
- **Selective Subscriptions**: Components only re-render when their data changes
- **Debounced Auto-Save**: Content saves throttled to 100ms for smooth typing

### Data Structure
```typescript
interface Note {
  id: string          // Unique identifier
  title: string       // Note title
  content: string     // MDX content
  createdAt: Date     // Creation timestamp
  updatedAt: Date     // Last modification timestamp
}

interface FloatingNote {
  noteId: string      // Reference to note ID
  x: number          // X position on screen
  y: number          // Y position on screen
  width: number      // Window width
  height: number     // Window height
  zIndex: number     // Stacking order
}
```

### MDX Editor Features
- **Toolbar**: Bold, italic, underline toggles
- **Block Types**: Headers, paragraphs, quotes, lists
- **Advanced**: Links, tables, code blocks
- **Shortcuts**: Markdown shortcuts work (e.g., `**bold**`)
- **Undo/Redo**: Full history support

## Component Architecture

### Core Components

#### `NotesWrapper`
- Main orchestrator component with auto-cleanup
- Handles keyboard shortcuts (N for create, S for sidebar)
- Renders floating button and floating notes with performance monitoring

#### `NotesSidebar`
- Simplified management-only sidebar
- Clean notes list with quick actions
- No embedded editor (better UX)

#### `NotesList`
- Optimized list with selective re-rendering
- Click to open as floating note
- Dropdown menu for delete action

#### `FloatingNote`
- High-performance draggable note window
- Throttled drag/resize for 60fps smoothness
- Full MDX editor with auto-save
- Smart z-index management

### State Management

#### `useNotesStore` (Zustand)
- Centralized state with selective subscriptions
- Optimized CRUD operations
- Auto-cleanup and localStorage persistence

#### Selective Hooks
- `useNotes()` - Subscribe to notes array only
- `useFloatingNotes()` - Subscribe to floating positions only  
- `useNotesActions()` - Access actions without re-renders
- `useNotesLoaded()` - Subscribe to loading state only

#### `useKeyboardShortcuts`
- Global keyboard event handling
- Smart input field detection
- Configurable shortcut mappings

## Styling

### Design System
- Uses existing UI components (Button, Input, Card)
- Consistent with site theme and colors
- Responsive design patterns

### Floating Notes
- Semi-transparent background with backdrop blur
- Drop shadow for depth
- Smooth animations and transitions
- Hover states for interactive elements

### Sidebar Integration
- Matches existing sidebar component styling
- Proper spacing and typography
- Loading states and empty states

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Touch-friendly interface
- **Keyboard Navigation**: Full accessibility support
- **LocalStorage**: Required for persistence

## Performance

- **Zustand Store**: Eliminates React Context re-render cascades
- **Selective Subscriptions**: Components only update when their data changes
- **Throttled Interactions**: 60fps smooth drag/resize with 16ms throttling
- **Smart Z-Index**: Dynamic management without layout thrashing
- **Auto-Cleanup**: Periodic empty note removal (30s intervals)
- **Debounced Auto-Save**: Smooth typing with 100ms content save throttling
- **Memory Management**: Proper cleanup of timers and event listeners
- **Storage Optimization**: Efficient localStorage with automatic serialization

## Security

- **XSS Protection**: Content sanitized through MDX
- **Local Only**: No server-side storage or transmission
- **Privacy**: All data stays in user's browser

## Future Enhancements

### Planned Features
- [ ] Note categories and tags
- [ ] Search functionality
- [ ] Export/import notes
- [ ] Note templates
- [ ] Collaboration features
- [ ] Mobile app companion

### Possible Integrations
- [ ] Cloud storage sync
- [ ] Version history
- [ ] Note sharing
- [ ] AI-powered features

## Troubleshooting

### Common Issues

#### Notes Not Saving
- Check browser localStorage is enabled
- Clear localStorage if corrupted: `localStorage.clear()`
- Refresh the page to reinitialize

#### Keyboard Shortcuts Not Working
- Make sure you're not in an input field
- Check for browser extension conflicts
- Try clicking outside any form fields first

#### Floating Notes Positioning Issues
- Reset positions by clearing localStorage
- Check for CSS conflicts with z-index
- Ensure viewport is large enough

#### MDX Editor Problems
- Refresh the page to reinitialize editor
- Check for JavaScript errors in console
- Verify MDX editor dependencies are loaded

### Debug Information
- Open browser dev tools → Console
- Check for error messages
- View localStorage data: `localStorage.getItem('notes')`

## API Reference

### useNotes Hook

```typescript
const {
  notes,              // Array of all notes
  floatingNotes,      // Array of floating note positions
  isLoaded,          // Boolean: localStorage loaded
  addNote,           // Function: (title, content) => Note
  updateNoteById,    // Function: (id, updates) => void
  deleteNote,        // Function: (id) => void
  openFloatingNote,  // Function: (noteId, position?) => void
  closeFloatingNote, // Function: (noteId) => void
  updateFloatingNote,// Function: (noteId, updates) => void
  bringToFront,      // Function: (noteId) => void
} = useNotes()
```

### Keyboard Shortcuts Hook

```typescript
useKeyboardShortcuts({
  'n': () => toggleSidebar(),
  'escape': () => closeAllFloating(),
  // Add more shortcuts as needed
})
```

## Contributing

When contributing to the notes system:

1. Follow existing component patterns
2. Maintain TypeScript strict typing
3. Add proper error handling
4. Test localStorage functionality
5. Ensure accessibility compliance
6. Update this documentation

## License

This notes system is part of the blog template and follows the same license terms.