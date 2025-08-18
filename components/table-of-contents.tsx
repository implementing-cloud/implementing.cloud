"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Only look for headings within main content areas, excluding UI components
    const contentSelectors = [
      "main h1, main h2",
      "article h1, article h2", 
      ".prose h1, .prose h2",
      "[role='main'] h1, [role='main'] h2"
    ];
    
    let headingElements: NodeListOf<Element> | Element[] | null = null;
    
    // Try each selector until we find headings
    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        headingElements = elements;
        break;
      }
    }
    
    // Fallback to all headings but exclude known UI components
    if (!headingElements || headingElements.length === 0) {
      const allHeadings = document.querySelectorAll("h1, h2");
      const filteredHeadings: Element[] = [];
      
      allHeadings.forEach((element) => {
        const text = element.textContent || "";
        // Exclude common UI component headings
        if (!text.includes("Command Palette") && 
            !element.closest('[role="dialog"]') &&
            !element.closest('.command-palette') &&
            !element.closest('nav')) {
          filteredHeadings.push(element);
        }
      });
      
      headingElements = filteredHeadings;
    }

    const headingsArray: Heading[] = [];
    headingElements.forEach((element) => {
      if (element.id) {
        headingsArray.push({
          id: element.id,
          text: element.textContent || "",
          level: parseInt(element.tagName.charAt(1)),
        });
      }
    });

    setHeadings(headingsArray);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Find the topmost visible heading
          const topEntry = visibleEntries.reduce((top, entry) => {
            return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
          });
          
          setActiveId(topEntry.target.id);
        } else {
          // If no headings are visible, find the closest one above the viewport
          const headingPositions = headings.map((heading) => {
            const element = document.getElementById(heading.id);
            return {
              id: heading.id,
              top: element ? element.getBoundingClientRect().top : Infinity,
            };
          });

          const headingsAbove = headingPositions
            .filter((heading) => heading.top < 0)
            .sort((a, b) => b.top - a.top);

          if (headingsAbove.length > 0) {
            setActiveId(headingsAbove[0].id);
          }
        }
      },
      {
        root: null,
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings, activeId]);

  const handleClick = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;

    window.history.pushState({}, '', `#${id}`);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error("Clipboard API failed:", err);
        // Fall back to textarea method
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } else {
      // Fallback for browsers without Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-semibold text-foreground mb-4">
        On this page
      </h4>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "block w-full text-left text-sm transition-colors hover:text-foreground text-muted-foreground",
                  {
                    "text-primary font-medium underline underline-offset-4":
                      activeId === heading.id,
                  }
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
