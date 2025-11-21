# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce website for modest fashion (Daffa for Abayat) built with:
- **React 18.3** + **TypeScript 5.8** + **Vite**
- **shadcn/ui** (52 components) built on Radix UI
- **Tailwind CSS** with custom design system
- **TanStack Query** for server state (ready for API integration)
- **React Router DOM** for client-side routing

## Quick Start

```bash
npm run dev          # Start dev server on http://localhost:8080 (NOT 5173!)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

**Important:** Dev server runs on port **8080**, not the Vite default 5173.

## Architecture Overview

### Directory Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── products/        # ProductCard and product-specific components
│   └── ui/              # shadcn/ui components (52 components - managed by CLI)
├── hooks/               # Custom React hooks (use-mobile, use-scroll-animation, etc.)
├── lib/                 # Utility functions (cn() helper for className merging)
├── pages/               # Route pages (Home, Shop, ProductDetail, Cart, etc.)
├── App.tsx              # Root with QueryClientProvider
├── main.tsx             # React entry point
└── index.css            # Global styles & design system variables
```

### Path Aliases

All imports use `@/` prefix mapping to `./src/`:
```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
```

### Routing Pattern

Client-side routing with React Router:
- `/` - Home page with hero carousel and featured products
- `/shop` - Product grid
- `/product/:id` - Product details (placeholder, needs implementation)
- `/cart` - Shopping cart (placeholder, needs implementation)
- `/collections`, `/about`, `/contact` - Currently show NotFound

Layout uses persistent Header/Footer with `min-h-screen` flex pattern.

## Design System (CRITICAL)

### Color System Rules

**All colors MUST be HSL format** and defined as CSS variables in `src/index.css`.

```css
/* Example from index.css */
--primary: 195 30% 35%;        /* #446871 - Teal-gray brand */
--accent: 334 100% 34%;        /* #AB004F - Pink accent */
```

**Never use hex or rgb directly in components.** Always use semantic tokens:
```tsx
// ✅ CORRECT
<div className="bg-primary text-primary-foreground">

// ❌ WRONG
<div className="bg-[#446871]">
```

### Brand Colors

- **Primary:** HSL(195, 30%, 35%) - Teal-gray (#446871)
- **Accent:** HSL(334, 100%, 34%) - Pink (#AB004F)
- **Success:** HSL(110, 47%, 55%) - Green (#6BC45A)
- **Destructive:** HSL(358, 100%, 65%) - Red (#FF4E54)

### Dark Mode

Complete dark theme via `.dark` class (next-themes). All colors have dark mode variants defined in CSS variables.

## Component Patterns

### shadcn/ui Components

52 UI components available in `src/components/ui/`. Use shadcn CLI to add new ones:
```bash
npx shadcn@latest add <component-name>
```

Components are configured with path aliases in `components.json`.

### cn() Helper Pattern

Used throughout for conditional className merging:
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-variant"
)} />
```

### Mobile-First Responsive

Always use `useIsMobile` hook for JS-based responsive behavior:
```typescript
import { useIsMobile } from "@/hooks/use-mobile"

const isMobile = useIsMobile()
// Desktop-only custom cursor disabled on mobile
```

Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)

### Animation Patterns

**Scroll Animations:**
```typescript
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const ref = useScrollAnimation()
return <div ref={ref} className="opacity-0 translate-y-4" />
// Automatically adds: opacity-100, translate-y-0, transition-all
```

**Staggered Grid Animations:**
```typescript
products.map((product, index) => (
  <ProductCard
    key={product.id}
    delay={index * 100}  // Stagger by 100ms
  />
))
```

**Common Animation Pattern:** Transform + opacity with transitions
- Entry: `opacity-0 translate-y-4` → `opacity-100 translate-y-0`
- Duration: `duration-700` or `duration-1000`
- Easing: `ease-out`

## Code Conventions

### TypeScript Configuration

Relaxed strictness settings:
- `noImplicitAny: false` - Implicit any allowed
- `noUnusedParameters: false` - Unused params allowed
- `noUnusedLocals: false` - Unused variables allowed
- `strictNullChecks: false` - Null checks not enforced

ESLint also has `@typescript-eslint/no-unused-vars` disabled.

### Component Structure

- **Functional components** with hooks only (no class components)
- **Pages** go in `src/pages/`
- **Reusable components** in `src/components/` with domain folders (layout/, products/)
- **Custom hooks** in `src/hooks/`
- **Utilities** in `src/lib/`

### State Management

- **TanStack Query** for server state (QueryClientProvider in App.tsx)
- **useState** for local component state
- **No global state library** (Redux, Zustand) - currently using mock data
- **React Hook Form + Zod** available for forms/validation

## Important Gotchas

1. **Port 8080:** Dev server runs on port 8080, not Vite's default 5173
2. **Custom Cursor:** Desktop-only feature (disabled on mobile via useIsMobile check)
3. **Mock Data:** Products currently hardcoded in pages - no backend API yet
4. **Placeholder Routes:** ProductDetail and Cart pages exist but need full implementation
5. **shadcn/ui Management:** Don't manually edit `src/components/ui/` - use shadcn CLI
6. **HSL Colors:** Always use HSL format in CSS variables, never hardcode colors

## Current State & Future Development

### Implemented
- Home page with hero carousel and featured products
- Shop page with product grid
- Header with mobile menu (Sheet component)
- Footer
- ProductCard component
- Custom animations (scroll, stagger, custom cursor)
- Complete design system with dark mode

### Needs Implementation
- ProductDetail page logic
- Cart state management and functionality
- Search functionality
- Wishlist feature
- User authentication system
- Backend API integration (TanStack Query ready)
- About, Contact pages (currently 404)

### Product Data Schema

Current mock data structure:
```typescript
{
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
}
```

When implementing API, maintain this schema or update all ProductCard usages.

## File Organization Quick Reference

- **New page component** → `src/pages/PageName.tsx` + add route to App.tsx
- **New reusable component** → `src/components/domain/ComponentName.tsx`
- **New UI component** → Use `npx shadcn@latest add component-name`
- **New custom hook** → `src/hooks/use-hook-name.tsx`
- **New utility** → `src/lib/utils.ts` or new file in `src/lib/`
- **Global styles** → `src/index.css` (design system variables)
- **Component styles** → Inline Tailwind classes (utility-first approach)

## Key Libraries Reference

- **UI Components:** Radix UI primitives via shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Dates:** date-fns
- **Toasts:** Sonner
- **Carousel:** Embla Carousel
- **Charts:** Recharts (available but not yet used)
- **Class Management:** clsx + tailwind-merge (via cn())
- **Variants:** class-variance-authority
