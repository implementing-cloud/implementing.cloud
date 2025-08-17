# Blog Template Style Guide

This document outlines the design system and styling conventions used in the blog template.

## Design Philosophy

The blog template follows a modern, clean design approach with emphasis on:
- **Readability**: Clear typography hierarchy and sufficient contrast
- **Elevation**: Layered design with shadows and depth
- **Responsive**: Mobile-first design that scales beautifully
- **Accessibility**: WCAG-compliant color schemes and interactions

## Color System

### Light Theme
- **Background**: `oklch(1 0 0)` - Pure white
- **Foreground**: `oklch(0.145 0 0)` - Near black
- **Card**: `oklch(1 0 0)` - White cards
- **Muted**: `oklch(0.97 0 0)` - Light gray backgrounds
- **Border**: `oklch(0.922 0 0)` - Subtle borders

### Dark Theme
- **Background**: `oklch(0.145 0 0)` - Dark charcoal
- **Foreground**: `oklch(0.985 0 0)` - Off-white
- **Card**: `oklch(0.205 0 0)` - Dark gray cards
- **Muted**: `oklch(0.269 0 0)` - Medium gray backgrounds
- **Border**: `oklch(1 0 0 / 10%)` - Semi-transparent borders

### Semantic Colors
- **Primary**: `oklch(0.205 0 0)` (light) / `oklch(0.922 0 0)` (dark)
- **Secondary**: `oklch(0.97 0 0)` (light) / `oklch(0.269 0 0)` (dark)
- **Destructive**: `oklch(0.577 0.245 27.325)` (light) / `oklch(0.704 0.191 22.216)` (dark)

### Custom Gradient Colors
- **Header Gradient**: `from-slate-100 via-blue-50 to-indigo-100` (light)
- **Header Gradient Dark**: `from-slate-900 via-slate-800 to-slate-700` (dark)
- **Blue Accent**: `bg-blue-100 text-blue-700` (light) / `bg-blue-900/30 text-blue-300` (dark)

## Typography

### Font Stack
- **Sans Serif**: `var(--font-geist-sans)` - Primary font family
- **Monospace**: `var(--font-geist-mono)` - Code and technical content

### Typography Scale
- **Heading XL**: `text-xl font-semibold` (20px, 600 weight)
- **Body**: `text-sm` (14px) for descriptions
- **Small**: `text-sm font-medium` for metadata

### Text Colors
- **Primary Text**: `text-slate-900 dark:text-white`
- **Secondary Text**: `text-slate-600 dark:text-slate-300`
- **Muted Text**: `text-muted-foreground`
- **Card Text**: `text-card-foreground`

## Layout System

### Container Patterns
```css
/* Standard container */
.container {
  max-width: 7xl;    /* 80rem / 1280px */
  margin: 0 auto;
  width: 100%;
  padding: 0 1.5rem; /* px-6 */
}

/* Large screen adjustment */
@media (min-width: 1024px) {
  .container {
    padding: 0; /* lg:px-0 */
  }
}
```

### Grid Systems

#### Articles Grid
- **Mobile**: `grid-cols-1`
- **Tablet**: `grid-cols-2` (md breakpoint)
- **Desktop**: `grid-cols-3` (lg breakpoint)

#### Bento Grid
- **Mobile**: `grid-cols-1`
- **Tablet**: `grid-cols-2` (md breakpoint)
- **Desktop**: `grid-cols-3` (lg breakpoint)
- **Rows**: `lg:grid-rows-2`
- **Auto Height**: `auto-rows-[22rem]`
- **Gap**: `gap-4` (1rem)

## Component Styles

### Site Navigation
```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 4rem; /* h-16 */
  background: gradient + backdrop-blur;
  border-bottom: semi-transparent;
}
```

### Blog Cards
```css
.blog-card {
  /* Pseudo-element borders for grid effect */
  position: relative;
  border-right: conditional;
}

.blog-card:before {
  position: absolute;
  left: -0.125rem;
  top: 0;
  height: 100vh;
  width: 1px;
  background: border-color;
}

.blog-card:after {
  position: absolute;
  top: -0.125rem;
  left: 0;
  height: 1px;
  width: 100vw;
  background: border-color;
}
```

