# Compare Page Documentation

## Overview

The Compare page (`/compare`) allows users to compare cloud computing services and providers side by side. It features a clean, responsive interface with filtering capabilities and detailed comparison views.

## Page Structure

### Header
- **Consistent Design**: Matches other pages with FlickeringGrid background, Scale icon, and title
- **Comparison Type Toggle**: Users can switch between "Compare Services" and "Compare Providers"
- **Navigation**: Integrated with the site's navigation system

### Filter Section
- **Horizontal Layout**: Filters are positioned at the top of the content area for better UX
- **Responsive Design**: Stacks vertically on mobile, horizontal on desktop
- **Consistent Spacing**: All filter controls have uniform height (h-10) and proper spacing

## Service Comparison

### Filters Available:
1. **Category Popover**:
   - Searchable dropdown with category cards
   - Shows number of subcategories per category
   - Categories: Compute, Storage, AI & Machine Learning

2. **Subcategory Popover**:
   - Multi-select interface with checkmark indicators
   - Shows count of selected subcategories in trigger button
   - "Clear All" functionality
   - Examples: VM, CaaS, FaaS, Object Storage, etc.

3. **Search Input**:
   - Filters by service name, category, or features
   - Real-time filtering as user types

### Service Selection:
- **Visual Feedback**: Selected services show blue ring and background highlight
- **Card Design**: Service logo, name, category, features count, pricing, subcategory badge
- **Multi-select**: Users can select multiple services for comparison

### Comparison Actions:
- **Compare Button**: Navigates to detailed comparison view (`/compare/service/[services]`)
- **Simplified View**: Alternative comparison format (`/compare/simplified/service/[services]`)
- **URL Format**: SEO-friendly URLs like `/compare/service/aws_ec2-vs-azure_vm-vs-gcp_compute`

## Provider Comparison

### Filters Available:
1. **Search Only**: Simple search input for provider names, categories, or features

### Provider Selection:
- **Visual Feedback**: Same selection mechanism as services
- **Card Design**: Provider logo, name, category, regions/market share info, revenue, category badge
- **Multi-select**: Users can select multiple providers for comparison

### Comparison Actions:
- **Compare Button**: Navigates to detailed comparison view (`/compare/provider/[providers]`)
- **URL Format**: SEO-friendly URLs like `/compare/provider/aws-vs-azure-vs-gcp`

## Data Structure

### Services Data:
```typescript
interface Service {
  id: string;
  name: string;
  logo: string;
  parentCategory: string;
  childCategory: string;
  features: Record<string, string | number | boolean>;
}
```

### Providers Data:
```typescript
interface Provider {
  id: string;
  name: string;
  logo: string;
  category: string;
  features: Record<string, string | number | boolean>;
}
```

## URL State Management

- **Query Parameters**: Uses `nuqs` library for URL state management
- **Persistent State**: Filter selections and search queries persist in URL
- **Deep Linking**: Users can share filtered views via URL

## Responsive Design

### Mobile (< 640px):
- Filters stack vertically
- Cards display in single column
- Buttons stack in compare section

### Tablet (640px - 1024px):
- Filters arrange in flexible layout
- Cards display in 2-3 columns
- Improved spacing and alignment

### Desktop (> 1024px):
- Filters display horizontally with proper alignment
- Cards display in 3-4 columns
- Compare buttons align to the right

## Key Features

1. **Filter Summary as Title**: The "Showing all [X] category..." text serves as the section title
2. **Progressive Disclosure**: Only shows relevant filters based on selection
3. **Empty States**: Helpful messages when no results found
4. **Performance**: Efficient filtering with useMemo hooks
5. **Accessibility**: Proper ARIA labels and keyboard navigation support

## Comparison Routes

### `/compare/service/[...services]`
**Purpose**: Detailed service comparison with full feature table

**URL Pattern**: `/compare/service/aws_ec2-vs-azure_vm-vs-gcp_compute`

**Features**:
- Full comparison table with all service features
- Sticky headers for easy navigation
- Side-by-side feature comparison
- SEO-optimized metadata generation
- "Back to Selection" and "Simplified View" buttons

**Implementation**: 
- Route: `/app/compare/[...params]/page.tsx`
- Parses service IDs from URL slug
- Fetches service data using `getServicesByIds()`
- Generates dynamic page titles and descriptions
- Supports 1-N service comparisons

### `/compare/simplified/[...services]`
**Purpose**: Simplified service comparison with condensed view

**URL Pattern**: `/compare/simplified/service/aws_ec2-vs-azure_vm`

**Features**:
- Condensed comparison table
- Essential features only
- Better mobile experience
- Faster loading for basic comparisons
- Links back to full comparison

