"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

// Sample data structure
interface Service {
  id: string;
  name: string;
  logo: string;
  parentCategory: string;
  childCategory: string;
  features: Record<string, string | number | boolean>;
}

interface ChildCategory {
  id: string;
  name: string;
  services: Service[];
}

interface ParentCategory {
  id: string;
  name: string;
  childCategories: ChildCategory[];
}

// Sample data with parent/child structure
const parentCategories: ParentCategory[] = [
  {
    id: "compute",
    name: "Compute",
    childCategories: [
      {
        id: "virtual-machines",
        name: "Virtual Machines",
        services: [
          {
            id: "aws-ec2",
            name: "AWS EC2",
            logo: "🔶",
            parentCategory: "compute",
            childCategory: "virtual-machines",
            features: {
              "Starting Price": "$0.0058/hour",
              "CPU Options": "1-128 vCPUs",
              "Memory": "0.5GB - 24TB",
              "Storage": "EBS, Instance Store",
              "Network Performance": "Up to 100 Gbps",
              "Free Tier": true,
              "Global Regions": 31,
              "Auto Scaling": true,
              "Load Balancer": true,
              "Container Support": true
            }
          },
          {
            id: "azure-vm",
            name: "Azure VM",
            logo: "🔵",
            parentCategory: "compute",
            childCategory: "virtual-machines",
            features: {
              "Starting Price": "$0.0048/hour",
              "CPU Options": "1-128 vCPUs",
              "Memory": "0.75GB - 12TB",
              "Storage": "Managed Disks, Blob Storage",
              "Network Performance": "Up to 80 Gbps",
              "Free Tier": true,
              "Global Regions": 60,
              "Auto Scaling": true,
              "Load Balancer": true,
              "Container Support": true
            }
          },
          {
            id: "gcp-compute",
            name: "Google Compute Engine",
            logo: "🟡",
            parentCategory: "compute",
            childCategory: "virtual-machines",
            features: {
              "Starting Price": "$0.0056/hour",
              "CPU Options": "1-96 vCPUs",
              "Memory": "0.6GB - 6.5TB",
              "Storage": "Persistent Disks, Local SSD",
              "Network Performance": "Up to 100 Gbps",
              "Free Tier": true,
              "Global Regions": 37,
              "Auto Scaling": true,
              "Load Balancer": true,
              "Container Support": true
            }
          },
          {
            id: "digitalocean-droplets",
            name: "DigitalOcean Droplets",
            logo: "🔷",
            parentCategory: "compute",
            childCategory: "virtual-machines",
            features: {
              "Starting Price": "$0.0074/hour",
              "CPU Options": "1-32 vCPUs",
              "Memory": "1GB - 192GB",
              "Storage": "SSD, Block Storage",
              "Network Performance": "Up to 10 Gbps",
              "Free Tier": false,
              "Global Regions": 15,
              "Auto Scaling": true,
              "Load Balancer": true,
              "Container Support": true
            }
          }
        ]
      },
      {
        id: "serverless-functions",
        name: "Function as a Service",
        services: [
          {
            id: "aws-lambda",
            name: "AWS Lambda",
            logo: "🔶",
            parentCategory: "compute",
            childCategory: "serverless-functions",
            features: {
              "Starting Price": "$0.0000002/request",
              "Runtime Support": "Node.js, Python, Java, C#, Go, Ruby",
              "Memory": "128MB - 10GB",
              "Timeout": "15 minutes",
              "Concurrent Executions": "1000 (default)",
              "Free Tier": "1M requests/month",
              "Cold Start": "Yes",
              "VPC Support": true,
              "Event Sources": "200+",
              "Monitoring": "CloudWatch"
            }
          },
          {
            id: "azure-functions",
            name: "Azure Functions",
            logo: "🔵",
            parentCategory: "compute",
            childCategory: "serverless-functions",
            features: {
              "Starting Price": "$0.0000002/request",
              "Runtime Support": "C#, Java, JavaScript, Python, PowerShell",
              "Memory": "128MB - 1.5GB",
              "Timeout": "10 minutes",
              "Concurrent Executions": "200 (default)",
              "Free Tier": "1M requests/month",
              "Cold Start": "Yes",
              "VPC Support": true,
              "Event Sources": "50+",
              "Monitoring": "Azure Monitor"
            }
          }
        ]
      },
      {
        id: "container-services",
        name: "Container as a Service",
        services: [
          {
            id: "aws-ecs",
            name: "AWS ECS",
            logo: "🔶",
            parentCategory: "compute",
            childCategory: "container-services",
            features: {
              "Starting Price": "$0.0464/vCPU/hour",
              "Container Runtime": "Docker",
              "Launch Types": "EC2, Fargate",
              "Auto Scaling": true,
              "Load Balancer": true,
              "Service Discovery": true,
              "Free Tier": false,
              "Monitoring": "CloudWatch",
              "Security": "IAM, VPC",
              "CI/CD Integration": true
            }
          },
          {
            id: "azure-container-instances",
            name: "Azure Container Instances",
            logo: "🔵",
            parentCategory: "compute",
            childCategory: "container-services",
            features: {
              "Starting Price": "$0.0014/vCPU/hour",
              "Container Runtime": "Docker",
              "Launch Types": "Serverless",
              "Auto Scaling": false,
              "Load Balancer": false,
              "Service Discovery": false,
              "Free Tier": false,
              "Monitoring": "Azure Monitor",
              "Security": "Azure AD, VNet",
              "CI/CD Integration": true
            }
          }
        ]
      },
      {
        id: "kubernetes",
        name: "Managed Kubernetes",
        services: [
          {
            id: "aws-eks",
            name: "AWS EKS",
            logo: "🔶",
            parentCategory: "compute",
            childCategory: "kubernetes",
            features: {
              "Starting Price": "$0.10/cluster/hour",
              "Kubernetes Version": "1.24+",
              "Node Types": "EC2, Fargate",
              "Auto Scaling": true,
              "Load Balancer": true,
              "Service Mesh": "App Mesh",
              "Free Tier": false,
              "Monitoring": "CloudWatch Container Insights",
              "Security": "IAM, RBAC",
              "Add-ons": "20+"
            }
          },
          {
            id: "gke",
            name: "Google GKE",
            logo: "🟡",
            parentCategory: "compute",
            childCategory: "kubernetes",
            features: {
              "Starting Price": "$0.10/cluster/hour",
              "Kubernetes Version": "1.24+",
              "Node Types": "GCE, Autopilot",
              "Auto Scaling": true,
              "Load Balancer": true,
              "Service Mesh": "Istio",
              "Free Tier": false,
              "Monitoring": "Cloud Monitoring",
              "Security": "IAM, RBAC",
              "Add-ons": "15+"
            }
          }
        ]
      }
    ]
  },
  {
    id: "storage",
    name: "Storage",
    childCategories: [
      {
        id: "object-storage",
        name: "Object Storage",
        services: [
          {
            id: "aws-s3",
            name: "AWS S3",
            logo: "🔶",
            parentCategory: "storage",
            childCategory: "object-storage",
            features: {
              "Starting Price": "$0.023/GB/month",
              "Storage Classes": "6",
              "Max Object Size": "5TB",
              "Availability": "99.999999999%",
              "Versioning": true,
              "Encryption": true,
              "Free Tier": "5GB",
              "CDN Integration": "CloudFront",
              "Access Control": "IAM, ACL, Bucket Policies",
              "Event Notifications": true
            }
          },
          {
            id: "azure-blob",
            name: "Azure Blob Storage",
            logo: "🔵",
            parentCategory: "storage",
            childCategory: "object-storage",
            features: {
              "Starting Price": "$0.0184/GB/month",
              "Storage Classes": "4",
              "Max Object Size": "4.75TB",
              "Availability": "99.9%",
              "Versioning": true,
              "Encryption": true,
              "Free Tier": "5GB",
              "CDN Integration": "Azure CDN",
              "Access Control": "Azure AD, RBAC",
              "Event Notifications": true
            }
          }
        ]
      },
      {
        id: "managed-databases",
        name: "Managed Databases",
        services: [
          {
            id: "aws-rds",
            name: "AWS RDS",
            logo: "🔶",
            parentCategory: "storage",
            childCategory: "managed-databases",
            features: {
              "Starting Price": "$0.017/hour",
              "Database Engines": "MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
              "Max Storage": "64TB",
              "Backup Retention": "35 days",
              "Multi-AZ": true,
              "Read Replicas": 15,
              "Auto Scaling": true,
              "Encryption": true,
              "Point-in-time Recovery": true,
              "Monitoring": "CloudWatch"
            }
          },
          {
            id: "azure-sql",
            name: "Azure SQL Database",
            logo: "🔵",
            parentCategory: "storage",
            childCategory: "managed-databases",
            features: {
              "Starting Price": "$0.0115/hour",
              "Database Engines": "SQL Server, MySQL, PostgreSQL",
              "Max Storage": "100TB",
              "Backup Retention": "35 days",
              "Multi-AZ": true,
              "Read Replicas": 5,
              "Auto Scaling": true,
              "Encryption": true,
              "Point-in-time Recovery": true,
              "Monitoring": "Azure Monitor"
            }
          }
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    childCategories: [
      {
        id: "llm-apis",
        name: "LLM APIs",
        services: [
          {
            id: "openai-gpt",
            name: "OpenAI GPT",
            logo: "🤖",
            parentCategory: "ai-ml",
            childCategory: "llm-apis",
            features: {
              "Starting Price": "$0.0015/1K tokens",
              "Models": "GPT-3.5, GPT-4, GPT-4 Turbo",
              "Context Length": "4K-128K tokens",
              "Function Calling": true,
              "Fine-tuning": true,
              "Rate Limit": "10,000 RPM",
              "Streaming": true,
              "Vision Support": true,
              "Code Generation": true,
              "Moderation": true
            }
          },
          {
            id: "anthropic-claude",
            name: "Anthropic Claude",
            logo: "🧠",
            parentCategory: "ai-ml",
            childCategory: "llm-apis",
            features: {
              "Starting Price": "$0.0015/1K tokens",
              "Models": "Claude 3 Haiku, Sonnet, Opus",
              "Context Length": "200K tokens",
              "Function Calling": true,
              "Fine-tuning": false,
              "Rate Limit": "5,000 RPM",
              "Streaming": true,
              "Vision Support": true,
              "Code Generation": true,
              "Moderation": true
            }
          },
          {
            id: "google-gemini",
            name: "Google Gemini",
            logo: "💎",
            parentCategory: "ai-ml",
            childCategory: "llm-apis",
            features: {
              "Starting Price": "$0.0005/1K tokens",
              "Models": "Gemini Pro, Gemini Ultra",
              "Context Length": "32K-1M tokens",
              "Function Calling": true,
              "Fine-tuning": true,
              "Rate Limit": "60 RPM",
              "Streaming": true,
              "Vision Support": true,
              "Code Generation": true,
              "Moderation": true
            }
          }
        ]
      }
    ]
  }
];

export default function ComparePage() {
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>(parentCategories[0].id);
  const [selectedChildCategories, setSelectedChildCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const currentParentCategory = parentCategories.find(cat => cat.id === selectedParentCategory);
  
  // Get all services from selected child categories
  const availableServices = currentParentCategory?.childCategories
    .filter(child => selectedChildCategories.length === 0 || selectedChildCategories.includes(child.id))
    .flatMap(child => child.services) || [];

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

  const handleCompare = () => {
    if (selectedServices.length >= 1) {
      setShowComparison(true);
    }
  };

  const handleBackToSelection = () => {
    setShowComparison(false);
  };

  const handleParentCategoryChange = (parentCategoryId: string) => {
    setSelectedParentCategory(parentCategoryId);
    setSelectedChildCategories([]);
    setSelectedServices([]);
  };

  // Get all unique features for comparison table
  const allFeatures = selectedServiceData.reduce((acc, service) => {
    Object.keys(service.features).forEach(feature => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  if (showComparison) {
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

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium sticky left-0 bg-muted/50 min-w-[200px]">
                      Features
                    </th>
                    {selectedServiceData.map(service => (
                      <th key={service.id} className="text-center p-4 font-medium min-w-[200px]">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">{service.logo}</span>
                          <span className="text-sm">{service.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, index) => (
                    <tr key={feature} className={cn(
                      "border-b",
                      index % 2 === 0 ? "bg-background" : "bg-muted/25"
                    )}>
                      <td className="p-4 font-medium sticky left-0 bg-inherit">
                        {feature}
                      </td>
                      {selectedServiceData.map(service => (
                        <td key={service.id} className="p-4 text-center">
                          <span className="text-sm">
                            {service.features[feature] !== undefined 
                              ? String(service.features[feature]) 
                              : "N/A"
                            }
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
            <h2 className="text-xl font-medium mb-4">
              Select Child Categories ({selectedChildCategories.length} selected)
            </h2>
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
        {availableServices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">
                Select Services to Compare ({selectedServices.length} selected)
              </h2>
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
          </div>
        )}
      </div>
    </div>
  );
}