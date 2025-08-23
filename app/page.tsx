import { Suspense } from "react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { TagFilter } from "@/components/tag-filter";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { PromoBanner } from "@/components/promo-banner";
import { HowItWorks } from "@/components/how-it-works";
import { getAllBlogPosts, getAllBlogTags } from "@/lib/blog-service";



export default async function HomePage() {
  // Get blog posts from both MDX and Directus
  const sortedBlogs = await getAllBlogPosts(20); // Limit to 20 posts for homepage
  const blogTags = await getAllBlogTags();
  
  const allTags = ["All", ...blogTags];

  const tagCounts = allTags.reduce((acc, tag) => {
    if (tag === "All") {
      acc[tag] = sortedBlogs.length;
    } else {
      acc[tag] = sortedBlogs.filter((blog) =>
        blog.tags.includes(tag)
      ).length;
    }
    return acc;
  }, {} as Record<string, number>);

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

      {/* Hero Section */}
      <div className="p-6 border-b border-border flex flex-col gap-6 min-h-[250px] justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter text-pretty">
              Discover, Compare and Implement <span>Latest Technology</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg text-pretty">
              No more endless tabs. No more FOMO. We&apos;ve got you covered.
            </p>
          </div>
        </div>
        {allTags.length > 0 && (
          <div className="max-w-7xl mx-auto w-full">
            <TagFilter
              tags={allTags}
              selectedTag="All"
              tagCounts={tagCounts}
            />
          </div>
        )}
      </div>

      {/* Promo Banner Section */}
      <PromoBanner />

      {/* Articles Section */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-4">
        <div className="py-8">
          <h2 className="text-2xl font-medium tracking-tight mb-6">You Might Interest</h2>
        </div>
        <Suspense fallback={<div>Loading articles...</div>}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${
              sortedBlogs.length < 4 ? "border-b" : "border-b-0"
            }`}
          >
            {sortedBlogs.map((blog) => {
              return (
                <BlogCard
                  key={blog.id}
                  url={blog.url}
                  title={blog.title}
                  description={blog.excerpt || ''}
                  date={blog.formattedDate}
                  thumbnail={blog.thumbnail}
                  showRightBorder={sortedBlogs.length < 3}
                  source={blog.source}
                />
              );
            })}
          </div>
        </Suspense>

        {/* Load More CTAs */}
        <div className="py-8 flex justify-center gap-4">
          <Link 
            href="/services"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Show {sortedBlogs.length} more services and tools
          </Link>
          <Link 
            href="/providers"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
          >
            Browse Providers
          </Link>
        </div>
      </div>

      {/* How it works Section */}
      <HowItWorks />
    </div>
  );
}