**Implementation**:
- Route: `/app/compare/simplified/[...params]/page.tsx`
- Same URL parsing as detailed view
- Uses simplified comparison component
- Optimized for mobile devices

### `/compare/provider/[...providers]`
**Purpose**: Detailed provider comparison with company information

**URL Pattern**: `/compare/provider/aws-vs-azure-vs-gcp`

**Features**:
- Company overview comparison
- Business metrics (revenue, market share, regions)
- Service portfolio comparison
- Enterprise features and compliance
- Investment and growth data

**Implementation**:
- Route: `/app/compare/[...params]/page.tsx`
- Parses provider IDs from URL slug
- Fetches provider data using `getProvidersByIds()`
- Converts provider data to service format for table compatibility
- Generates provider-specific metadata

## URL Parsing Logic

### Route Handler (`/app/compare/[...params]/page.tsx`)
The dynamic route handles three comparison types:

```typescript
function parseComparisonParams(params: string[]) {
  const [type, ...rest] = params;
  
  if (type === "service") {
    // /compare/service/aws_ec2-vs-azure_vm
    const serviceIds = rest.join("/").split("-vs-");
    return { type: "service", services: getServicesByIds(serviceIds) };
  }
  
  if (type === "provider") {
    // /compare/provider/aws-vs-azure
    const providerIds = rest.join("/").split("-vs-");
    return { type: "provider", providers: getProvidersByIds(providerIds) };
  }
  
  if (type === "category") {
    // /compare/category/compute/vm-vs-faas
    const [parentId, categorySlug] = rest;
    const categoryIds = categorySlug.split("-vs-");
    return { type: "category", categories: getCategoriesByIds(categoryIds) };
  }
}
```

### Metadata Generation
Each route generates SEO-optimized metadata:

**Service Comparisons**:
- Single: "Deep Dive to AWS EC2"
- Multiple: "AWS EC2 vs Azure VM Comparison" 
- Many: "AWS EC2 vs 3 other services compared"

**Provider Comparisons**:
- Single: "Deep Dive to Amazon Web Services"
- Multiple: "AWS vs Azure Provider Comparison"
- Many: "AWS vs 3 other providers compared"

## File Organization

- **Main Component**: `/app/compare/page.tsx` - Selection interface
- **Data**: `/lib/comparison-data.ts` - Service and provider data
- **Dynamic Routes**: `/app/compare/[...params]/page.tsx` - Detailed comparisons
- **Simplified View**: `/app/compare/simplified/[...params]/page.tsx` - Condensed comparisons
- **Comparison Table**: `/components/comparison-table.tsx` - Reusable table component
- **Category Comparison**: `/components/category-comparison-table.tsx` - Category-specific table

## Technical Implementation

### State Management:
- React useState for UI state (popovers, selections)
- nuqs for URL state management
- useMemo for performance optimization

### Routing:
- Next.js App Router with dynamic routes
- SEO-friendly URL generation
- Automatic navigation to comparison views

### Styling:
- Tailwind CSS for responsive design
- shadcn/ui components for consistency
- Custom animations and hover effects

## Comparison Table Features

### Layout & Design
- **Sticky Headers**: Column headers remain visible while scrolling
- **Responsive Scrolling**: Horizontal scroll for large comparison tables
- **Feature Rows**: Each feature gets its own row with alternating background colors
- **N/A Handling**: Graceful display when services don't have certain features

### Navigation
- **Back to Selection**: Returns to main comparison page with filters preserved
- **Simplified View**: Toggle between detailed and condensed views (services only)
- **Share URLs**: Each comparison has a unique, shareable URL

### Data Display
- **Feature Normalization**: Consistent display of different data types (strings, numbers, booleans)
- **Service Icons**: Emoji logos for visual identification
- **Missing Data**: "N/A" display for unavailable features
- **Responsive Design**: Mobile-optimized table with proper scrolling

## Usage Flow

### Main Selection Page (`/compare`)
1. **Landing**: User arrives at `/compare`
2. **Type Selection**: Choose between Services or Providers
3. **Filtering**: Use category, subcategory, and search filters
4. **Item Selection**: Click cards to select items for comparison (visual feedback)
5. **Comparison**: Click compare button to navigate to comparison view

### Comparison Pages
6. **Detailed View**: `/compare/service/[items]` or `/compare/provider/[items]`
   - Full feature comparison table
   - Sticky headers and responsive scrolling
   - Navigation back to selection or simplified view
7. **Simplified View**: `/compare/simplified/service/[items]` (services only)
   - Condensed comparison with essential features
   - Better mobile experience
   - Option to view full comparison

### URL Sharing & Navigation
8. **Direct Access**: Users can access comparisons directly via URL
9. **SEO Benefits**: Search engines can index individual comparisons
10. **Bookmarking**: Users can bookmark specific comparisons