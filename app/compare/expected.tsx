"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function CloudServiceSelector() {
  const [selectedCategory, setSelectedCategory] = useState("Compute")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [subcategorySearch, setSubcategorySearch] = useState("")

  const categories = {
    Compute: ["VM", "CaaS", "FaaS"],
    Storage: ["Object Storage", "Block Storage", "File Storage"],
    Database: ["SQL", "NoSQL", "Cache"],
    Networking: ["CDN", "Load Balancer", "VPN"],
    "AI/ML": ["Machine Learning", "Computer Vision", "NLP"],
  }

  const services = [
    {
      id: "ec2",
      name: "Amazon EC2",
      category: "Compute",
      subcategory: "VM",
      provider: "AWS",
      description: "Scalable virtual servers in the cloud",
      pricing: "From $0.0116/hour",
      image: "/aws-ec2-server-icon.png",
    },
    {
      id: "lambda",
      name: "AWS Lambda",
      category: "Compute",
      subcategory: "FaaS",
      provider: "AWS",
      description: "Run code without managing servers",
      pricing: "Pay per request",
      image: "/aws-lambda-icon.png",
    },
    {
      id: "ecs",
      name: "Amazon ECS",
      category: "Compute",
      subcategory: "CaaS",
      provider: "AWS",
      description: "Container orchestration service",
      pricing: "From $0.04/hour",
      image: "/aws-ecs-container-icon.png",
    },
    {
      id: "gce",
      name: "Google Compute Engine",
      category: "Compute",
      subcategory: "VM",
      provider: "Google Cloud",
      description: "High-performance virtual machines",
      pricing: "From $0.0104/hour",
      image: "/google-cloud-compute-engine-icon.png",
    },
    {
      id: "cloud-functions",
      name: "Cloud Functions",
      category: "Compute",
      subcategory: "FaaS",
      provider: "Google Cloud",
      description: "Event-driven serverless functions",
      pricing: "Pay per invocation",
      image: "/google-cloud-functions-icon.png",
    },
    {
      id: "cloud-run",
      name: "Cloud Run",
      category: "Compute",
      subcategory: "CaaS",
      provider: "Google Cloud",
      description: "Fully managed containerized applications",
      pricing: "Pay per use",
      image: "/google-cloud-run-container-icon.png",
    },
    {
      id: "azure-vm",
      name: "Azure Virtual Machines",
      category: "Compute",
      subcategory: "VM",
      provider: "Microsoft Azure",
      description: "On-demand scalable computing resources",
      pricing: "From $0.012/hour",
      image: "/microsoft-azure-vm-icon.png",
    },
    {
      id: "azure-functions",
      name: "Azure Functions",
      category: "Compute",
      subcategory: "FaaS",
      provider: "Microsoft Azure",
      description: "Event-driven serverless compute",
      pricing: "Consumption-based",
      image: "/microsoft-azure-functions-icon.png",
    },
  ]

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = !selectedCategory || service.category === selectedCategory
      const matchesSubcategory =
        selectedSubcategories.length === 0 || selectedSubcategories.includes(service.subcategory)
      const matchesSearch =
        !searchQuery ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSubcategory && matchesSearch
    })
  }, [selectedCategory, selectedSubcategories, searchQuery])

  const availableSubcategories = selectedCategory ? categories[selectedCategory as keyof typeof categories] || [] : []

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategories([])
    setCategoryOpen(false)
    setCategorySearch("")
  }

  const handleSubcategoryToggle = (value: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const removeSubcategory = (value: string) => {
    setSelectedSubcategories((prev) => prev.filter((item) => item !== value))
  }

  const filteredCategories = Object.keys(categories).filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  const filteredSubcategories = availableSubcategories.filter((subcategory) =>
    subcategory.toLowerCase().includes(subcategorySearch.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-screen-2xl mx-auto space-y-8">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold">Cloud Service Selector</h1>
          <p className="text-muted-foreground text-lg">
            Browse and filter cloud computing services by category and subcategory
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-8">
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="w-full justify-between bg-transparent"
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
                              <div className="text-xs text-muted-foreground mt-1">
                                {categories[category as keyof typeof categories].length} types
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategory</label>
                <Popover open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={subcategoryOpen}
                      className="w-full justify-between bg-transparent min-h-10"
                      disabled={!selectedCategory}
                    >
                      <div className="flex flex-wrap gap-1 flex-1">
                        {selectedSubcategories.length === 0 ? (
                          <span className="text-muted-foreground">Select All</span>
                        ) : (
                          selectedSubcategories.map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                              <X
                                className="ml-1 h-3 w-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeSubcategory(sub)
                                }}
                              />
                            </Badge>
                          ))
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="text-sm font-medium text-muted-foreground border-t pt-4">
              Showing all {selectedCategory || "categories"} category
              {selectedSubcategories.length > 0 && ` in ${selectedSubcategories.join(", ")} subcategory`}
              {searchQuery && ` matching "${searchQuery}"`} ({filteredServices.length} services)
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.provider}</p>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>

                        <div className="pt-2 border-t space-y-2">
                          <div className="text-sm font-semibold text-primary">{service.pricing}</div>
                          <Badge variant="secondary" className="text-xs">
                            {service.subcategory}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No services found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
