"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eye, Scale } from "lucide-react";

interface BlogCardProps {
  url: string;
  title: string;
  description: string;
  date: string;
  thumbnail?: string;
  showRightBorder?: boolean;
}

export function BlogCard({
  url,
  title,
  description,
  date,
  thumbnail,
  showRightBorder = true,
}: BlogCardProps) {
  return (
    <div
      className={cn(
        "group relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-0 after:h-px after:w-screen after:bg-border after:content-['']",
        showRightBorder && "md:border-r border-border border-b-0"
      )}
    >
      <div className="flex flex-col">
        {thumbnail && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">{description}</p>
          <time className="block text-sm font-medium text-muted-foreground">
            {date}
          </time>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={url}
            className="flex items-center justify-center h-10 bg-primary text-primary-foreground rounded-md transition-all duration-300 ease-in-out hover:w-3/4 w-1/2 group/read"
          >
            <Eye className="h-4 w-4 group-hover/read:mr-2" />
            <span className="hidden group-hover/read:inline text-sm font-medium">Read More</span>
          </Link>
          <Link
            href={`/compare?c=${encodeURIComponent(title)}`}
            className="flex items-center justify-center h-10 bg-secondary text-secondary-foreground rounded-md transition-all duration-300 ease-in-out hover:w-3/4 w-1/2 group/compare"
          >
            <Scale className="h-4 w-4 group-hover/compare:mr-2" />
            <span className="hidden group-hover/compare:inline text-sm font-medium">Compare With</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
