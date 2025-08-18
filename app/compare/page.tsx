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
import { Search, X } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  
  // Use nuqs for query state management
  const [selectedParentCategory, setSelectedParentCategory] = useQueryState(
    'parent', 
    parseAsString.withDefault(parentCategories[0].id)
  );
  const [selectedChildCategories, setSelectedChildCategories] = useQueryState(
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

  const currentParentCategory = parentCategories.find(cat => cat.id === selectedParentCategory);
  
  // Get all services from selected child categories
  const allAvailableServices = currentParentCategory?.childCategories
    .filter(child => selectedChildCategories.length === 0 || selectedChildCategories.includes(child.id))
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

  const toggleChildCategorySelection = (childCategoryId: string) => {
    setSelectedChildCategories(prev => 
      prev.includes(childCategoryId) 
        ? prev.filter(id => id !== childCategoryId)
        : [...prev, childCategoryId]
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
  const generateCategoryComparisonUrl = (parentCat: string, childCats: string[]) => {
    if (childCats.length === 0) return;
    
    const sortedCategories = [...childCats].sort();
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
    if (selectedChildCategories.length >= 1) {
      const categoryUrl = generateCategoryComparisonUrl(selectedParentCategory, selectedChildCategories);
      if (categoryUrl) {
        router.push(categoryUrl);
      }
    }
  };

  const handleBackToSelection = () => {
    setShowComparison('selection');
  };

  const handleParentCategoryChange = (parentCategoryId: string) => {
    setSelectedParentCategory(parentCategoryId);
    setSelectedChildCategories([]);
    setSelectedServices([]);
  };

  // Select All functionality
  const handleSelectAllChildCategories = () => {
    if (!currentParentCategory) return;
    
    const allChildIds = currentParentCategory.childCategories.map(child => child.id);
    const isAllSelected = allChildIds.every(id => selectedChildCategories.includes(id));
    
    if (isAllSelected) {
      // Deselect all
      setSelectedChildCategories([]);
    } else {
      // Select all
      setSelectedChildCategories(allChildIds);
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

  // Check if all items are selected for button text
  const allChildCategoriesSelected = currentParentCategory ? 
    currentParentCategory.childCategories.every(child => selectedChildCategories.includes(child.id)) : false;
  
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
            Select a parent category, child categories, and services to compare side by side
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

        {/* Child Category Selection */}
        {currentParentCategory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">
                Select Child Categories ({selectedChildCategories.length} selected)
              </h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSelectAllChildCategories}
                  variant="outline"
                  size="sm"
                >
                  {allChildCategoriesSelected ? "Deselect All" : "Select All"}
                </Button>
                <Button 
                  onClick={handleCompareCategories}
                  variant="secondary"
                  disabled={selectedChildCategories.length === 0}
                >
                  {selectedChildCategories.length === 0 
                    ? "Please select categories" 
                    : `Compare ${selectedChildCategories.length} Categor${selectedChildCategories.length !== 1 ? 'ies' : 'y'}`
                  }
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {currentParentCategory.childCategories.map(childCategory => (
                <Button
                  key={childCategory.id}
                  variant={selectedChildCategories.includes(childCategory.id) ? "default" : "outline"}
                  onClick={() => toggleChildCategorySelection(childCategory.id)}
                  className="h-auto p-3"
                >
                  {childCategory.name}
                </Button>
              ))}
            </div>
            {selectedChildCategories.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No child categories selected - showing all services from {currentParentCategory.name}
              </p>
            )}
          </div>
        )}

        {/* Services Grid */}
        {allAvailableServices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">
                Select Services to Compare ({selectedServices.length} selected)
              </h2>
              <div className="flex gap-2">
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
              </div>
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