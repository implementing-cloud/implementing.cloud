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
                <th className="text-left p-4 font-medium sticky left-0 top-0 bg-muted min-w-[200px] z-[12] border-r border-border">
                  Features
                </th>
                {services.map(service => (
                  <th key={service.id} className="text-center p-4 font-medium min-w-[200px] sticky top-0 bg-muted z-[11]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{service.logo}</span>
                      <span className="text-sm">{service.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => {
                const rowBg = index % 2 === 0 ? "bg-background" : "bg-muted/25";
                const solidRowBg = index % 2 === 0 ? "bg-background" : "bg-muted";
                
                return (
                  <tr key={feature} className={cn("border-b", rowBg)}>
                    <td className={cn("p-4 font-medium sticky left-0 z-[11] border-r border-border", solidRowBg)}>
                      {feature}
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}