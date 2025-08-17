# Notes System Documentation

A comprehensive note-taking system with floating notes, MDX editing, and keyboard shortcuts built into the blog template.

## Overview

The notes system provides a powerful way to create, edit, and manage notes while browsing the site. Notes can be displayed as a sidebar or as draggable floating windows that overlay the main content.

## Features

### ✨ Core Features

- **Rich Text Editing**: Full MDX editor with formatting toolbar
- **Floating Notes**: Draggable and resizable note windows
- **Persistent Storage**: Notes saved to localStorage automatically
- **Keyboard Shortcuts**: Quick access with hotkeys
- **Push Layout**: Sidebar pushes content aside (like dashboard)
- **Real-time Updates**: Changes reflect immediately across all instances

### 🎯 User Interface

- **Floating Action Button**: Always-visible note icon in bottom-right corner
- **Sidebar Panel**: Organized list of all notes with creation interface
- **Floating Windows**: Individual notes that can be moved anywhere on screen
- **Responsive Design**: Works on desktop and mobile devices

## Usage Guide

### Opening Notes

#### Method 1: Keyboard Shortcut
- Press **`N`** key (when not typing in input fields)

#### Method 2: Floating Button
- Click the floating note icon in the bottom-right corner

### Creating Notes

1. Open the notes sidebar (press `N` or click floating button)
2. Click the "Create new note" dashed card
3. Enter a title for your note
4. Use the MDX editor to write content with rich formatting:
   - **Bold**, *italic*, and underlined text
   - Headers, lists, and quotes
   - Links and tables
   - Code blocks and more
5. Click the save button or press outside to save

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
| `N` | Toggle notes sidebar |

**Note**: Shortcuts only work when not typing in input fields, textareas, or editors.

## Technical Details

### Data Storage
- **Location**: Browser localStorage
- **Format**: JSON with automatic serialization
- **Persistence**: Notes persist across browser sessions
- **Backup**: Manual export/import (planned feature)

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
- Main orchestrator component
- Handles keyboard shortcuts
- Renders floating button and floating notes

#### `NotesSidebar`
- Right-side panel with notes list
- Integrates with existing sidebar system
- Shows note count and keyboard hint

#### `NewNoteCard`
- Dashed card for creating new notes
- Inline MDX editor for content creation
- Save/cancel functionality

#### `NotesList`
- Displays all notes with metadata
- Click to open as floating note
- Dropdown menu for actions

#### `FloatingNote`
- Individual draggable note window
- Edit mode with MDX editor
- Resize and position controls

### Hooks

#### `useNotes`
- Manages note data and localStorage
- CRUD operations for notes
- Floating note state management

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

- **Lazy Loading**: Components load only when needed
- **Efficient Updates**: React state management optimization
- **Memory Management**: Proper cleanup of event listeners
- **Storage Optimization**: Minimal localStorage footprint

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