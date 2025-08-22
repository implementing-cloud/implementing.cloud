import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Blog posts - manually list known blog posts for now
  const blogSlugs = [
    'ai-ml-platform-comparison-openai-vs-anthropic-vs-google',
    'cloud-service-comparison-aws-vs-azure-vs-gcp',
    'devops-automation-tools-cloud-infrastructure',
    'docker-containerization-development-to-production',
    'infrastructure-as-code-terraform-vs-cloudformation-vs-pulumi',
    'kubernetes-container-orchestration-setup-scaling',
  ]
  
  const blogPosts = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Popular service comparisons
  const serviceComparisons = [
    // AWS vs Azure vs GCP
    'aws_ec2-vs-azure_vm-vs-gcp_compute',
    'aws_lambda-vs-azure_functions',
    'aws_s3-vs-azure_blob',
    'aws_rds-vs-azure_sql',
    'aws_eks-vs-gke',
    
    // AI/ML comparisons
    'openai_gpt-vs-anthropic_claude',
    'openai_gpt-vs-google_gemini',
    'anthropic_claude-vs-google_gemini',
    
    // Individual service deep dives
    'aws_ec2',
    'azure_vm',
    'gcp_compute',
    'aws_lambda',
    'azure_functions',
    'openai_gpt',
    'anthropic_claude',
  ].map(comparison => ({
    url: `${baseUrl}/compare/service/${comparison}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Provider comparisons
  const providerComparisons = [
    'aws-vs-azure-vs-gcp',
    'aws-vs-azure',
    'aws-vs-gcp',
    'azure-vs-gcp',
    'openai-vs-anthropic',
    'aws',
    'azure',
    'gcp',
    'openai',
    'anthropic',
  ].map(comparison => ({
    url: `${baseUrl}/compare/provider/${comparison}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Category comparisons (conceptual)
  const categoryComparisons = [
    // Compute category comparisons
    'compute/virtual-machines-vs-serverless-functions',
    'compute/virtual-machines-vs-kubernetes',
    'compute/serverless-functions-vs-container-services',
    'compute/kubernetes-vs-container-services',
    'compute/virtual-machines-vs-container-services',
    
    // Storage category comparisons
    'storage/object-storage-vs-managed-databases',
    
    // Single category deep dives
    'compute/virtual-machines',
    'compute/serverless-functions',
    'compute/container-services',
    'compute/kubernetes',
    'storage/object-storage',
    'storage/managed-databases',
  ].map(comparison => ({
    url: `${baseUrl}/compare/category/${comparison}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Simplified views for popular comparisons
  const simplifiedViews = [
    ...serviceComparisons.slice(0, 10), // Top 10 service comparisons
    ...providerComparisons.slice(0, 5), // Top 5 provider comparisons
    ...categoryComparisons.slice(0, 8), // Top 8 category comparisons
  ].map(page => ({
    url: page.url.replace('/compare/', '/compare/simplified/'),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority - 0.1, // Slightly lower priority than main pages
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...blogPosts,
    ...serviceComparisons,
    ...providerComparisons,
    ...categoryComparisons,
    ...simplifiedViews,
  ]
}