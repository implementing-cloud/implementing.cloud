import { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  getServicesByIds,
  Service
} from "@/lib/comparison-data";
import { 
  getCategoriesByIds,
  getParentCategoryName,
  CategoryComparisonData
} from "@/lib/category-comparison-data";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, TableIcon } from "lucide-react";
import Link from "next/link";

interface SimplifiedPageProps {
  params: Promise<{
    params: string[];
  }>;
}

// Parse URL parameters to determine comparison type
function parseComparisonParams(params: string[]) {
  if (params.length < 2) {
    return { 
      type: "invalid" as const, 
      services: [], 
      categoryData: [], 
      parentCategory: null 
    };
  }

  const [type, ...rest] = params;

  if (type === "service") {
    // Format: /compare/service/aws_ec2-vs-azure_vm-vs-gcp_compute
    const serviceSlug = rest.join("/");
    const serviceIds = serviceSlug.split("-vs-");
    const services = getServicesByIds(serviceIds);
    
    if (services.length === 0) {
      return { 
        type: "invalid" as const, 
        services: [], 
        categoryData: [], 
        parentCategory: null 
      };
    }

    return { 
      type: "service" as const, 
      services, 
      categoryData: [],
      parentCategory: services[0]?.parentCategory || null 
    };
  }

  if (type === "category") {
    // Format: /compare/category/compute/virtual-machines-vs-serverless-functions-vs-kubernetes
    if (rest.length < 2) {
      return { 
        type: "invalid" as const, 
        services: [], 
        categoryData: [], 
        parentCategory: null 
      };
    }

    const [parentCategoryId, categorySlug] = rest;
    const childCategoryIds = categorySlug.split("-vs-");
    
    // Get category comparison data (conceptual comparison)
    const categoryData = getCategoriesByIds(childCategoryIds);
    
    if (categoryData.length === 0) {
      return { 
        type: "invalid" as const, 
        services: [], 
        categoryData: [], 
        parentCategory: null 
      };
    }

    return { 
      type: "category" as const, 
      services: [],
      categoryData,
      parentCategory: parentCategoryId 
    };
  }

  return { 
    type: "invalid" as const, 
    services: [], 
    categoryData: [], 
    parentCategory: null 
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: SimplifiedPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { type, services, categoryData, parentCategory } = parseComparisonParams(resolvedParams.params);

  if (type === "invalid" || (services.length === 0 && categoryData.length === 0)) {
    return {
      title: "Simplified Comparison Not Found",
      description: "The requested simplified comparison could not be found.",
    };
  }

  let title: string;
  let description: string;

  if (type === "service") {
    const serviceNames = services.map(s => s.name);
    
    if (services.length === 1) {
      title = `Deep Dive to ${serviceNames[0]} - Simplified`;
      description = `Simplified view of ${serviceNames[0]} with key pricing and notes.`;
    } else if (services.length <= 3) {
      title = `${serviceNames.join(" vs ")} Simplified Comparison`;
      description = `Simplified comparison of ${serviceNames.join(", ")} with key pricing and notes.`;
    } else {
      title = `${serviceNames[0]} vs ${services.length - 1} other services - Simplified`;
      description = `Simplified comparison of ${serviceNames[0]} and ${services.length - 1} other services with key pricing and notes.`;
    }
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    
    if (categoryData.length === 1) {
      title = `Deep Dive to ${categoryNames[0]} - ${parentName} Simplified`;
      description = `Simplified view of ${categoryNames[0]} concepts with key points and notes.`;
    } else if (categoryData.length <= 3) {
      title = `${categoryNames.join(" vs ")} Simplified Comparison - ${parentName}`;
      description = `Simplified comparison of ${categoryNames.join(", ")} concepts with key points and notes.`;
    } else {
      title = `${categoryNames[0]} vs ${categoryData.length - 1} other ${parentName.toLowerCase()} concepts - Simplified`;
      description = `Simplified comparison of ${categoryNames[0]} and ${categoryData.length - 1} other ${parentName.toLowerCase()} concepts with key points and notes.`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

// Simplified Table Component for Services
function SimplifiedServiceTable({ services }: { services: Service[] }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Service</th>
              <th className="text-left p-4 font-medium">Pricing</th>
              <th className="text-left p-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{service.logo}</div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    Contact for pricing
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-muted-foreground max-w-md">
                    No additional notes available
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simplified Table Component for Categories
function SimplifiedCategoryTable({ categories }: { categories: CategoryComparisonData[] }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Concept</th>
              <th className="text-left p-4 font-medium">Key Characteristics</th>
              <th className="text-left p-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div className="font-medium">{category.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {category.shortDescription || "Contact for details"}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-muted-foreground max-w-md">
                    No additional notes available
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function SimplifiedComparePage({ params }: SimplifiedPageProps) {
  const resolvedParams = await params;
  const { type, services, categoryData, parentCategory } = parseComparisonParams(resolvedParams.params);

  if (type === "invalid" || (services.length === 0 && categoryData.length === 0)) {
    notFound();
  }

  let title: string;
  let description: string;

  if (type === "service") {
    const serviceNames = services.map(s => s.name);
    
    if (services.length === 1) {
      title = `Deep Dive to ${serviceNames[0]} - Simplified`;
      description = `Simplified overview of ${serviceNames[0]}`;
    } else if (services.length <= 3) {
      title = `${serviceNames.join(" vs ")} Simplified Comparison`;
      if (services.length === 2) {
        description = `Simplified comparison of ${serviceNames[0]} with ${serviceNames[1]}`;
      } else {
        description = `Simplified comparison of ${serviceNames[0]} with ${serviceNames[1]}, and ${serviceNames[2]}`;
      }
    } else {
      title = `${serviceNames[0]} vs ${services.length - 1} other services - Simplified`;
      const otherServices = serviceNames.slice(1);
      const lastService = otherServices.pop();
      description = `Simplified comparison of ${serviceNames[0]} with ${otherServices.join(", ")}${otherServices.length > 0 ? ', and ' : ''}${lastService}`;
    }
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    
    if (categoryData.length === 1) {
      title = `Deep Dive to ${categoryNames[0]} - ${parentName} Simplified`;
      description = `Simplified overview of ${categoryNames[0]} concepts`;
    } else if (categoryData.length <= 3) {
      title = `${categoryNames.join(" vs ")} Simplified Comparison`;
      if (categoryData.length === 2) {
        description = `Simplified comparison of ${categoryNames[0]} with ${categoryNames[1]} concepts`;
      } else {
        description = `Simplified comparison of ${categoryNames[0]} with ${categoryNames[1]}, and ${categoryNames[2]} concepts`;
      }
    } else {
      title = `${categoryNames[0]} vs ${categoryData.length - 1} other ${parentName.toLowerCase()} concepts - Simplified`;
      const otherCategories = categoryNames.slice(1);
      const lastCategory = otherCategories.pop();
      description = `Simplified comparison of ${categoryNames[0]} with ${otherCategories.join(", ")}${otherCategories.length > 0 ? ', and ' : ''}${lastCategory}`;
    }
  }

  // Get the base path for navigation
  const basePath = `/compare/${resolvedParams.params.join("/")}`;

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
          <div className="mb-4 flex items-center gap-3">
            <Link href="/compare">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Compare
              </Button>
            </Link>
            <Link href={basePath}>
              <Button variant="outline" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Detailed view
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </div>

      {type === "service" ? (
        <SimplifiedServiceTable services={services} />
      ) : (
        <SimplifiedCategoryTable categories={categoryData} />
      )}
    </div>
  );
}