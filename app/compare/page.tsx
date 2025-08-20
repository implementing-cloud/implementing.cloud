"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useRouter } from "next/navigation";
import { parentCategories, providerCategories, type FeatureValue } from "@/lib/comparison-data";
import { Input } from "@/components/ui/input";
import { Search, Check, ChevronsUpDown, Scale } from "lucide-react";
import { Suspense, useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

function isFeatureValue(value: unknown): value is FeatureValue {
  return typeof value === 'object' && value !== null && 'value' in value;
}

function getDisplayValue(featureValue: string | number | boolean | FeatureValue): string {
  if (isFeatureValue(featureValue)) {
    return String(featureValue.value);
  }
  return String(featureValue);
}

function ComparePageContent() {
  const router = useRouter();
  
  // Comparison type selection
  const [comparisonType, setComparisonType] = useQueryState(
    'type',
    parseAsString.withDefault('service')
  );
  
  // Service filtering states
  const [selectedCategory, setSelectedCategory] = useQueryState(
    'category',
    parseAsString.withDefault(parentCategories[0].name)
  );
  const [selectedSubcategories, setSelectedSubcategories] = useQueryState(
    'subcategories',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  
  // Provider search state
  const [providerSearchQuery, setProviderSearchQuery] = useQueryState(
    'providerSearch',
    parseAsString.withDefault('')
  );

  // Selection states
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  
  // UI states for popovers
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');

  // Get all services for filtering
  const allServices = useMemo(() => {
    return parentCategories.flatMap(parent => 
      parent.childCategories.flatMap(child => 
        child.services.map(service => ({
          ...service,
          category: parent.name,
          subcategory: child.name
        }))
      )
    );
  }, []);

  // Get all providers for filtering
  const allProviders = useMemo(() => {
    return providerCategories.flatMap(category => 
      category.providers.map(provider => ({
        ...provider,
        subcategory: category.name
      }))
    );
  }, []);

  // Filter services based on category, subcategory and search
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const matchesCategory = service.category === selectedCategory;
      const matchesSubcategory = selectedSubcategories.length === 0 || 
        selectedSubcategories.includes(service.subcategory);
      const matchesSearch = !searchQuery || 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.parentCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(service.features).some(feature => 
          String(feature).toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubcategories, searchQuery, allServices]);

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    return allProviders.filter((provider) => {
      const matchesSearch = !providerSearchQuery ||
        provider.name.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
        Object.values(provider.features).some(feature => 
          String(feature).toLowerCase().includes(providerSearchQuery.toLowerCase())
        );

      return matchesSearch;
    });
  }, [providerSearchQuery, allProviders]);

  // Get category data for filters
  const categoryData = useMemo(() => {
    const categories: Record<string, string[]> = {};
    parentCategories.forEach(parent => {
      categories[parent.name] = parent.childCategories.map(child => child.name);
    });
    return categories;
  }, []);

  const availableSubcategories = selectedCategory ? categoryData[selectedCategory] || [] : [];

  // Handler functions
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategories([]);
    setCategoryOpen(false);
    setCategorySearch('');
  };

  const handleSubcategoryToggle = (value: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };


  // Filter logic for popover searches
  const filteredCategories = Object.keys(categoryData).filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredSubcategories = availableSubcategories.filter((subcategory) =>
    subcategory.toLowerCase().includes(subcategorySearch.toLowerCase()),
  );

  // URL generation functions
  const generateComparisonUrl = (services: string[]) => {
    if (services.length === 0) return;
    const sortedServices = [...services].sort();
    const urlSlug = sortedServices.join('-vs-');
    return `/compare/service/${urlSlug}`;
  };

  const generateProviderComparisonUrl = (providers: string[]) => {
    if (providers.length === 0) return;
    const sortedProviders = [...providers].sort();
    const urlSlug = sortedProviders.join('-vs-');
    return `/compare/provider/${urlSlug}`;
  };

  // Selection handlers
  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleCompare = () => {
    if (comparisonType === 'service' && selectedServices.length >= 1) {
      const comparisonUrl = generateComparisonUrl(selectedServices);
      if (comparisonUrl) {
        router.push(comparisonUrl);
      }
    } else if (comparisonType === 'provider' && selectedProviders.length >= 1) {
      const comparisonUrl = generateProviderComparisonUrl(selectedProviders);
      if (comparisonUrl) {
        router.push(comparisonUrl);
      }
    }
  };

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
          <div className="flex items-center gap-3 mb-4">
            <Scale className="size-8 text-primary" />
            <div>
              <h1 className="text-3xl font-medium tracking-tight">Compare Services</h1>
              <p className="text-muted-foreground mt-1">
                Compare cloud computing services and providers side by side
              </p>
            </div>
          </div>
          
          {/* Comparison Type Toggle */}
          <div className="flex gap-3">
            <Button
              variant={comparisonType === 'service' ? "default" : "outline"}
              onClick={() => {
                setComparisonType('service');
                setSelectedProviders([]);
              }}
              size="sm"
            >
              Compare Services
            </Button>
            <Button
              variant={comparisonType === 'provider' ? "default" : "outline"}
              onClick={() => {
                setComparisonType('provider');
                setSelectedServices([]);
              }}
              size="sm"
            >
              Compare Providers
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Filters Section */}
        <div className="space-y-6">
          {comparisonType === 'service' ? (
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium">Category</label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between h-10"
                      >
                        {selectedCategory || "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                          {filteredCategories.map((category) => (
                            <Card
                              key={category}
                              className={cn(
                                "cursor-pointer hover:shadow-md transition-all border-2",
                                selectedCategory === category
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50",
                              )}
                              onClick={() => handleCategoryChange(category)}
                            >
                              <CardContent className="p-3 text-center">
                                <div className="font-medium text-sm">{category}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium">Subcategory</label>
                  <Popover open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={subcategoryOpen}
                        className="w-full justify-between h-10"
                        disabled={!selectedCategory}
                      >
                        <div className="flex flex-wrap gap-1 flex-1 justify-start">
                          {selectedSubcategories.length === 0 ? (
                            <span className="text-muted-foreground">Select All</span>
                          ) : (
                            <span className="text-sm">{selectedSubcategories.length} selected</span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search subcategories..."
                            value={subcategorySearch}
                            onChange={(e) => setSubcategorySearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                          {filteredSubcategories.map((subcategory) => (
                            <Card
                              key={subcategory}
                              className={cn(
                                "cursor-pointer hover:shadow-md transition-all border-2",
                                selectedSubcategories.includes(subcategory)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50",
                              )}
                              onClick={() => handleSubcategoryToggle(subcategory)}
                            >
                              <CardContent className="p-3 text-center relative">
                                <div className="font-medium text-sm">{subcategory}</div>
                                {selectedSubcategories.includes(subcategory) && (
                                  <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        {selectedSubcategories.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubcategories([])}
                            className="w-full"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 min-w-[250px]">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Compare Buttons for Services */}
              {selectedServices.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                  <Button 
                    onClick={handleCompare}
                    className="bg-primary hover:bg-primary/90 h-10"
                  >
                    Compare {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''}
                  </Button>
                  <Button 
                    onClick={() => {
                      const comparisonUrl = generateComparisonUrl(selectedServices);
                      if (comparisonUrl) {
                        router.push(`/compare/simplified${comparisonUrl.replace('/compare', '')}`);
                      }
                    }}
                    variant="outline"
                    className="h-10"
                  >
                    Simplified View
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              <div className="space-y-2 min-w-[300px] flex-1">
                <label className="text-sm font-medium">Search Providers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search providers..."
                    value={providerSearchQuery}
                    onChange={(e) => setProviderSearchQuery(e.target.value)}
                    className="pl-10 w-full h-10"
                  />
                </div>
              </div>

              {/* Compare Button for Providers */}
              {selectedProviders.length > 0 && (
                <div className="lg:flex-shrink-0">
                  <Button 
                    onClick={handleCompare}
                    className="bg-primary hover:bg-primary/90 h-10"
                  >
                    Compare {selectedProviders.length} Provider{selectedProviders.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section with Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {comparisonType === 'service' ? (
                <>
                  Showing all {selectedCategory || "categories"} category
                  {selectedSubcategories.length > 0 && ` in ${selectedSubcategories.join(", ")} subcategory`}
                  {searchQuery && ` matching "${searchQuery}"`} ({filteredServices.length} services)
                </>
              ) : (
                <>
                  Showing all providers
                  {providerSearchQuery && ` matching "${providerSearchQuery}"`} ({filteredProviders.length} providers)
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {comparisonType === 'service' ? (
              filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <Card 
                    key={service.id} 
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all h-full",
                      isSelected && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => toggleServiceSelection(service.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">{service.logo}</div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {Object.keys(service.features).length} features available
                          </p>
                          <div className="pt-2 border-t space-y-2">
                            <div className="text-sm font-semibold text-primary">
                              {getDisplayValue(service.features['Starting Price'] || 'Pricing varies')}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {service.subcategory}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              filteredProviders.map((provider) => {
                const isSelected = selectedProviders.includes(provider.id);
                return (
                  <Card 
                    key={provider.id} 
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all h-full",
                      isSelected && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => toggleProviderSelection(provider.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">{provider.logo}</div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg truncate">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.category}</p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {provider.features['Global Regions']} regions • {provider.features['Market Share']} market share
                          </p>
                          <div className="pt-2 border-t space-y-2">
                            <div className="text-sm font-semibold text-primary">
                              {provider.features['Revenue (2023)'] ? `Revenue: ${provider.features['Revenue (2023)']}` : 'Private company'}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {provider.subcategory}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {((comparisonType === 'service' && filteredServices.length === 0) || (comparisonType === 'provider' && filteredProviders.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No {comparisonType === 'service' ? 'services' : 'providers'} found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}