"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import Image from 'next/image';
import Link from 'next/link';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

// Custom components to match fumadocs-ui features
const components = {
  // UI Components
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  
  // Next.js components
  Image,
  Link,
  
  // Custom elements  
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props}>
      <Pre>{children}</Pre>
    </CodeBlock>
  ),
  
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes('language-');
    
    if (isInline) {
      return (
        <code 
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border"
          {...props}
        >
          {children}
        </code>
      );
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // Table components
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
      <MDXRemote {...source} components={components} />
    </div>
  );
}