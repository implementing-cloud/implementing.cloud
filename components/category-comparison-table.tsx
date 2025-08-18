import { cn } from "@/lib/utils";
import { type CategoryComparisonData } from "@/lib/category-comparison-data";

interface CategoryComparisonTableProps {
  categories: CategoryComparisonData[];
  title?: string;
  description?: string;
}

export function CategoryComparisonTable({ 
  categories
}: CategoryComparisonTableProps) {
  // Get all unique conceptual features for comparison table
  const allFeatures = categories.reduce((acc, category) => {
    Object.keys(category.conceptualFeatures).forEach(feature => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Introduction section explaining the conceptual comparison */}
      <div className="mb-8 bg-muted/30 rounded-lg p-6 border">
        <h2 className="text-xl font-medium mb-3">Understanding the Fundamental Differences</h2>
        <p className="text-muted-foreground">
          This comparison focuses on the <strong>architectural concepts and fundamental characteristics</strong> of each technology category, 
          rather than specific service implementations. Use this to understand which approach best fits your technical requirements and use case.
        </p>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted">
                <th className="text-left p-4 font-medium sticky left-0 top-0 bg-muted min-w-[200px] z-[12] border-r border-border">
                  Characteristics
                </th>
                {categories.map(category => (
                  <th key={category.id} className="text-center p-4 font-medium min-w-[250px] sticky top-0 bg-muted z-[11]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <div className="text-sm font-semibold">{category.name}</div>
                        <div className="text-xs text-muted-foreground font-normal mt-1">
                          {category.shortDescription}
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => {
                // Categorize features for better visual grouping
                const isArchitecturalFeature = [
                  "Architecture", "Data Model", "Input Format", "Output Format", "Training Data"
                ].includes(feature);
                
                const isPerformanceFeature = [
                  "Startup Time", "Latency", "Performance", "Scalability", "Resource Efficiency"
                ].includes(feature);

                const isPricingFeature = [
                  "Pricing Model"
                ].includes(feature);

                let featureCategory = "";
                if (isArchitecturalFeature) featureCategory = "architectural";
                else if (isPerformanceFeature) featureCategory = "performance"; 
                else if (isPricingFeature) featureCategory = "pricing";

                const rowBg = index % 2 === 0 ? "bg-background" : "bg-muted/25";
                const solidRowBg = index % 2 === 0 ? "bg-background" : "bg-muted";

                return (
                  <tr key={feature} className={cn(
                    "border-b",
                    rowBg,
                    featureCategory === "architectural" && "border-l-4 border-l-blue-500",
                    featureCategory === "performance" && "border-l-4 border-l-green-500",
                    featureCategory === "pricing" && "border-l-4 border-l-orange-500"
                  )}>
                    <td className={cn("p-4 font-medium sticky left-0 z-[11] border-r border-border", solidRowBg)}>
                      <div className="flex items-center gap-2">
                        {featureCategory === "architectural" && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                        {featureCategory === "performance" && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                        {featureCategory === "pricing" && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                        {feature}
                      </div>
                    </td>
                    {categories.map(category => {
                      const value = category.conceptualFeatures[feature];
                      const displayValue = value !== undefined ? String(value) : "N/A";
                      
                      // Style based on content type
                      const isAdvantage = typeof value === "string" && (
                        value.includes("High") || 
                        value.includes("Fast") || 
                        value.includes("Low") && feature.includes("Complexity") ||
                        value.includes("Automatic") ||
                        value.includes("Fully managed")
                      );

                      const isChallenge = typeof value === "string" && (
                        value.includes("High") && (feature.includes("Complexity") || feature.includes("overhead")) ||
                        value.includes("Minutes") ||
                        value.includes("required")
                      );

                      return (
                        <td key={category.id} className="p-4 text-center">
                          <span className={cn(
                            "text-sm",
                            isAdvantage && "text-green-700 dark:text-green-400 font-medium",
                            isChallenge && "text-orange-700 dark:text-orange-400",
                            displayValue === "N/A" && "text-muted-foreground italic"
                          )}>
                            {displayValue}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Architectural Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Performance & Scaling</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span>Pricing Model</span>
        </div>
      </div>
    </div>
  );
}