### Bento Cards
```css
.bento-card {
  /* Enhanced elevation */
  background: white;
  border: gray-200/60;
  box-shadow: 
    0_2px_8px_rgba(0,0,0,.08),
    0_8px_24px_rgba(0,0,0,.12),
    0_1px_0px_rgba(255,255,255,0.05)_inset;
  
  /* Hover effects */
  transition: all 300ms ease-out;
}

.bento-card:hover {
  transform: scale(1.02);
  box-shadow: 
    0_8px_32px_rgba(0,0,0,.15),
    0_16px_48px_rgba(0,0,0,.20);
}

/* Dark mode */
.dark .bento-card {
  background: gray-900/90;
  border: gray-700/50;
  box-shadow: 
    0_2px_8px_rgba(0,0,0,.3),
    0_8px_24px_rgba(0,0,0,.4),
    0_1px_0px_rgba(255,255,255,0.1)_inset;
}
```

## Spacing System

### Vertical Spacing
- **Section Padding**: `py-8` (2rem top/bottom)
- **Card Padding**: `p-6` (1.5rem all sides)
- **Content Padding**: `p-4` (1rem all sides)

### Horizontal Spacing
- **Container**: `px-6 lg:px-0` (1.5rem mobile, 0 desktop)
- **Element Spacing**: `space-x-3` (0.75rem between elements)
- **Gap**: `gap-2` to `gap-6` (0.5rem to 1.5rem)

## Interactive States

### Hover Effects
```css
/* Scale transforms */
.hover-lift:hover {
  transform: scale(1.02);
}

/* Image scaling */
.image-hover:hover img {
  transform: scale(1.05);
}

/* Text underlines */
.link-hover:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Transitions
- **Duration**: `duration-300` (300ms) - Standard
- **Easing**: `ease-out` - For scaling/movement
- **Transform GPU**: `transform-gpu` - For performance

## Elevation System

### Shadow Levels
```css
/* Level 1 - Subtle */
box-shadow: 0_2px_8px_rgba(0,0,0,.08);

/* Level 2 - Medium */
box-shadow: 0_8px_24px_rgba(0,0,0,.12);

/* Level 3 - High */
box-shadow: 0_8px_32px_rgba(0,0,0,.15), 0_16px_48px_rgba(0,0,0,.20);

/* Dark mode adjustments */
/* Stronger shadows for dark backgrounds */
box-shadow: 0_2px_8px_rgba(0,0,0,.3), 0_8px_24px_rgba(0,0,0,.4);
```

## Border Radius

- **Standard**: `rounded-xl` (0.75rem)
- **Medium**: `rounded-md` (0.375rem)
- **Small**: `rounded` (0.25rem)
- **Full**: `rounded-full` (50%)

## Responsive Breakpoints

- **Mobile**: Default (0px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large**: `xl:` (1280px+)

## Animation Guidelines

### Performance
- Use `transform-gpu` for animations
- Prefer `transform` and `opacity` changes
- Avoid animating layout properties

### Duration Standards
- **Micro**: 150ms - Button states
- **Standard**: 300ms - Most transitions
- **Slow**: 500ms - Large movements

### Easing
- **ease-out**: For elements appearing/growing
- **ease-in**: For elements disappearing/shrinking
- **ease-in-out**: For elements moving position

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have sufficient contrast
- Focus states are clearly visible

### Focus Management
- All interactive elements have focus states
- Focus indicators use `outline-ring/50`
- Tab order follows logical flow

### Motion
- Animations respect `prefers-reduced-motion`
- Essential functionality works without animation

## Code Examples

### Standard Card Component
```tsx
<div className="bg-white dark:bg-gray-900/90 border border-gray-200/60 dark:border-gray-700/50 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,.15),0_16px_48px_rgba(0,0,0,.20)] hover:scale-[1.02] transition-all duration-300 ease-out">
  {/* Card content */}
</div>
```

### Container Layout
```tsx
<div className="max-w-7xl mx-auto w-full px-6 lg:px-0 py-8">
  {/* Content */}
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

## Maintenance Notes

- Color tokens use OKLCH for better perceptual uniformity
- All spacing follows the Tailwind scale (0.25rem increments)
- Components maintain consistent elevation hierarchy
- Dark mode colors are carefully balanced for readability
- Gradients provide subtle background interest without overwhelming content