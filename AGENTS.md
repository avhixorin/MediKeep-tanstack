# MediKeep - TanStack Start Project

## Project Overview

MediKeep is a healthcare platform built with TanStack Start, React, and Tailwind CSS. It provides AI-driven healthcare features including patient-doctor communication, health records management, appointments, and real-time chat.

## Architecture

### Technology Stack
- **Framework**: TanStack Start (React + TanStack Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui components
- **Animation**: Framer Motion
- **Database**: Drizzle ORM with PostgreSQL
- **Package Manager**: Bun

### Project Structure
```
src/
├── components/
│   ├── landing-page/      # Landing page sections
│   │   ├── Hero-section/
│   │   ├── About/
│   │   ├── Features/
│   │   ├── Benefits/
│   │   ├── Pricing/
│   │   ├── ContactUs/
│   │   ├── Footer/
│   │   └── Navbar/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Dashboard layout components
├── routes/                # TanStack Router file-based routes
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state stores
├── lib/                   # Utility functions
├── db/                    # Database schema and connection
├── styles/                # Global CSS styles
└── constants/             # App constants
```

## Development Guidelines

### Running the App
```bash
bun install
bun --bun run dev
```

### Available Scripts
- `bun --bun run dev` - Start development server on port 3000
- `bun --bun run build` - Build for production
- `bun --bun run test` - Run Vitest tests
- `bun --bun run lint` - Run ESLint
- `bun --bun run format` - Format with Prettier

### Styling Conventions
- Uses Tailwind CSS v4 with `@theme inline` syntax
- Custom CSS variables defined in `src/styles/styles.css`
- Color scheme based on healthcare/medical theme (teals, greens, soft whites)
- Body has custom gradient background that should be visible through sections

### Component Patterns
- Landing page sections are self-contained components
- Dashboard uses layout component at `routes/dashboard/__layout.tsx`
- Admin routes use separate layout at `routes/admin/__layout.tsx`
- Framer Motion used for scroll-triggered animations (`whileInView`)

### Route Structure
- `/` - Landing page (Hero, About, Features, Benefits, Pricing, Contact, Footer)
- `/login`, `/register`, `/forgot-password` - Auth pages
- `/dashboard/*` - Patient dashboard (appointments, records, chat, profile)
- `/admin/*` - Admin panel (patients, doctors, appointments, users)

### Important Notes

#### Landing Page Background Issue (CRITICAL)
The landing page wrapper in `src/routes/index.tsx` uses `bg-background` class which gives a solid white background that hides the body's beautiful gradient. Hero and other sections should either:
- Be transparent (`bg-transparent`) to show body gradient, OR
- Use `bg-background/80` with `backdrop-blur` for glass effect

The Hero section currently has NO explicit background, so it inherits the white background from the parent wrapper, completely hiding the intended gradient design.

#### CSS Variables
Key color variables in `src/styles/styles.css`:
- `--background`: White in light mode, dark in dark mode (oklch values)
- `--foreground`: Text color (near-black in light mode)
- `--muted`: Secondary background
- `--primary`, `--secondary`: Accent colors
- Custom theme vars: `--sea-ink`, `--lagoon`, `--sand`, `--foam`

#### Responsive Breakpoints
- Mobile: Default
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

### Dependencies to Know
- `@tanstack/react-router` - File-based routing
- `@tanstack/react-start` - Full-stack framework
- `framer-motion` - Animations
- `lucide-react` - Icons
- `zustand` - State management
- `drizzle-orm` - Database ORM
- `socket.io-client` - Real-time communication
- `@emailjs/browser` - Email functionality

### Database
- Uses Drizzle ORM with PostgreSQL
- Schema defined in `src/db/schema.ts`
- Migrations via `drizzle-kit`

## Common Issues & Solutions

### Landing Page Content Not Visible
If the landing page shows only the navbar with empty white space below:
- Check that sections have explicit background colors OR are transparent
- Hero section should use `bg-transparent` or remove inherited white background
- The wrapper div in `index.tsx` with `bg-background` creates solid white overlay

### Animation Performance
- Use `will-change-transform` on animated elements
- Prefer `transform` and `opacity` for animations (GPU accelerated)
- Use `layoutId` sparingly for shared layout animations

### Mobile Navigation
- Uses Sheet component for mobile menu
- `use-mobile.ts` hook detects mobile viewport

## External Resources
- Images hosted on Cloudinary
- Fonts: Manrope (sans), Fraunces (display) from Google Fonts
