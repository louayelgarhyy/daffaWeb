# DAFFAfor Abayat - Elegant Modest Fashion

E-commerce website for premium abayas combining traditional modesty with modern sophistication.

## Features

- Browse elegant abaya collections
- Product detail pages with image galleries
- Shopping cart functionality
- Responsive design with mobile-first approach
- Dark mode support
- Smooth scroll animations and interactive UI elements
- Custom cursor effect (desktop only)

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **shadcn/ui** - Component library (52+ components)
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **React Router DOM** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- Alternatively, you can use [Bun](https://bun.sh/) as the package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abaya-elegance-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

```bash
npm run dev          # Start development server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── products/        # Product-specific components
│   └── ui/              # shadcn/ui components (52 components)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Route pages
├── App.tsx              # Root application component
├── main.tsx             # React entry point
└── index.css            # Global styles & design system
```

## Development

### Path Aliases

The project uses `@/` as a path alias for the `src/` directory:

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Design System

All colors are defined as HSL values in CSS variables in `src/index.css`. The design system includes:

- **Primary Color:** Teal-gray (#446871)
- **Accent Color:** Pink (#AB004F)
- Complete dark mode theme
- Consistent spacing and typography

### Adding UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add <component-name>
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

The production build can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server serving static files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved.

## Lovable Integration

This project was originally created with [Lovable](https://lovable.dev) and maintains integration for AI-assisted development.

### Editing via Lovable

- **Project URL:** https://lovable.dev/projects/5275f443-aee7-435f-aabf-b484ef43a523
- Use the Lovable dashboard to make AI-assisted changes
- Changes pushed to GitHub will sync back to Lovable automatically

### How It Works

The project uses `lovable-tagger` plugin in development mode to tag React components, enabling Lovable to understand and modify your component structure intelligently.
