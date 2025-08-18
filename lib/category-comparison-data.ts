// Category comparison data - focusing on conceptual differences, not individual services

export interface CategoryComparisonData {
  id: string;
  name: string;
  shortDescription: string;
  icon: string;
  parentCategory: string;
  conceptualFeatures: Record<string, string | boolean | number>;
}

export const categoryComparisons: CategoryComparisonData[] = [
  // Compute Categories
  {
    id: "virtual-machines",
    name: "Virtual Machines",
    shortDescription: "Traditional virtualized compute instances",
    icon: "🖥️",
    parentCategory: "compute",
    conceptualFeatures: {
      "Architecture": "Full OS virtualization",
      "Resource Control": "Complete control over OS and runtime",
      "Startup Time": "Minutes (OS boot required)",
      "Scaling Model": "Vertical & Horizontal",
      "Pricing Model": "Per hour/minute",
      "State Management": "Persistent state",
      "Resource Efficiency": "Lower (OS overhead)",
      "Complexity": "High configuration",
      "Use Case": "Long-running applications, legacy systems",
      "Maintenance": "OS patches, security updates required",
      "Isolation": "Strong (hypervisor-level)",
      "Customization": "Full OS customization",
      "Networking": "Traditional networking models",
      "Storage": "Persistent disks, local storage",
      "Monitoring": "Infrastructure + application level"
    }
  },
  {
    id: "serverless-functions",
    name: "Serverless Functions",
    shortDescription: "Event-driven, stateless compute execution",
    icon: "⚡",
    parentCategory: "compute",
    conceptualFeatures: {
      "Architecture": "Function-as-a-Service (FaaS)",
      "Resource Control": "Managed runtime environment",
      "Startup Time": "Milliseconds to seconds",
      "Scaling Model": "Automatic, event-driven",
      "Pricing Model": "Per execution + duration",
      "State Management": "Stateless execution",
      "Resource Efficiency": "High (no idle resources)",
      "Complexity": "Low operational overhead",
      "Use Case": "Event processing, microservices, APIs",
      "Maintenance": "Fully managed by provider",
      "Isolation": "Function-level isolation",
      "Customization": "Runtime environment only",
      "Networking": "API Gateway integration",
      "Storage": "External storage required",
      "Monitoring": "Function execution metrics"
    }
  },
  {
    id: "container-services",
    name: "Container Services",
    shortDescription: "Containerized application deployment",
    icon: "📦",
    parentCategory: "compute",
    conceptualFeatures: {
      "Architecture": "Container orchestration",
      "Resource Control": "Application-level control",
      "Startup Time": "Seconds",
      "Scaling Model": "Horizontal scaling",
      "Pricing Model": "Per container/resource usage",
      "State Management": "Stateless preferred",
      "Resource Efficiency": "High (shared OS kernel)",
      "Complexity": "Medium operational overhead",
      "Use Case": "Microservices, web applications",
      "Maintenance": "Container updates required",
      "Isolation": "Process-level isolation",
      "Customization": "Application stack",
      "Networking": "Service mesh, load balancing",
      "Storage": "Volume mounts, external storage",
      "Monitoring": "Container + application metrics"
    }
  },
  {
    id: "kubernetes",
    name: "Managed Kubernetes",
    shortDescription: "Enterprise container orchestration platform",
    icon: "☸️",
    parentCategory: "compute",
    conceptualFeatures: {
      "Architecture": "Declarative container orchestration",
      "Resource Control": "Fine-grained resource management",
      "Startup Time": "Seconds to minutes",
      "Scaling Model": "Auto-scaling with policies",
      "Pricing Model": "Cluster + node pricing",
      "State Management": "StatefulSets + persistent volumes",
      "Resource Efficiency": "High with proper configuration",
      "Complexity": "High learning curve",
      "Use Case": "Complex applications, enterprise workloads",
      "Maintenance": "YAML configuration, cluster management",
      "Isolation": "Namespace + RBAC",
      "Customization": "Extensive customization options",
      "Networking": "Advanced networking (CNI)",
      "Storage": "Persistent volume claims",
      "Monitoring": "Comprehensive observability"
    }
  },
  
  // Storage Categories
  {
    id: "object-storage",
    name: "Object Storage",
    shortDescription: "Scalable cloud storage for unstructured data",
    icon: "🗃️",
    parentCategory: "storage",
    conceptualFeatures: {
      "Data Model": "Key-value objects with metadata",
      "Scalability": "Virtually unlimited",
      "Consistency": "Eventually consistent",
      "Access Pattern": "REST API, HTTP requests",
      "Query Capabilities": "Metadata queries only",
      "Durability": "99.999999999% (11 9s)",
      "Performance": "High throughput, variable latency",
      "Use Case": "Static assets, backups, data lakes",
      "Pricing Model": "Pay per GB stored + requests",
      "Geographic Distribution": "Multi-region replication",
      "File Size Limits": "Single objects up to 5TB",
      "Versioning": "Built-in versioning support",
      "Security": "Access policies, encryption",
      "Integration": "CDN, analytics, ML services",
      "Backup Strategy": "Cross-region replication"
    }
  },
  {
    id: "managed-databases",
    name: "Managed Databases",
    shortDescription: "Fully managed relational database services",
    icon: "🗄️",
    parentCategory: "storage",
    conceptualFeatures: {
      "Data Model": "Relational tables with ACID properties",
      "Scalability": "Vertical scaling, read replicas",
      "Consistency": "Strong consistency",
      "Access Pattern": "SQL queries, connections",
      "Query Capabilities": "Complex SQL operations",
      "Durability": "99.99% with backups",
      "Performance": "Optimized for OLTP workloads",
      "Use Case": "Transactional applications, analytics",
      "Pricing Model": "Instance hours + storage",
      "Geographic Distribution": "Multi-AZ deployment",
      "File Size Limits": "Row-based limitations",
      "Versioning": "Transaction logs, snapshots",
      "Security": "Encryption, VPC, IAM integration",
      "Integration": "Application frameworks, BI tools",
      "Backup Strategy": "Automated backups, point-in-time recovery"
    }
  },

  // AI/ML Categories
  {
    id: "llm-apis",
    name: "Large Language Model APIs",
    shortDescription: "Pre-trained language models for text generation",
    icon: "🤖",
    parentCategory: "ai-ml",
    conceptualFeatures: {
      "Architecture": "Transformer-based neural networks",
      "Training Data": "Internet-scale text corpora",
      "Input Format": "Natural language prompts",
      "Output Format": "Generated text responses",
      "Customization": "Prompt engineering, fine-tuning",
      "Latency": "Real-time inference",
      "Pricing Model": "Per token consumption",
      "Use Case": "Content generation, chatbots, analysis",
      "Context Window": "4K to 1M+ tokens",
      "Multimodal": "Text, images, code",
      "Safety Features": "Content filtering, alignment",
      "API Integration": "REST APIs, SDKs",
      "Scaling": "Automatic load handling",
      "Accuracy": "High but probabilistic",
      "Maintenance": "Model updates, version management"
    }
  }
];

// Utility functions for category comparisons
export function getCategoryComparisonById(id: string): CategoryComparisonData | undefined {
  return categoryComparisons.find(category => category.id === id);
}

export function getCategoriesByIds(ids: string[]): CategoryComparisonData[] {
  return ids.map(id => getCategoryComparisonById(id)).filter(Boolean) as CategoryComparisonData[];
}

export function getCategoriesByParent(parentId: string): CategoryComparisonData[] {
  return categoryComparisons.filter(category => category.parentCategory === parentId);
}

export function getParentCategoryName(parentId: string): string {
  const parentNames: Record<string, string> = {
    "compute": "Compute",
    "storage": "Storage", 
    "ai-ml": "AI & Machine Learning"
  };
  return parentNames[parentId] || parentId;
}