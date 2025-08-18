import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

export default function NotFound() {
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
          <h1 className="text-3xl font-medium tracking-tight">Comparison Not Found</h1>
          <p className="text-muted-foreground mt-1">
            The requested service comparison could not be found.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-medium mb-4">Comparison Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The services or categories you&apos;re trying to compare don&apos;t exist or the URL format is invalid.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/compare">
              <Button>
                Start New Comparison
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}