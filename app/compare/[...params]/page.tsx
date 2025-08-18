import { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  getServicesByIds
} from "@/lib/comparison-data";
import { 
  getCategoriesByIds,
  getParentCategoryName
} from "@/lib/category-comparison-data";
import { ComparisonTable } from "@/components/comparison-table";
import { CategoryComparisonTable } from "@/components/category-comparison-table";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
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
    title = `${serviceNames.join(" vs ")} Comparison`;
    description = `Compare ${serviceNames.join(", ")} features, pricing, and capabilities side by side. Find the best service for your needs.`;
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    title = `${categoryNames.join(" vs ")} Comparison - ${parentName}`;
    description = `Compare ${categoryNames.join(", ")} architectural concepts and fundamental differences. Understand which ${parentName.toLowerCase()} approach fits your technical requirements.`;
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
    title = `${services.map(s => s.name).join(" vs ")} Comparison`;
    description = `Comparing ${services.length} cloud services`;
  } else {
    const categoryNames = categoryData.map(c => c.name);
    const parentName = getParentCategoryName(parentCategory!);
    title = `${categoryNames.join(" vs ")} Comparison`;
    description = `Comparing architectural concepts in ${parentName}`;
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <Link href="/compare">
            <Button variant="outline">
              Back to Compare
            </Button>
          </Link>
        </div>
      </div>

      {type === "service" ? (
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