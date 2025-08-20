"use client";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {CloudList3D} from "@/components/promo-banner/cloud-list"
import { BrainCircuitIcon, CloudIcon, NotebookPenIcon, ScaleIcon, TextCursorInputIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";


const features = [
  {
    Icon: CloudIcon,
    name: "Service to explore",
    shortName: "Explore",
    description: "Explore all major platforms with curated uniqueness, pricing and DX. No vague summary",
    href: "/",
    cta: "Learn more",
    background: <CloudList3D />,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: TextCursorInputIcon,
    name: "Implementation Guides",
    shortName: "Guide",
    description: "Step-by-step tutorials on how to set up, PoC, deploy, and scale with real-world examples",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BrainCircuitIcon,
    name: "Learn AI, From Basics to Practical",
    shortName: "AI",
    description: "Overwhelmed by GPT vs Claude, RAG, Multi Agents, [insert new terms every day]? No worries. We got you!",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: ScaleIcon,
    name: "Compare Pricing & Features",
    shortName: "Compare",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: NotebookPenIcon,
    name: "Notes Built-in",
    shortName: "Notes",
    description: "We help you to learn. Press N to create a note or block text to highlight, in all page. Ctrl+K to search your notes or all resource pages",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
];

const MobilePromoGrid = () => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHighlightedIndex((prev) => (prev + 1) % features.length);
        setIsTransitioning(false);
      }, 150);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCardSwap = (clickedIndex: number) => {
    if (clickedIndex === highlightedIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setHighlightedIndex(clickedIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const highlightedFeature = features[highlightedIndex];
  const gridFeatures = features.filter((_, index) => index !== highlightedIndex);

  return (
    <div className="space-y-4">
      {/* Highlighted Card */}
      <div
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-xl",
          "bg-white border border-gray-200/60",
          "[box-shadow:0_2px_8px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.12),0_1px_0px_rgba(255,255,255,0.05)_inset]",
          "dark:bg-gray-900/90 dark:border-gray-700/50",
          "dark:[box-shadow:0_2px_8px_rgba(0,0,0,.3),0_8px_24px_rgba(0,0,0,.4),0_1px_0px_rgba(255,255,255,0.1)_inset]",
          "backdrop-blur-sm",
          "h-64"
        )}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={cn(
              "transition-opacity duration-300 ease-in-out",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          >
            {highlightedFeature.background}
          </div>
        </div>
        <div className="relative z-10 p-4 flex flex-col justify-between h-full">
          <div 
            className={cn(
              "space-y-2 transition-all duration-300 ease-in-out",
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            <highlightedFeature.Icon className="h-8 w-8 text-gray-700 dark:text-gray-200 transition-all duration-300 ease-out" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {highlightedFeature.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {highlightedFeature.description}
            </p>
          </div>
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out",
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            <Button
              variant="link"
              asChild
              size="sm"
              className="self-start p-0 mt-2 transition-all duration-200 ease-out hover:translate-x-1"
            >
              <a href={highlightedFeature.href}>
                {highlightedFeature.cta}
                <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* 2x2 Grid of smaller cards */}
      <div className="grid grid-cols-2 gap-3">
        {gridFeatures.map((feature, index) => {
          const originalIndex = features.findIndex(f => f === feature);
          return (
            <div
              key={feature.name}
              onClick={() => handleCardSwap(originalIndex)}
              className={cn(
                "group relative flex flex-col items-center justify-center overflow-hidden rounded-lg cursor-pointer",
                "bg-white border border-gray-200/60",
                "[box-shadow:0_1px_4px_rgba(0,0,0,.06),0_4px_12px_rgba(0,0,0,.08)]",
                "hover:[box-shadow:0_4px_16px_rgba(0,0,0,.12),0_8px_24px_rgba(0,0,0,.15)]",
                "hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 ease-out",
                "dark:bg-gray-900/90 dark:border-gray-700/50",
                "dark:[box-shadow:0_1px_4px_rgba(0,0,0,.2),0_4px_12px_rgba(0,0,0,.3)]",
                "dark:hover:[box-shadow:0_4px_16px_rgba(0,0,0,.4),0_8px_24px_rgba(0,0,0,.5)]",
                "h-24",
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out",
                `delay-${(index + 1) * 100}`
              )}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <feature.Icon className="h-6 w-6 text-gray-700 dark:text-gray-200 mb-2 transition-all duration-200 ease-out group-hover:scale-110 group-hover:rotate-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center px-2 transition-all duration-200 ease-out group-hover:scale-105">
                {feature.shortName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function PromoBanner() {
  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-4 py-8">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <BentoGrid className="lg:grid-rows-2">
          {features.map((feature) => {
            const { shortName, ...bentoProps } = feature;
            return <BentoCard key={feature.name} {...bentoProps} />;
          })}
        </BentoGrid>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobilePromoGrid />
      </div>
    </div>
  );
}
