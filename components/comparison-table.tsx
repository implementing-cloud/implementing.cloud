import React from "react";
import { cn } from "@/lib/utils";
import { type Service } from "@/lib/comparison-data";

interface ComparisonTableProps {
  services: Service[];
  onBackToSelection: () => void;
  title?: string;
  description?: string;
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
                      <td className={cn("p-4 font-medium sticky left-0 z-[11] border-border")}>
                        {feature}
                      </td>
                      {services.slice(1).map((service, serviceIndex) => (
                        <td key={`${feature}-empty-${service.id || serviceIndex}`} className="p-4 text-center">
                        </td>
                      ))}
                    </tr>
                    {/* Feature values row */}
                    <tr key={`${feature}-values`} className={cn("border-b bg-muted/25")}>
                      {services.map(service => (
                        <td key={service.id} className="p-4 text-center">
                          <span className="text-sm">
                            {service.features[feature] !== undefined 
                              ? String(service.features[feature]) 
                              : "N/A"
                            }
                          </span>
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