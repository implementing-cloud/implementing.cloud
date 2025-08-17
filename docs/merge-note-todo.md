# Notes Merge Functionality Analysis

## Current Note Structure
Each `QuickNote` contains:
```typescript
interface QuickNote {
  id: string
  content: string
  url: string
  timestamp: Date
  quotedText?: string
}
```

## User Behavior Analysis & Merge Options

### 1. Manual Selection Merge (⭐ RECOMMENDED)
**Behavior**: Users select 2+ notes via checkboxes, then click "Merge Selected"

**User Scenarios**:
- Combining related insights from different sources
- Merging follow-up thoughts with original notes
- Consolidating research from multiple articles on the same topic

**Pros**:
- Complete user control over what gets merged
- Works for any merge scenario user can imagine
- Most flexible approach

**Cons**:
- Requires UI changes (selection state management)
- More manual work for users

**Implementation Complexity**: Medium

---

### 2. Time-Based Auto Merge
**Behavior**: Merge notes within configurable time windows (1 hour, same day, etc.)

**User Scenarios**:
- Research sessions: "Merge all notes from this morning"
- Study sessions: "Combine notes from this lecture"
- Reading sessions: "Group notes from this evening's reading"

**Pros**:
- Automatic grouping of temporally related notes
- Good for capturing "research sessions"
- Minimal user interaction needed

**Cons**:
- May merge unrelated notes from same time period
- Time windows are arbitrary and may not match user intent
- Less control over what gets merged

**Implementation Complexity**: Low

---

### 3. URL/Domain-Based Merge
**Behavior**: Merge all notes from the same URL or domain

**User Scenarios**:
- Consolidating multiple notes from a long article
- Combining insights from different pages on same website
- Merging notes from different sections of documentation

**Pros**:
- Logical grouping by information source
- Great for long-form content with multiple note-taking sessions
- Clear relationship between merged content

**Cons**:
- May lose temporal context of when insights were captured
- Different visits to same page might have different contexts
- Doesn't work well for cross-source research

**Implementation Complexity**: Low

---

### 4. Hybrid Approach
**Behavior**: Manual selection + smart suggestions based on URL/time proximity

**User Scenarios**:
- System suggests merging notes from same article
- System suggests merging notes from same time window
- User can accept, reject, or modify suggestions

**Pros**:
- Combines automation with user control
- Learns from user patterns over time
- Reduces manual work while maintaining flexibility

**Cons**:
- More complex to implement
- Risk of suggestion fatigue
- Requires sophisticated logic for good suggestions

**Implementation Complexity**: High

## Quote Preservation Strategies

### Current Challenge
Notes can have `quotedText` from their source pages. When merging, we need to preserve attribution and avoid confusion about quote sources.

### Strategy A: Separate Quotes Section
```
=== MERGED NOTE ===
[Combined note contents separated by dividers]

=== QUOTED SOURCES ===
From example.com (Jan 15, 2025):
"This is the quoted text from the first note"

From another-site.com (Jan 15, 2025):
"This is quoted text from the second note"
```

**Pros**: Clear separation, easy to understand
**Cons**: Quotes lose connection to specific note content

### Strategy B: Inline Source Attribution
```
=== MERGED NOTE ===

--- From example.com at 2025-01-15 10:30 AM ---
Quote: "This is the quoted text from the source"
[First note content here]

--- From another-site.com at 2025-01-15 11:45 AM ---
[Second note content here, no quote]

--- From example.com at 2025-01-15 12:15 PM ---
Quote: "Another quote from the same source"
[Third note content here]
```

**Pros**: Maintains context and attribution per note section
**Cons**: More verbose, potentially cluttered

### Strategy C: Structured Sections (⭐ RECOMMENDED)
```
=== MERGED NOTE ===
Topic: [User-provided or auto-generated topic]
Sources: example.com, another-site.com
Created: Jan 15, 2025

[Combined note contents with clear separators]

---

SOURCES & QUOTES:
• example.com (10:30 AM): "Quoted text here"
• another-site.com (11:45 AM): [No quote]
• example.com (12:15 PM): "Second quote here"
```

**Pros**: Clean, preserves all information, maintains readability
**Cons**: Requires most structural changes to note format

## Implementation Recommendation

### Phase 1: Manual Selection (Minimal Changes)
1. **Add Selection State**:
   ```typescript
   const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
   ```

2. **Add Checkbox UI**: 
   - Checkbox per note when in "merge mode"
   - "Select All" / "Clear All" options
   - "Merge Selected" button (disabled when < 2 notes selected)

3. **Implement Merge Function**:
   ```typescript
   const mergeNotes = (noteIds: string[]) => {
     // Use Strategy C format
     // Combine content with source attribution
     // Preserve all quotes with source links
     // Use earliest timestamp and primary URL
   }
   ```

### Merged Note Format
```typescript
interface MergedNote extends QuickNote {
  mergedFrom: {
    id: string
    url: string
    timestamp: Date
    quotedText?: string
  }[]
  isMerged: boolean
}
```

### Benefits of This Approach
- **Minimal Code Changes**: Builds on existing structure
- **Preserves All Information**: No data loss during merge
- **User Control**: Manual selection gives maximum flexibility
- **Clear Attribution**: Always know where content came from
- **Extensible**: Easy to add smart suggestions later

### Future Enhancements
- Smart merge suggestions based on URL/time proximity
- Undo functionality for recent merges
- Merge preview before confirmation
- Bulk operations (merge by tag, date range, etc.)
- Export merged notes to different formats

## Technical Implementation Notes

### Storage Considerations
- Merged notes maintain references to original note data
- Original notes are removed from main list but preserved in merge metadata
- LocalStorage structure remains compatible

### UI/UX Considerations
- Toggle between "normal" and "merge" modes
- Clear visual indicators for selected notes
- Confirmation dialog before merging (with preview)
- Ability to rename merged note during creation

### Edge Cases to Handle
- Merging notes with same URL but different timestamps
- Very long merged notes (UI truncation/expansion)
- Merging already-merged notes (nested merges)
- Preserving edit history through merges