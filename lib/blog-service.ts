import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { createDirectus, rest, readItems } from '@directus/sdk';

// Directus types
interface DirectusBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  published_date?: string | null;
  date_created: string;
  tags?: string[] | null;
  author?: string | null;
  category?: number | null;
  status: string;
}

// Helper functions
function parseDirectusTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch {
      return [tags];
    }
  }
  return [];
}

function formatDirectusDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
}

// Directus client
const directusClient = createDirectus(process.env.DIRECTUS_URL || 'http://localhost:8055').with(rest());

// Static MDX source (existing)
const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(docs, meta),
});

// Unified blog post interface
export interface UnifiedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  url: string;
  date: string;
  formattedDate: string;
  tags: string[];
  thumbnail?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: string;
  source: 'mdx' | 'directus';
  // For MDX compatibility
  data?: Record<string, unknown>;
}

// Convert Directus post to unified format
function directusToUnified(post: DirectusBlogPost): UnifiedBlogPost {
  const tags = parseDirectusTags(post.tags);
  const publishedDate = post.published_date || post.date_created;
  
  return {
    id: `directus-${post.id}`,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || undefined,
    content: post.content || undefined,
    url: `/blog/${post.slug}`,
    date: publishedDate,
    formattedDate: formatDirectusDate(publishedDate),
    tags,
    thumbnail: post.featured_image || undefined,
    author: post.author ? {
      name: post.author,
    } : undefined,
    category: post.category ? `Category ${post.category}` : undefined,
    source: 'directus'
  };
}

// Convert MDX page to unified format  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mdxToUnified(page: any): UnifiedBlogPost {
  const date = new Date(typeof page.data.date === 'string' ? page.data.date : Date.now());
  
  return {
    id: `mdx-${page.url}`,
    title: page.data.title as string,
    slug: page.url.replace('/blog/', ''),
    excerpt: page.data.description as string | undefined,
    url: page.url,
    date: page.data.date as string,
    formattedDate: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    tags: Array.isArray(page.data.tags) ? page.data.tags as string[] : [],
    thumbnail: page.data.thumbnail as string | undefined,
    source: 'mdx',
    data: page.data // Keep original data for MDX rendering
  };
}

// Fetch Directus posts using REST API
async function fetchDirectusPosts(): Promise<UnifiedBlogPost[]> {
  try {
    console.log('Fetching Directus posts via REST API...');
    
    const response = await directusClient.request(
      readItems('blog', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'published_date', 'date_created', 'tags', 'author', 'category', 'status'],
        sort: ['-published_date', '-date_created']
      })
    );
    
    if (response && Array.isArray(response)) {
      return response.map(post => directusToUnified(post as DirectusBlogPost));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch Directus posts:', error);
    return [];
  }
}


// Get all blog posts (both MDX and Directus)
export async function getAllBlogPosts(limit?: number): Promise<UnifiedBlogPost[]> {
  try {
    // Get static MDX posts
    const mdxPages = blogSource.getPages();
    const mdxPosts = mdxPages.map(mdxToUnified);

    // Get Directus posts via REST API
    const directusPosts = await fetchDirectusPosts();
    
    // Combine and sort by date
    const allPosts = [...mdxPosts, ...directusPosts];
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Most recent first
    });

    return limit ? sortedPosts.slice(0, limit) : sortedPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  try {
    // First try to get from all posts (includes Directus sample data)
    const allPosts = await getAllBlogPosts();
    const directusPost = allPosts.find(post => post.slug === slug && post.source === 'directus');
    
    if (directusPost) {
      return directusPost;
    }

    // Try MDX posts
    const mdxPage = blogSource.getPage([slug]);
    if (mdxPage) {
      return mdxToUnified(mdxPage);
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Get related blog posts based on tags
export async function getRelatedBlogPosts(
  currentSlug: string[], 
  tags: string[], 
  limit: number = 3
): Promise<UnifiedBlogPost[]> {
  try {
    const allPosts = await getAllBlogPosts();
    const currentSlugString = Array.isArray(currentSlug) ? currentSlug[0] : currentSlug;
    
    const relatedPosts = allPosts
      .filter(post => post.slug !== currentSlugString)
      .filter(post => post.tags.some(tag => tags.includes(tag)))
      .slice(0, limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Get all unique tags
export async function getAllBlogTags(): Promise<string[]> {
  try {
    const allPosts = await getAllBlogPosts();
    const tags = new Set<string>();
    
    allPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });

    return Array.from(tags).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Get posts by tag
export async function getBlogPostsByTag(tag: string, limit?: number): Promise<UnifiedBlogPost[]> {
  try {
    const allPosts = await getAllBlogPosts();
    const filteredPosts = allPosts.filter(post => 
      post.tags.includes(tag)
    );

    return limit ? filteredPosts.slice(0, limit) : filteredPosts;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

// For compatibility with existing code - get MDX page data for rendering
export function getMDXPageData(slug: string) {
  try {
    return blogSource.getPage([slug]);
  } catch (error) {
    console.error('Error getting MDX page data:', error);
    return null;
  }
}