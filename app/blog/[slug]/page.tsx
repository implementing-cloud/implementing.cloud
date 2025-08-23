import { DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { serialize } from 'next-mdx-remote/serialize';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import dynamic from 'next/dynamic';

import { MDXContent } from "@/components/mdx-content";

import { AuthorCard } from "@/components/author-card";
import { ReadMoreSection } from "@/components/read-more-section";
import { PromoContent } from "@/components/promo-content";
import { getAuthor, isValidAuthor } from "@/lib/authors";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { getBlogPostBySlug, getMDXPageData } from "@/lib/blog-service";

// Dynamic imports for client components
const TableOfContents = dynamic(() => import("@/components/table-of-contents").then(mod => ({ default: mod.TableOfContents })), {
  loading: () => <div className="animate-pulse h-24 bg-muted rounded"></div>
});

const MobileTableOfContents = dynamic(() => import("@/components/mobile-toc").then(mod => ({ default: mod.MobileTableOfContents })));

const HashScrollHandler = dynamic(() => import("@/components/hash-scroll-handler").then(mod => ({ default: mod.HashScrollHandler })));

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  // Get unified blog post (from either Directus or MDX)
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Prepare content for rendering
  let MDXComponent: React.ComponentType | null = null;
  let mdxSource: MDXRemoteSerializeResult | null = null;

  if (post.source === 'directus') {
    // For Directus posts, serialize MDX content with syntax highlighting
    if (post.content) {
      mdxSource = await serialize(post.content, {
        mdxOptions: {
          rehypePlugins: [rehypeCode]
        }
      });
    }
  } else {
    // For MDX posts, get the compiled component
    const mdxPage = getMDXPageData(slug);
    if (mdxPage) {
      MDXComponent = mdxPage.data.body;
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <HashScrollHandler />
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

      <div className="space-y-4 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
            <Button variant="outline" asChild className="h-6 w-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to all articles</span>
              </Link>
            </Button>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <time className="font-medium text-muted-foreground">
              {post.formattedDate}
            </time>
            {/* Source indicator for development */}
            {process.env.NODE_ENV === 'development' && (
              <span className={`text-xs px-2 py-1 rounded ${
                post.source === 'directus' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              }`}>
                {post.source.toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-muted-foreground max-w-4xl md:text-lg md:text-balance">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
        <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
        <main className="w-full p-0">
          {post.thumbnail && (
            <div className="relative w-full h-[500px] overflow-hidden object-cover border border-transparent">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-6 lg:p-10">
            {post.source === 'directus' ? (
              // Render Directus MDX content
              mdxSource ? (
                <MDXContent source={mdxSource} />
              ) : (
                <p>No content available</p>
              )
            ) : (
              // Render MDX component
              MDXComponent ? (
                <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
                  <DocsBody>
                    <MDXComponent />
                  </DocsBody>
                </div>
              ) : (
                <p>No content available</p>
              )
            )}
          </div>
          <div className="mt-10">
            <ReadMoreSection
              currentSlug={[slug]}
              currentTags={post.tags}
            />
          </div>
        </main>

        <aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
          <div className="sticky top-20 space-y-8">
            {post.author && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-center gap-4">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{post.author.name}</div>
                    {post.category && (
                      <div className="text-sm text-muted-foreground">{post.category}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {(() => {
              if (!post.author && post.source === 'mdx' && post.data?.author && typeof post.data.author === 'string' && isValidAuthor(post.data.author)) {
                return <AuthorCard author={getAuthor(post.data.author)} />;
              }
              return null;
            })()}
            
            <div className="border border-border rounded-lg p-6 bg-card">
              <TableOfContents />
            </div>
            <PromoContent variant="desktop" />
          </div>
        </aside>
      </div>

      <MobileTableOfContents />
    </div>
  );
}