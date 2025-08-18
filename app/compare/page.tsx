"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useRouter } from "next/navigation";
import { ComparisonTable } from "@/components/comparison-table";
import { parentCategories } from "@/lib/comparison-data";
import { Input } from "@/components/ui/input";
import { Search, X, TableIcon } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  
  // Use nuqs for query state management
  const [selectedParentCategory, setSelectedParentCategory] = useQueryState(
    'parent', 
    parseAsString.withDefault(parentCategories[0].id)
  );
  const [selectedSubCategories, setSelectedSubCategories] = useQueryState(
    'children', 
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedServices, setSelectedServices] = useQueryState(
    'services', 
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [showComparison, setShowComparison] = useQueryState(
    'view',
    parseAsString.withDefault('selection')
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  const [subCategorySearchQuery, setSubCategorySearchQuery] = useQueryState(
    'subSearch',
    parseAsString.withDefault('')
  );

  const currentParentCategory = parentCategories.find(cat => cat.id === selectedParentCategory);
  
  // Get all services from selected sub categories
  const allAvailableServices = currentParentCategory?.childCategories
    .filter(child => selectedSubCategories.length === 0 || selectedSubCategories.includes(child.id))
    .flatMap(child => child.services) || [];

  // Filter services based on search query
  const availableServices = allAvailableServices.filter(service => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.id.toLowerCase().includes(query) ||
      service.childCategory.toLowerCase().includes(query) ||
      Object.values(service.features).some(feature => 
        String(feature).toLowerCase().includes(query)
      )
    );
  });

  const selectedServiceData = availableServices.filter(service => 
    selectedServices.includes(service.id)
  );

  const toggleSubCategorySelection = (subCategoryId: string) => {
    setSelectedSubCategories(prev => 
      prev.includes(subCategoryId) 
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
    // Clear selected services when changing categories
    setSelectedServices([]);
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Generate comparison URL based on selected services
  const generateComparisonUrl = (services: string[]) => {
    if (services.length === 0) return;
    
    // Sort services for consistent URLs
    const sortedServices = [...services].sort();
    const urlSlug = sortedServices.join('-vs-');
    return `/compare/service/${urlSlug}`;
  };

  // Generate category comparison URL
  const generateCategoryComparisonUrl = (parentCat: string, subCats: string[]) => {
    if (subCats.length === 0) return;
    
    const sortedCategories = [...subCats].sort();
    const urlSlug = sortedCategories.join('-vs-');
    return `/compare/category/${parentCat}/${urlSlug}`;
  };

  const handleCompare = () => {
    if (selectedServices.length >= 1) {
      // Navigate to SEO-friendly comparison URL
      const comparisonUrl = generateComparisonUrl(selectedServices);
      if (comparisonUrl) {
        router.push(comparisonUrl);
      } else {
        // Fallback to query parameter approach
        setShowComparison('comparison');
      }
    }
  };

  const handleCompareCategories = () => {
    if (selectedSubCategories.length >= 1) {
      const categoryUrl = generateCategoryComparisonUrl(selectedParentCategory, selectedSubCategories);
      if (categoryUrl) {
        router.push(categoryUrl);
      }
    }
  };

  const handleCompareSimplified = () => {
    if (selectedServices.length >= 1) {
      // Navigate to simplified comparison URL
      const comparisonUrl = generateComparisonUrl(selectedServices);
      if (comparisonUrl) {
        router.push(`/compare/simplified${comparisonUrl.replace('/compare', '')}`);
      }
    }
  };

  const handleCompareCategoriesSimplified = () => {
    if (selectedSubCategories.length >= 1) {
      const categoryUrl = generateCategoryComparisonUrl(selectedParentCategory, selectedSubCategories);
      if (categoryUrl) {
        router.push(`/compare/simplified${categoryUrl.replace('/compare', '')}`);
      }
    }
  };

  const handleBackToSelection = () => {
    setShowComparison('selection');
  };

  const handleParentCategoryChange = (parentCategoryId: string) => {
    setSelectedParentCategory(parentCategoryId);
    setSelectedSubCategories([]);
    setSelectedServices([]);
  };

  // Select All functionality
  const handleSelectAllSubCategories = () => {
    if (!currentParentCategory) return;
    
    const allSubIds = currentParentCategory.childCategories.map(child => child.id);
    const isAllSelected = allSubIds.every(id => selectedSubCategories.includes(id));
    
    if (isAllSelected) {
      // Deselect all
      setSelectedSubCategories([]);
    } else {
      // Select all
      setSelectedSubCategories(allSubIds);
    }
    // Clear services when changing categories
    setSelectedServices([]);
  };

  const handleSelectAllServices = () => {
    const allServiceIds = availableServices.map(service => service.id);
    const isAllSelected = allServiceIds.every(id => selectedServices.includes(id));
    
    if (isAllSelected) {
      // Deselect all visible services
      setSelectedServices(prev => prev.filter(id => !allServiceIds.includes(id)));
    } else {
      // Select all visible services (add to existing selection)
      setSelectedServices(prev => [...new Set([...prev, ...allServiceIds])]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearSubCategorySearch = () => {
    setSubCategorySearchQuery('');
  };

  // Check if all items are selected for button text
  const allSubCategoriesSelected = currentParentCategory ? 
    currentParentCategory.childCategories.every(child => selectedSubCategories.includes(child.id)) : false;
  
  const allServicesSelected = availableServices.length > 0 ? 
    availableServices.every(service => selectedServices.includes(service.id)) : false;

  // This is handled by the ComparisonTable component now

  if (showComparison === 'comparison') {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>
        <div className="border-b border-border p-6 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-tight">Service Comparison</h1>
              <p className="text-muted-foreground mt-1">
                Comparing {selectedServiceData.length} services from {currentParentCategory?.name}
              </p>
            </div>
            <Button onClick={handleBackToSelection} variant="outline">
              Back to Selection
            </Button>
          </div>
        </div>

        <ComparisonTable
          services={selectedServiceData}
          onBackToSelection={handleBackToSelection}
          title="Service Comparison"
          description={`Comparing ${selectedServiceData.length} services from ${currentParentCategory?.name}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>
      <div className="border-b border-border p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-medium tracking-tight">Compare Services</h1>
          <p className="text-muted-foreground mt-1">
            Select a parent category, sub categories, and services to compare side by side
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Parent Category Selection */}
        <div>
          <h2 className="text-xl font-medium mb-4">Select Parent Category</h2>
          <div className="flex flex-wrap gap-3">
            {parentCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedParentCategory === category.id ? "default" : "outline"}
                onClick={() => handleParentCategoryChange(category.id)}
                className="h-auto p-4"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Sub Category Selection */}
        {currentParentCategory && (
          <div>
            <h2 className="text-xl font-medium mb-4">
              Select Sub Categories ({selectedSubCategories.length} selected)
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                onClick={handleSelectAllSubCategories}
                variant="outline"
                size="sm"
              >
                {allSubCategoriesSelected ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                onClick={handleCompareCategories}
                variant={selectedSubCategories.length === 0 ? "outline" : "default"}
                disabled={selectedSubCategories.length === 0}
              >
                {selectedSubCategories.length === 0 
                  ? "Please select categories" 
                  : `Compare ${selectedSubCategories.length} Categor${selectedSubCategories.length !== 1 ? 'ies' : 'y'}`
                }
              </Button>
            </div>
            
            {/* Sub Category Search Input */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sub categories..."
                  value={subCategorySearchQuery}
                  onChange={(e) => setSubCategorySearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {subCategorySearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSubCategorySearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {subCategorySearchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {currentParentCategory.childCategories.filter(cat => 
                    cat.name.toLowerCase().includes(subCategorySearchQuery.toLowerCase()) ||
                    cat.id.toLowerCase().includes(subCategorySearchQuery.toLowerCase())
                  ).length} sub categor{currentParentCategory.childCategories.filter(cat => 
                    cat.name.toLowerCase().includes(subCategorySearchQuery.toLowerCase()) ||
                    cat.id.toLowerCase().includes(subCategorySearchQuery.toLowerCase())
                  ).length !== 1 ? 'ies' : 'y'} matching &quot;{subCategorySearchQuery}&quot;
                  {currentParentCategory.childCategories.filter(cat => 
                    cat.name.toLowerCase().includes(subCategorySearchQuery.toLowerCase()) ||
                    cat.id.toLowerCase().includes(subCategorySearchQuery.toLowerCase())
                  ).length === 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleClearSubCategorySearch}
                      className="h-auto p-0 ml-2"
                    >
                      Clear search
                    </Button>
                  )}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {currentParentCategory.childCategories
                .filter(subCategory => {
                  if (!subCategorySearchQuery.trim()) return true;
                  const query = subCategorySearchQuery.toLowerCase();
                  return (
                    subCategory.name.toLowerCase().includes(query) ||
                    subCategory.id.toLowerCase().includes(query)
                  );
                })
                .map(subCategory => (
                <Button
                  key={subCategory.id}
                  variant={selectedSubCategories.includes(subCategory.id) ? "default" : "outline"}
                  onClick={() => toggleSubCategorySelection(subCategory.id)}
                  className="h-auto p-3"
                >
                  {subCategory.name}
                </Button>
              ))}
            </div>
            {selectedSubCategories.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No sub categories selected - showing all services from {currentParentCategory.name}
              </p>
            )}
          </div>
        )}

        {/* Services Grid */}
        {allAvailableServices.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-4">
              Select Services to Compare ({selectedServices.length} selected)
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                onClick={handleSelectAllServices}
                variant="outline"
                size="sm"
                disabled={availableServices.length === 0}
              >
                {allServicesSelected ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                onClick={handleCompare}
                disabled={selectedServices.length === 0}
                variant={selectedServices.length === 0 ? "outline" : "default"}
              >
                {selectedServices.length === 0 
                  ? "Please select a service" 
                  : `Compare ${selectedServices.length} Service${selectedServices.length !== 1 ? 's' : ''}`
                }
              </Button>
              <Button 
                onClick={handleCompareSimplified}
                variant={selectedServices.length === 0 ? "outline" : "default"}
                disabled={selectedServices.length === 0}
                className="flex items-center gap-2"
              >
                <TableIcon className="h-4 w-4" />
                {selectedServices.length === 0 
                  ? "Select a service" 
                  : "Compare Simplified"
                }
              </Button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search services by name, category, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {availableServices.length} service{availableServices.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
                  {availableServices.length === 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleClearSearch}
                      className="h-auto p-0 ml-2"
                    >
                      Clear search
                    </Button>
                  )}
                </p>
              )}
            </div>
            
            {availableServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availableServices.map(service => {
                const isSelected = selectedServices.includes(service.id);
                const childCategory = currentParentCategory?.childCategories.find(
                  cat => cat.id === service.childCategory
                );
                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:scale-105",
                      isSelected 
                        ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/25" 
                        : "grayscale hover:grayscale-0"
                    )}
                    onClick={() => toggleServiceSelection(service.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{service.logo}</div>
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {childCategory?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Object.keys(service.features).length} features
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-medium mb-2">No services found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or 
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-auto p-0 ml-1"
                  >
                    clear the search
                  </Button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}