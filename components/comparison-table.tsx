"use client"

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type Service, type FeatureValue } from "@/lib/comparison-data";
import { codeToHtml } from "shiki";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// Using simple inline icons instead of Heroicons

interface ComparisonTableProps {
  services: Service[];
  onBackToSelection?: () => void;
  title?: string;
  description?: string;
}

function isFeatureValue(value: unknown): value is FeatureValue {
  return typeof value === 'object' && value !== null && 'value' in value;
}

function CodeBlock({ code }: { code: { language: string; content: string } }) {
  const [html, setHtml] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const maxHeight = 200; // px
  const lineCount = code.content.split('\n').length;
  const shouldShowToggle = lineCount > 8 || code.content.length > 300;

  const handleCopy = async () => {
    try {
      // Modern clipboard API (Chrome, Safari, newer Firefox)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      }
      
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = code.content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
      
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlightedHtml = await codeToHtml(code.content, {
          lang: code.language,
          theme: 'github-dark'
        });
        setHtml(highlightedHtml);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHtml(`<pre><code>${code.content}</code></pre>`);
      }
    };
    highlightCode();
  }, [code.content, code.language]);

  return (
    <div className="relative border border-border rounded-lg overflow-hidden bg-zinc-950">
      {/* Language label */}
      <div className="px-3 py-2 bg-zinc-800 border-b border-border flex items-center justify-between">
        <span className="text-xs text-zinc-300 font-medium">{code.language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
          title="Copy code"
        >
          {isCopied ? (
            <>
              <span className="text-green-400">✓</span>
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="relative">
        <div 
          className={cn(
            "overflow-x-auto overflow-y-hidden text-xs transition-all duration-300 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800",
            !isExpanded && shouldShowToggle && `max-h-[${maxHeight}px]`
          )}
          style={{
            maxHeight: !isExpanded && shouldShowToggle ? `${maxHeight}px` : 'none'
          }}
        >
          <div 
            className="p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        
        {/* Gradient overlay when collapsed */}
        {!isExpanded && shouldShowToggle && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        )}
      </div>
      
      {/* Show more/less button */}
      {shouldShowToggle && (
        <div className="px-3 py-2 bg-zinc-800 border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isExpanded ? '▲ Show less' : '▼ Show more'}
          </button>
        </div>
      )}
    </div>
  );
}

function ContextInfo({ context }: { context: { type: 'icon' | 'expandable'; content: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  if (context.type === 'icon') {
    return (
      <div className="group relative inline-block ml-1">
        <span className="w-4 h-4 text-muted-foreground cursor-help inline-flex items-center justify-center text-xs rounded-full border border-muted-foreground">?</span>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-sm w-64 text-pretty">
          {context.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="inline-flex items-center text-xs text-primary hover:text-primary/80 ml-2">
        More Context
        <span className={cn("ml-1 transition-transform text-xs", isOpen && "rotate-180")}>▼</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="text-md text-muted-foreground p-2 bg-muted/50 rounded border">
          {context.content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ComparisonTable({ 
  services 
}: ComparisonTableProps) {
  // Get all unique features for comparison table
  const allFeatures = services.reduce((acc, service) => {
    Object.keys(service.features).forEach(feature => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted">
                {services.map(service => (
                  <th key={service.id} className="text-center p-4 font-medium min-w-[200px] sticky top-0 bg-muted z-[12]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{service.logo}</span>
                      <span className="text-sm">{service.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature) => {
                // const rowBg = index * 2 % 4 === 0 ? "bg-background" : "bg-muted/25";
                // const solidRowBg = index * 2 % 4 === 0 ? "bg-background" : "bg-muted";
                // const valueRowBg = (index * 2 + 1) % 4 === 1 ? "bg-background" : "bg-muted/25";
                // const solidValueRowBg = (index * 2 + 1) % 4 === 1 ? "bg-background" : "bg-muted";
                
                return (
                  <React.Fragment key={feature}>
                    {/* Feature name row */}
                    <tr key={`${feature}-name`} className={cn("border-b")}>
                      <td className={cn("p-4 font-medium sticky left-0 z-[11] border-border align-top")}>
                        {feature}
                      </td>
                      {services.slice(1).map((service, serviceIndex) => (
                        <td key={`${feature}-empty-${service.id || serviceIndex}`} className="p-4 text-center align-top">
                        </td>
                      ))}
                    </tr>
                    {/* Feature values row */}
                    <tr key={`${feature}-values`} className={cn("border-b bg-muted/25")}>
                      {services.map(service => (
                        <td key={service.id} className="p-4 text-center w-[320px] max-w-[320px] align-top">
                          <div className="text-sm space-y-2">
                            {(() => {
                              const featureData = service.features[feature];
                              
                              if (featureData === undefined) {
                                return "N/A";
                              }
                              
                              if (isFeatureValue(featureData)) {
                                return (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-center">
                                      <span>{String(featureData.value)}</span>
                                      {featureData.context?.type === 'icon' && (
                                        <ContextInfo context={featureData.context} />
                                      )}
                                    </div>
                                    {featureData.code && (
                                      <div className="text-left w-full">
                                        <CodeBlock code={featureData.code} />
                                      </div>
                                    )}
                                    {featureData.context?.type === 'expandable' && (
                                      <ContextInfo context={featureData.context} />
                                    )}
                                  </div>
                                );
                              }
                              
                              return String(featureData);
                            })()} 
                          </div>
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}