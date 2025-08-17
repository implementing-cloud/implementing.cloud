# Mobile Promo Banner Feature

The mobile promo banner provides an interactive, space-efficient way to showcase key features on mobile devices. Instead of displaying 5 tall cards that require extensive scrolling, the mobile layout presents a highlighted feature card with a 2x2 grid of compact cards below.

## Overview

### Desktop Layout (lg+ breakpoints)
- **BentoGrid**: Traditional 3-column bento-style layout
- **5 feature cards**: Each with full content, icons, descriptions, and CTAs
- **Grid positioning**: Cards span multiple rows/columns for visual hierarchy

### Mobile Layout (< lg breakpoints)
- **1 highlighted card**: Full-width featured card showing complete content
- **2x2 grid**: Four compact cards showing truncated titles
- **Interactive swapping**: Tap any grid card to promote it to highlighted position
- **Auto-rotation**: Highlighted card automatically cycles every 5 seconds

## Technical Implementation

### Component Structure

```tsx
// File: components/promo-banner.tsx
export function PromoBanner() {
  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-4 py-8">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <BentoGrid className="lg:grid-rows-2">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobilePromoGrid />
      </div>
    </div>
  );
}
```

### State Management

```tsx
const MobilePromoGrid = () => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHighlightedIndex((prev) => (prev + 1) % features.length);
        setIsTransitioning(false);
      }, 150);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual card swapping
  const handleCardSwap = (clickedIndex: number) => {
    if (clickedIndex === highlightedIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setHighlightedIndex(clickedIndex);
      setIsTransitioning(false);
    }, 150);
  };
};
```

## Feature Data Structure

Each feature object includes both full and shortened titles:

```tsx
const features = [
  {
    Icon: CloudIcon,
    name: "Service to explore",           // Full title for highlighted card
    shortName: "Explore",                // Truncated title for grid cards
    description: "Explore all major platforms...",
    href: "/",
    cta: "Learn more",
    background: <CloudList3D />,
    className: "lg:row-start-1 lg:row-end-3...", // Desktop grid positioning
  },
  // ... more features
];
```

### Truncated Titles
- **"Service to explore"** → **"Explore"**
- **"Implementation Guides"** → **"Guide"** 
- **"Learn AI, From Basics to Practical"** → **"AI"**
- **"Compare Pricing & Features"** → **"Compare"**
- **"Notes Built-in"** → **"Notes"**

## Animation System

### Smooth Fade Transitions
The mobile layout uses coordinated fade transitions instead of component remounting:

```tsx
// Background fade
<div 
  className={cn(
    "transition-opacity duration-300 ease-in-out",
    isTransitioning ? "opacity-0" : "opacity-100"
  )}
>
  {highlightedFeature.background}
</div>

// Content fade with subtle vertical movement
<div 
  className={cn(
    "transition-all duration-300 ease-in-out",
    isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
  )}
>
  {/* Content */}
</div>
```

### Grid Card Interactions
```tsx
// Grid card hover effects
className={cn(
  "hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 ease-out",
  "animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
)}

// Staggered entrance animations
style={{ animationDelay: `${(index + 1) * 100}ms` }}

// Icon and text hover effects
<feature.Icon className="transition-all duration-200 ease-out group-hover:scale-110 group-hover:rotate-3" />
<span className="transition-all duration-200 ease-out group-hover:scale-105">
  {feature.shortName}
</span>
```

## Styling Guidelines

### Highlighted Card
- **Height**: `h-64` (256px) - Optimal for mobile viewing
- **Padding**: `p-4` - Comfortable content spacing
- **Background**: Full background component with overflow hidden
- **Content**: Stacked layout with icon, title, description, and CTA

### Grid Cards
- **Height**: `h-24` (96px) - Compact but tappable
- **Layout**: Centered flex column
- **Content**: Icon + truncated title only
- **Grid**: `grid-cols-2 gap-3` - Even 2x2 layout

### Responsive Breakpoints
- **Mobile**: `< lg` (< 1024px) - Shows mobile interactive layout
- **Desktop**: `lg+` (1024px+) - Shows traditional BentoGrid

## User Experience

### Benefits
1. **Reduced Scrolling**: Compact layout shows all features at once
2. **Interactive Discovery**: Users can explore features by tapping
3. **Passive Learning**: Auto-rotation introduces features without user action
4. **Immediate Value**: Highlighted card provides full feature details upfront
5. **Familiar Patterns**: Tap-to-expand follows mobile UX conventions

### Interaction Flow
1. User sees highlighted feature with full description
2. User can tap any grid card to see its details
3. Smooth fade transition swaps content
4. After 5 seconds, auto-rotation moves to next feature
5. User interaction resets auto-rotation timer

## Performance Considerations

### Client Component
```tsx
"use client";
```
Required for React hooks (`useState`, `useEffect`) and interactive features.

### Animation Performance
- Uses `transition-all duration-300 ease-out` for smooth animations
- GPU-accelerated transforms (`scale`, `translate`)
- Opacity transitions for better performance than layout changes

### Accessibility
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Management**: Clear focus indicators on grid cards
- **Motion Respect**: Animations use standard durations suitable for most users
- **Color Contrast**: Maintains WCAG AA compliance across themes

## Maintenance

### Adding New Features
1. Add feature object to `features` array with `shortName` property
2. Ensure `shortName` is concise (1-2 words max)
3. Test auto-rotation with new feature count
4. Verify responsive layout with additional grid cards

### Customizing Timing
```tsx
// Auto-rotation interval (currently 5 seconds)
const interval = setInterval(() => {
  // Rotation logic
}, 5000); // Adjust this value

// Transition duration (currently 150ms fade + 300ms content)
setTimeout(() => {
  setHighlightedIndex(clickedIndex);
  setIsTransitioning(false);
}, 150); // Adjust this value
```

### Styling Customization
Modify transition classes in the component:
- **Fade duration**: `duration-300` → `duration-500` for slower transitions
- **Movement distance**: `translate-y-2` → `translate-y-4` for more dramatic motion
- **Hover effects**: Adjust `scale-[1.05]` values for different hover intensity

## Integration Notes

This feature integrates seamlessly with:
- **Theme System**: Supports light/dark mode switching
- **Responsive Design**: Breakpoint-aware layout switching  
- **Existing Components**: Reuses BentoCard, Button, and icon components
- **Site Navigation**: Maintains consistent styling with overall design system