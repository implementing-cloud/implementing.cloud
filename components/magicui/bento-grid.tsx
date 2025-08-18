import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  shortName?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // Enhanced elevation and contrast
      "bg-white border border-gray-200/60",
      // Stronger shadows for better elevation
      "[box-shadow:0_2px_8px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.12),0_1px_0px_rgba(255,255,255,0.05)_inset]",
      // Hover state with stronger elevation
      "hover:[box-shadow:0_8px_32px_rgba(0,0,0,.15),0_16px_48px_rgba(0,0,0,.20)]",
      "hover:scale-[1.02] transition-all duration-300 ease-out",
      // Dark mode with enhanced contrast
      "dark:bg-gray-900/90 dark:border-gray-700/50",
      "dark:[box-shadow:0_2px_8px_rgba(0,0,0,.3),0_8px_24px_rgba(0,0,0,.4),0_1px_0px_rgba(255,255,255,0.1)_inset]",
      "dark:hover:[box-shadow:0_8px_32px_rgba(0,0,0,.5),0_16px_48px_rgba(0,0,0,.6)]",
      // Better backdrop
      "backdrop-blur-sm",
      className,
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h3>
        <p className="max-w-lg text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      <div
        className={cn(
          "lg:hidden pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "hidden lg:flex pointer-events-none absolute bottom-0 w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="pointer-events-auto p-0"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
