import Image from "next/image";

interface Step {
  title: string;
  description: string;
  imageUrl: string;
}

const steps: Step[] = [
  {
    title: "Explore",
    description: "Look for one category, service, or topic that interests you most",
    imageUrl: "https://picsum.photos/400/300?random=1"
  },
  {
    title: "Compare",
    description: "Check features, ease of setup and use, and last but not least, pricing. Make a note of what concerns you",
    imageUrl: "https://picsum.photos/400/300?random=2"
  },
  {
    title: "Implement",
    description: "Get hands-on with what you decide using our getting started guide and real-world implementation examples",
    imageUrl: "https://picsum.photos/400/300?random=3"
  },
  {
    title: "Decide",
    description: "Generate what you've already tried and learned as an Architecture Decision Record with diagrams for implementation. You can return here to refresh or revise decisions in the future and share with your team how it looks.",
    imageUrl: "https://picsum.photos/400/300?random=4"
  }
];

export function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 lg:px-4 py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-medium tracking-tight text-center">How it works</h2>
      </div>
      
      <div className="space-y-16">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col lg:flex-row lg:items-start items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative w-full h-64 lg:aspect-[4/3] lg:h-auto rounded-lg overflow-hidden border border-border">
                <Image
                  src={step.imageUrl}
                  alt={`${step.title} illustration`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}