"use client";

import { useState, useMemo } from "react";
import { Search, Grid, List, ChevronDown, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: string;
  tags: string[];
  expanded?: boolean;
}

const mockGlossaryData: GlossaryItem[] = [
  {
    id: "1",
    term: "API",
    definition: "Application Programming Interface. A set of protocols, tools, and definitions for building software applications. It specifies how software components should interact and allows different applications to communicate with each other.",
    category: "Development",
    tags: ["Development", "Integration", "Web Services"]
  },
  {
    id: "2", 
    term: "Cloud Computing",
    definition: "The delivery of computing services including servers, storage, databases, networking, software, analytics, and intelligence over the Internet to offer faster innovation, flexible resources, and economies of scale.",
    category: "Cloud",
    tags: ["Cloud", "Infrastructure", "Scalability"]
  },
  {
    id: "3",
    term: "Docker",
    definition: "A platform that uses OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries and configuration files.",
    category: "DevOps",
    tags: ["DevOps", "Containerization", "Development"]
  },
  {
    id: "4",
    term: "Kubernetes",
    definition: "An open-source container orchestration platform that automates deploying, scaling, and managing containerized applications across clusters of hosts.",
    category: "DevOps", 
    tags: ["DevOps", "Orchestration", "Cloud"]
  },
  {
    id: "5",
    term: "Machine Learning",
    definition: "A subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to build mathematical models based on training data.",
    category: "AI",
    tags: ["AI", "Data Science", "Algorithms"]
  },
  {
    id: "6",
    term: "Neural Network",
    definition: "A computing system inspired by biological neural networks. It consists of interconnected nodes (neurons) that work together to solve specific problems like pattern recognition and machine learning.",
    category: "AI",
    tags: ["AI", "Deep Learning", "Algorithms"]
  },
  {
    id: "7",
    term: "Virtual Machine",
    definition: "A software-based emulation of a physical computer that runs an operating system and applications. VMs allow multiple operating systems to run simultaneously on a single physical machine.",
    category: "Infrastructure",
    tags: ["VM", "Virtualization", "Infrastructure"]
  },
  {
    id: "8",
    term: "Blockchain",
    definition: "A distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
    category: "Technology",
    tags: ["Blockchain", "Cryptography", "Distributed Systems"]
  }
];

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [tagMode, setTagMode] = useState<"alphabetical" | "topic">("alphabetical");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const alphabeticalTags = ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  
  const topicTags = useMemo(() => {
    const topics = new Set(mockGlossaryData.flatMap(item => item.tags));
    return ["All", ...Array.from(topics).sort()];
  }, []);

  const currentTags = tagMode === "alphabetical" ? alphabeticalTags : topicTags;

  const filteredItems = useMemo(() => {
    return mockGlossaryData.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (tagMode === "alphabetical") {
        const matchesTag = selectedTag === "All" || item.term.charAt(0).toUpperCase() === selectedTag;
        return matchesSearch && matchesTag;
      } else {
        const matchesTag = selectedTag === "All" || item.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      }
    });
  }, [searchTerm, selectedTag, tagMode]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="size-8 text-primary" />
            <div>
              <h1 className="text-3xl font-medium tracking-tight">Glossary</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive definitions of technical terms and concepts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Search and Controls */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search terms and definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Tag Mode Switcher and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                Filter by:
              </span>
              <Button
                variant={tagMode === "alphabetical" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTagMode("alphabetical");
                  setSelectedTag("All");
                }}
                className="h-auto p-2"
              >
                <Grid className="w-4 h-4 mr-1" />
                Alphabetical
              </Button>
              <Button
                variant={tagMode === "topic" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTagMode("topic");
                  setSelectedTag("All");
                }}
                className="h-auto p-2"
              >
                <List className="w-4 h-4 mr-1" />
                Topics
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredItems.length} term{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="h-auto px-3 py-1.5"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Glossary Items */}
        <div>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">
              <BookOpen className="size-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No terms found</h3>
              <p className="text-muted-foreground mb-4">
                No terms found matching your criteria
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const shouldTruncate = item.definition.length > 150;
                const displayDefinition = isExpanded || !shouldTruncate 
                  ? item.definition 
                  : item.definition.substring(0, 150) + "...";

                return (
                  <div
                    key={item.id}
                    className={`bg-card border rounded-lg p-4 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 cursor-pointer ${
                      isExpanded ? "md:col-span-2 lg:col-span-3 shadow-lg shadow-primary/10 -translate-y-1 border-primary/20 bg-primary/5 shadow-inner" : ""
                    }`}
                    onClick={(e) => {
                      // Only trigger if no text is selected
                      const selection = window.getSelection();
                      if (selection && selection.toString().length > 0) {
                        return;
                      }
                      
                      const shouldTruncateItem = item.definition.length > 150;
                      if (shouldTruncateItem) toggleExpanded(item.id);
                    }}
                  >
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold leading-tight">
                          {item.term}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full flex-shrink-0 ml-2">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed select-text">
                        {displayDefinition}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {shouldTruncate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(item.id);
                          }}
                          className="text-primary hover:text-primary hover:bg-primary/10 self-start"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                          <ChevronDown
                            className={`w-4 h-4 ml-1 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}