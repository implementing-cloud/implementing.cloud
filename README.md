# Implementing Cloud

Implementing Cloud is a platform dedicated to simplifying the way individuals and teams design, build, and operate in the cloud. Our goal is to remove unnecessary complexity from cloud adoption—whether you’re a solo developer experimenting with ideas, a startup scaling fast, or an enterprise looking for efficiency and best practices.

At its core, Implementing Cloud helps you:

1. Design smarter architectures – We provide guided workflows and templates that let you generate cloud architectures tailored to your needs.
2. Automate infrastructure – With Infrastructure as Code (IaC) support, we turn your designs into ready-to-deploy configurations using Terraform, CLI scripts, or native tools.
3. Estimate and optimize costs – We show real-time pricing insights so you can balance performance and budget.
4. Manage cloud services – Through a central dashboard, you can explore, compare, and manage services across providers like Azure, AWS, GCP, and more.
5. Collaborate and learn – Implementing Cloud isn’t just a tool; it’s a growing library of best practices, comparisons, and insights that developers, engineers, and businesses can learn from.

## Our Vision

Cloud technology should empower builders, not overwhelm them. Today, choosing the right services, architectures, and deployment methods can feel like a maze. Implementing Cloud is here to turn that complexity into clarity—so you can focus on creating, not configuring.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm dev

# Build for production
npm build
```

## ✍️ Adding Blog Posts

Create a new MDX file in `blog/content/` with format `your-post-title.mdx`:

````mdx
---
title: "Your Blog Post Title"
description: "A brief description of your post"
date: "2024-12-01"
tags: ["React", "Next.js", "Tutorial"]
featured: true
readTime: "10 min read"
author: "Your Name"
---

Your blog post content here...

## Markdown Support

You can use all standard Markdown features plus MDX components.

```tsx
// Code syntax highlighting works great!
export default function Component() {
  return <div>Hello World!</div>;
}
```
````

## 🎨 Customization

### Adding New Tags/Categories

Simply add them to your blog post frontmatter. The system automatically generates tag pages.

### Featured Posts

Set `featured: true` in your blog post frontmatter to highlight it on the homepage (you can create a dedicated feature section in the home page).

### Styling

The project uses Tailwind CSS with a custom design system. Modify styles in:

- `app/globals.css` - Global styles
- Individual component files - Component-specific styles

### For Authors

Add your author details to the `lib/authors.ts` file.

```tsx
// lib/authors.ts
export const authors: Record<string, Author> = {
  dillion: {
    name: "Dillion Verma",
    position: "Software Engineer",
    avatar: "/authors/dillion.png",
  },
  arghya: {
    name: "Arghya Das",
    position: "Design System Engineer",
    avatar: "/authors/arghya.png",
  },
  // Add your author details here
  yourname: {
    name: "Your Full Name",
    position: "Your Position/Title",
    avatar: "/authors/your-avatar.png",
  },
} as const;
```

Then reference your author in blog posts using the key (e.g., `author: "yourname"`).

## ✨ Features

### Interactive Mobile Promo Banner
The platform includes a responsive promotional banner that adapts to provide optimal user experience across devices:

- **Desktop**: Traditional bento-style grid layout with full feature cards
- **Mobile**: Interactive layout with highlighted feature + 2x2 grid of compact cards
- **Auto-rotation**: Featured content cycles every 5 seconds
- **Tap-to-explore**: Users can tap any grid card to bring it to the highlighted position
- **Smooth transitions**: Elegant fade animations between content changes

Perfect for showcasing key platform features without overwhelming mobile users with excessive scrolling.

📖 [Learn more about the Mobile Promo Banner](./docs/mobile-promo-banner.md)

## 📖 Technologies Used

- **Next.js 15** - React framework with App Router
- **Fumadocs MDX** - MDX processing and components
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Geist Font** - Modern typography

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
