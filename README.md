# Implementing Cloud

> 🚧 **Work in Progress** - This platform is currently under active development.

A comprehensive platform for simplifying cloud adoption and learning, built with the [Magic UI Blog Template](https://github.com/magicuidesign/blog-template).

## About

Implementing Cloud is designed to help developers, teams, and organizations navigate the complex world of cloud computing with clarity and confidence. Our mission is to transform overwhelming cloud complexity into actionable insights and practical knowledge.

## Our Goals & Vision

🌐 **Service Exploration** - Discover and explore major cloud platforms with curated insights, detailed pricing information, and developer experience comparisons

📚 **Implementation Guides** - Access step-by-step tutorials covering setup, proof-of-concept development, deployment, and scaling with real-world examples

🤖 **AI Learning Made Simple** - Navigate the rapidly evolving AI landscape from basics to practical applications, covering everything from GPT vs Claude to RAG and multi-agent systems

⚖️ **Compare & Choose Wisely** - Make informed decisions with comprehensive pricing and feature comparisons across cloud services

📝 **Built-in Learning Tools** - Enhance your learning experience with integrated note-taking capabilities (press 'N' to create notes, highlight text for quick saves, use Ctrl+K to search)

## 🚀 Quick Start

```bash
# Clone the repository
git clone git@github.com:implementing-cloud/implementing.cloud.git
cd implementing.cloud

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

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

In the future, we will have our own CMS built with Directus to accommodate complex structures.

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

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[Fumadocs MDX](https://fumadocs.vercel.app/)** - MDX processing and components  
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Magic UI](https://magicui.design/)** - Beautiful UI components

Based on the [Magic UI Blog Template](https://github.com/magicuidesign/blog-template) - A modern, feature-rich blog template with excellent developer experience.

## 🤝 Contributing

We welcome contributions! This is an open-source project and we appreciate any help in making it better.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commit (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
