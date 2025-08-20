# Compare Page TODO

## Missing Features to Implement

### 1. Service Category Comparison (`/compare/category/[parent]/[categories]`)

**Status**: Partially implemented (URL parsing exists, but UI missing)

**Current State**:
- ✅ URL parsing logic exists in `/app/compare/[...params]/page.tsx`
- ✅ `getCategoriesByIds()` function referenced but not implemented
- ❌ No UI to select and compare service categories
- ❌ No category comparison table component
- ❌ No data structure for category-level features

**What Needs to Be Done**:
1. **Implement Category Selection UI**:
   - Add category comparison mode to main compare page
   - Create category cards showing subcategories within each category
   - Allow multi-select of categories (e.g., Compute vs Storage vs AI/ML)

2. **Create Category Comparison Data Structure**:
   ```typescript
   interface CategoryComparison {
     id: string;
     name: string;
     description: string;
     serviceCount: number;
     averagePricing: string;
     majorProviders: string[];
     useCases: string[];
     maturityLevel: string;
     marketSize: string;
   }
   ```

3. **Build Category Comparison Table**:
   - High-level comparison of different service categories
   - Show service counts, pricing ranges, use cases
   - Different from service-level comparisons

4. **URL Examples**:
   - `/compare/category/compute-vs-storage-vs-ai-ml`
   - `/compare/category/compute/vm-vs-faas-vs-caas`

### 2. Provider Category Comparison (New Feature)

**Status**: Not implemented

**Requirements**:
- Compare provider categories: Hyperscaler vs Alternative Cloud vs PaaS vs Managed Database
- Similar to service category comparison but for provider types

**What Needs to Be Done**:
1. **Add Provider Category Mode to UI**:
   - Third option in comparison type toggle: "Compare Provider Categories"
   - Category selection interface for provider types

2. **Create Provider Category Data Structure**:
   ```typescript
   interface ProviderCategoryComparison {
     id: string;
     name: string;
     description: string;
     providerCount: number;
     marketCharacteristics: string[];
     typicalPricing: string;
     targetCustomers: string[];
     averageRegions: number;
     serviceComplexity: string;
     supportLevel: string;
   }
   ```

3. **Provider Category Data**:
   - **Hyperscaler**: AWS, Azure, GCP (comprehensive services, global scale)
   - **Alternative Cloud**: DigitalOcean, Linode, Vultr (simplified, developer-focused)
   - **PaaS**: Heroku, Vercel, Netlify (application platforms)
   - **Managed Database**: PlanetScale, Supabase, MongoDB Atlas (database-focused)

4. **Build Provider Category Comparison**:
   - Compare characteristics of different provider categories
   - Market positioning, pricing models, target audiences
   - Service breadth vs depth analysis

5. **URL Pattern**:
   - `/compare/provider-category/hyperscaler-vs-alternative-cloud-vs-paas`

### 3. Implementation Tasks

#### Phase 1: Service Category Comparison
- [ ] Implement `getCategoriesByIds()` function in comparison-data.ts
- [ ] Create category comparison data with high-level metrics
- [ ] Add category comparison mode to main UI
- [ ] Build CategoryComparisonTable component
- [ ] Test URL routing and SEO metadata
- [ ] Update documentation

#### Phase 2: Provider Category Comparison  
- [ ] Add provider category data structure
- [ ] Create provider category comparison interface
- [ ] Implement provider category selection UI
- [ ] Build provider category comparison table
- [ ] Add routing support for provider categories
- [ ] Update URL parsing logic
- [ ] Test and document

#### Phase 3: UI Enhancement
- [ ] Add three-way toggle: Services | Providers | Categories
- [ ] Update filter section to handle category selections
- [ ] Ensure responsive design works with new options
- [ ] Add proper loading and error states
- [ ] Implement analytics tracking

### 4. Data Requirements

#### Service Categories to Compare:
- **Compute**: VM, containers, serverless comparison
- **Storage**: Object, block, database storage comparison  
- **AI/ML**: Machine learning, computer vision, NLP comparison
- **Networking**: CDN, load balancers, VPN comparison (when added)
- **Security**: Identity, encryption, monitoring comparison (when added)

#### Provider Categories to Compare:
- **Hyperscaler**: Full-service cloud providers (AWS, Azure, GCP)
- **Alternative Cloud**: Developer-focused alternatives (DO, Linode, Vultr)
- **PaaS**: Application platforms (Heroku, Vercel, Netlify)
- **Managed Database**: Database specialists (PlanetScale, Supabase, MongoDB Atlas)
- **Specialty**: Niche providers (CDN, security, etc. - future)

### 5. Current Code References

**Files that need updates**:
- `/app/compare/page.tsx` - Add category comparison modes
- `/app/compare/[...params]/page.tsx` - Implement missing category parsing
- `/lib/comparison-data.ts` - Add category comparison data
- `/lib/category-comparison-data.ts` - Create new file for category data
- `/components/category-comparison-table.tsx` - Build comparison component

**Existing but incomplete**:
```typescript
// In /app/compare/[...params]/page.tsx - this exists but getCategoriesByIds() is not implemented
if (type === "category") {
  const [parentCategoryId, categorySlug] = rest;
  const childCategoryIds = categorySlug.split("-vs-");
  const categoryData = getCategoriesByIds(childCategoryIds); // ❌ Not implemented
}
```

### 6. Priority Order

1. **High Priority**: Service category comparison (partially exists)
2. **Medium Priority**: Provider category comparison (new feature)
3. **Low Priority**: UI enhancements and analytics

### 7. Success Criteria

- [ ] Users can compare service categories (e.g., Compute vs Storage)
- [ ] Users can compare provider categories (e.g., Hyperscaler vs PaaS)  
- [ ] URLs work correctly for all comparison types
- [ ] SEO metadata generates properly
- [ ] Mobile responsive design maintained
- [ ] Documentation updated with new features