import { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  getServicesByIds,
  getProvidersByIds
} from "@/lib/comparison-data";
import { 
  getCategoriesByIds,
  getParentCategoryName
} from "@/lib/category-comparison-data";
import { ComparisonTable } from "@/components/comparison-table";
import { CategoryComparisonTable } from "@/components/category-comparison-table";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, TableIcon } from "lucide-react";
import Link from "next/link";

interface ComparePageProps {
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

  if (type === "provider") {
    // Format: /compare/provider/aws-vs-azure-vs-gcp
    const providerSlug = rest.join("/");
    const providerIds = providerSlug.split("-vs-");
    const providers = getProvidersByIds(providerIds);
    
    if (providers.length === 0) {
      return { 
        type: "invalid" as const, 
        services: [], 
        categoryData: [], 
        parentCategory: null 
      };
    }

    // Convert providers to service format for consistency
    const providersAsServices = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      logo: provider.logo,
      parentCategory: provider.category,
      childCategory: provider.category,
      features: provider.features
    }));

    return { 
      type: "provider" as const, 
      services: providersAsServices, 
      categoryData: [],
      parentCategory: providers[0]?.category || null 
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
export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { type, services, categoryData, parentCategory } = parseComparisonParams(resolvedParams.params);

  if (type === "invalid" || (services.length === 0 && categoryData.length === 0)) {
    return {
      title: "Comparison Not Found",
      description: "The requested comparison could not be found.",
    };
  }

  let title: string;
  let description: string;

  if (type === "service") {
    const serviceNames = services.map(s => s.name);
    
    if (services.length === 1) {
      title = `Deep Dive to ${serviceNames[0]}`;
      description = `In this deep dive, we'll explore ${serviceNames[0]} in detail. Discover its features, pricing, and capabilities to see if it's suitable for you.`;
    } else if (services.length <= 3) {
      title = `${serviceNames.join(" vs ")} Comparison`;
      if (services.length === 2) {
        description = `In this comparison, we will compare ${serviceNames[0]} with ${serviceNames[1]}. Let's see what is the most suitable for you.`;
      } else {
        description = `In this comparison, we will compare ${serviceNames[0]} with ${serviceNames[1]}, and ${serviceNames[2]}. Let's see what is the most suitable for you.`;
      }
    } else {
      title = `${serviceNames[0]} vs ${services.length - 1} other services compared`;
      const otherServices = serviceNames.slice(1);
      const lastService = otherServices.pop();
      description = `In this opportunity, we will compare ${serviceNames[0]} with ${otherServices.join(", ")}${otherServices.length > 0 ? ', and ' : ''}${lastService}. Let's see what is the most suitable for you.`;
    }
  } else if (type === "provider") {
    const providerNames = services.map(s => s.name);
    
    if (services.length === 1) {
      title = `Deep Dive to ${providerNames[0]}`;
      description = `In this deep dive, we'll explore ${providerNames[0]} in detail. Discover its features, pricing, and capabilities to see if it's suitable for you.`;
    } else if (services.length <= 3) {
      title = `${providerNames.join(" vs ")} Provider Comparison`;
      if (services.length === 2) {
        description = `In this comparison, we will compare ${providerNames[0]} with ${providerNames[1]}. Let's see which cloud provider is the most suitable for you.`;
      } else {
        description = `In this comparison, we will compare ${providerNames[0]} with ${providerNames[1]}, and ${providerNames[2]}. Let's see which cloud provider is the most suitable for you.`;
      }
    } else {
      title = `${providerNames[0]} vs ${services.length - 1} other providers compared`;
      const otherProviders = providerNames.slice(1);
      const lastProvider = otherProviders.pop();
      description = `In this opportunity, we will compare ${providerNames[0]} with ${otherProviders.join(", ")}${otherProviders.length > 0 ? ', and ' : ''}${lastProvider}. Let's see which cloud provider is the most suitable for you.`;
    }
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    
    if (categoryData.length === 1) {
      title = `Deep Dive to ${categoryNames[0]} - ${parentName}`;
      description = `In this deep dive, we'll explore ${categoryNames[0]} concepts in detail. Understand this ${parentName.toLowerCase()} approach and see if it fits your technical requirements.`;
    } else if (categoryData.length <= 3) {
      title = `${categoryNames.join(" vs ")} Comparison - ${parentName}`;
      if (categoryData.length === 2) {
        description = `In this comparison, we will compare ${categoryNames[0]} with ${categoryNames[1]}. Let's understand which ${parentName.toLowerCase()} approach fits your technical requirements.`;
      } else {
        description = `In this comparison, we will compare ${categoryNames[0]} with ${categoryNames[1]}, and ${categoryNames[2]}. Let's understand which ${parentName.toLowerCase()} approach fits your technical requirements.`;
      }
    } else {
      title = `${categoryNames[0]} vs ${categoryData.length - 1} other ${parentName.toLowerCase()} concepts compared`;
      const otherCategories = categoryNames.slice(1);
      const lastCategory = otherCategories.pop();
      description = `In this opportunity, we will compare ${categoryNames[0]} with ${otherCategories.join(", ")}${otherCategories.length > 0 ? ', and ' : ''}${lastCategory} architectural concepts. Let's understand which ${parentName.toLowerCase()} approach fits your technical requirements.`;
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

export default async function CompareParamsPage({ params }: ComparePageProps) {
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
      title = `Deep Dive to ${serviceNames[0]}`;
      description = `In this deep dive, we'll explore ${serviceNames[0]} in detail`;
    } else if (services.length <= 3) {
      title = `${serviceNames.join(" vs ")} Comparison`;
      if (services.length === 2) {
        description = `In this comparison, we will compare ${serviceNames[0]} with ${serviceNames[1]}`;
      } else {
        description = `In this comparison, we will compare ${serviceNames[0]} with ${serviceNames[1]}, and ${serviceNames[2]}`;
      }
    } else {
      title = `${serviceNames[0]} vs ${services.length - 1} other services compared`;
      const otherServices = serviceNames.slice(1);
      const lastService = otherServices.pop();
      description = `In this opportunity, we will compare ${serviceNames[0]} with ${otherServices.join(", ")}${otherServices.length > 0 ? ', and ' : ''}${lastService}`;
    }
  } else if (type === "provider") {
    const providerNames = services.map(s => s.name);
    
    if (services.length === 1) {
      title = `Deep Dive to ${providerNames[0]}`;
      description = `In this deep dive, we'll explore ${providerNames[0]} in detail`;
    } else if (services.length <= 3) {
      title = `${providerNames.join(" vs ")} Provider Comparison`;
      if (services.length === 2) {
        description = `In this comparison, we will compare ${providerNames[0]} with ${providerNames[1]}`;
      } else {
        description = `In this comparison, we will compare ${providerNames[0]} with ${providerNames[1]}, and ${providerNames[2]}`;
      }
    } else {
      title = `${providerNames[0]} vs ${services.length - 1} other providers compared`;
      const otherProviders = providerNames.slice(1);
      const lastProvider = otherProviders.pop();
      description = `In this opportunity, we will compare ${providerNames[0]} with ${otherProviders.join(", ")}${otherProviders.length > 0 ? ', and ' : ''}${lastProvider}`;
    }
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    
    if (categoryData.length === 1) {
      title = `Deep Dive to ${categoryNames[0]} - ${parentName}`;
      description = `In this deep dive, we'll explore ${categoryNames[0]} concepts in detail`;
    } else if (categoryData.length <= 3) {
      title = `${categoryNames.join(" vs ")} Comparison`;
      if (categoryData.length === 2) {
        description = `In this comparison, we will compare ${categoryNames[0]} with ${categoryNames[1]}`;
      } else {
        description = `In this comparison, we will compare ${categoryNames[0]} with ${categoryNames[1]}, and ${categoryNames[2]}`;
      }
    } else {
      title = `${categoryNames[0]} vs ${categoryData.length - 1} other ${parentName.toLowerCase()} concepts compared`;
      const otherCategories = categoryNames.slice(1);
      const lastCategory = otherCategories.pop();
      description = `In this opportunity, we will compare ${categoryNames[0]} with ${otherCategories.join(", ")}${otherCategories.length > 0 ? ', and ' : ''}${lastCategory}`;
    }
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
          <div className="mb-4 flex items-center gap-3">
            <Link href="/compare">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Compare
              </Button>
            </Link>
            <Link href={`/compare/simplified/${resolvedParams.params.join("/")}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Simplified view
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </div>

      {type === "service" || type === "provider" ? (
        <ComparisonTable
          services={services}
          onBackToSelection={() => {}} // Not used in this context
          title={title}
          description={description}
        />
      ) : (
        <CategoryComparisonTable
          categories={categoryData}
          title={title}
          description={description}
        />
      )}
    </div>
  );
}

// Generate static params for popular comparisons (optional, for better performance)
export async function generateStaticParams() {
  const staticComparisons = [
    // Popular service comparisons
    { params: ["service", "aws_ec2-vs-azure_vm"] },
    { params: ["service", "aws_lambda-vs-azure_functions"] },
    { params: ["service", "aws_s3-vs-azure_blob"] },
    { params: ["service", "openai_gpt-vs-anthropic_claude"] },
    
    // Popular category comparisons (conceptual)
    { params: ["category", "compute", "virtual-machines-vs-serverless-functions"] },
    { params: ["category", "compute", "virtual-machines-vs-kubernetes"] },
    { params: ["category", "compute", "serverless-functions-vs-container-services"] },
    { params: ["category", "compute", "kubernetes-vs-container-services"] },
    { params: ["category", "storage", "object-storage-vs-managed-databases"] },
  ];

  return staticComparisons;
}