// Sample data structure
export interface Service {
  id: string;
  name: string;
  logo: string;
  parentCategory: string;
  childCategory: string;
  features: Record<string, string | number | boolean>;
}

export interface ChildCategory {
  id: string;
  name: string;
  services: Service[];
}

export interface ParentCategory {
  id: string;
  name: string;
  childCategories: ChildCategory[];
}

// Sample data with parent/child structure
export const parentCategories: ParentCategory[] = [
  {
    id: "compute",
    name: "Compute",
    childCategories: [
      {
        id: "virtual-machines",
        name: "Virtual Machines",
        services: [
          {
            id: "aws_ec2",
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
            id: "azure_vm",
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
            id: "gcp_compute",
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
            id: "digitalocean_droplets",
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
            id: "aws_lambda",
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
            id: "azure_functions",
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
            id: "aws_ecs",
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
            id: "azure_container_instances",
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
            id: "aws_eks",
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
            id: "aws_s3",
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
            id: "azure_blob",
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
            id: "aws_rds",
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
            id: "azure_sql",
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
            id: "openai_gpt",
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
            id: "anthropic_claude",
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
            id: "google_gemini",
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

// Utility functions
export function getAllServices(): Service[] {
  return parentCategories.flatMap(parent => 
    parent.childCategories.flatMap(child => child.services)
  );
}

export function getServiceById(id: string): Service | undefined {
  return getAllServices().find(service => service.id === id);
}

export function getServicesByIds(ids: string[]): Service[] {
  const allServices = getAllServices();
  return ids.map(id => allServices.find(service => service.id === id)).filter(Boolean) as Service[];
}

export function getParentCategoryById(id: string): ParentCategory | undefined {
  return parentCategories.find(parent => parent.id === id);
}

export function getChildCategoryById(parentId: string, childId: string): ChildCategory | undefined {
  const parent = getParentCategoryById(parentId);
  return parent?.childCategories.find(child => child.id === childId);
}

export function getServicesByChildCategory(parentId: string, childId: string): Service[] {
  const childCategory = getChildCategoryById(parentId, childId);
  return childCategory?.services || [];
}

export function normalizeServiceId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export function denormalizeServiceId(id: string): string {
  return id.replace(/_/g, ' ');
}