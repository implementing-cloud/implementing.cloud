"use client";

import { useState } from "react";
import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface BlogData {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
  author?: string;
  authorImage?: string;
  thumbnail?: string;
}

interface BlogPage {
  url: string;
  data: BlogData;
}

const dummyBlogs: BlogPage[] = [
  {
    url: "/blog/nextjs-app-router",
    data: {
      title: "Next.js App Router: A Complete Guide",
      description: "Learn how to use the new App Router in Next.js 13+ with practical examples and best practices.",
      date: "2024-01-15",
      tags: ["nextjs", "react", "routing"],
      readTime: "8 min read",
      author: "John Doe"
    }
  },
  {
    url: "/blog/react-server-components",
    data: {
      title: "Understanding React Server Components",
      description: "Deep dive into React Server Components and how they change the way we think about rendering.",
      date: "2024-01-10",
      tags: ["react", "server-components", "performance"],
      readTime: "12 min read",
      author: "Jane Smith"
    }
  },
  {
    url: "/blog/tailwind-css-tips",
    data: {
      title: "10 Tailwind CSS Tips for Better Development",
      description: "Improve your Tailwind CSS workflow with these practical tips and tricks.",
      date: "2024-01-05",
      tags: ["tailwind", "css", "productivity"],
      readTime: "6 min read",
      author: "Mike Johnson"
    }
  },
  {
    url: "/blog/typescript-advanced-patterns",
    data: {
      title: "Advanced TypeScript Patterns",
      description: "Explore advanced TypeScript patterns for building type-safe applications.",
      date: "2024-01-01",
      tags: ["typescript", "patterns", "type-safety"],
      readTime: "15 min read",
      author: "Sarah Wilson"
    }
  },
  {
    url: "/blog/docker-development-setup",
    data: {
      title: "Docker for Development: Complete Setup Guide",
      description: "Set up a complete development environment using Docker and Docker Compose.",
      date: "2023-12-28",
      tags: ["docker", "devops", "development"],
      readTime: "10 min read",
      author: "Alex Chen"
    }
  }
];

export function SearchButton() {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search articles...</span>
        <span className="sr-only">Search articles</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search articles..." />
        <CommandList>
          <CommandEmpty>No articles found.</CommandEmpty>
          <CommandGroup heading="Articles">
            {dummyBlogs.map((blog) => (
              <CommandItem
                key={blog.url}
                onSelect={() => {
                  setOpen(false);
                  window.location.href = blog.url;
                }}
              >
                <div className="flex flex-col">
                  <span>{blog.data.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {blog.data.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}