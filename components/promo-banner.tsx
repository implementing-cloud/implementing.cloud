import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {CloudList3D} from "@/components/promo-banner/cloud-list"
import { BrainCircuitIcon, CloudIcon, HandshakeIcon, ScaleIcon } from "lucide-react";


const features = [
  {
    Icon: CloudIcon,
    name: "Service to explore",
    description: "Explore all major platforms with curated uniqueness, pricing and DX. No vague summary",
    href: "/",
    cta: "Learn more",
    background: <CloudList3D />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Implementation Guides",
    description: "Step-by-step tutorials on how to set up, PoC, deploy, and scale with real-world examples",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: BrainCircuitIcon,
    name: "Learn AI, From Basics to Practical",
    description: "From being a AI user, work with AI to build AI.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ScaleIcon,
    name: "Compare Pricing & Features",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
  {
    Icon: HandshakeIcon,
    name: "Contribute & Support",
    description: "Share your experiences, request reviews, or support the project with a donation.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
];

export function PromoBanner() {
  return (
    <div className="max-w-7xl mx-auto w-full px-6 lg:px-4 py-8">
      <BentoGrid className="lg:grid-rows-2">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
