# StayElite - Next.js 14 Project Setup Guide

## Project Overview
StayElite is a premium accommodation booking platform built with Next.js 14, TypeScript, Tailwind CSS, and modern development tools.

## Setup Commands

### 1. Create Next.js Project with TypeScript & Tailwind
```bash
npx create-next-app@latest stayelite --typescript --tailwind --app --eslint --import-alias "@/*" --use-npm --no-git
```

### 2. Install Additional Dependencies
```bash
cd stayelite
npm install axios zustand @tanstack/react-query react-hook-form zod
```

### 3. Initialize shadcn/ui Components
```bash
npx shadcn@latest init -d
```

## Final Folder Structure

```
stayelite/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with header/footer
│   ├── page.tsx                 # Home page with hero & search
│   └── globals.css              # Global styles & theme
├── components/
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       └── [other components]
├── hooks/                       # Custom React hooks
│   └── usePagination.ts         # Pagination logic example
├── lib/                         # Utilities and helpers
│   └── utils.ts                 # Shared utilities
├── public/                      # Static assets
├── services/                    # API call functions
│   └── apiClient.ts             # Axios instance with interceptors
├── store/                       # Zustand global state
│   └── useStayEliteStore.ts     # App-wide state management
├── types/                       # TypeScript interfaces
│   └── index.ts                 # Type definitions
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── components.json              # shadcn/ui configuration
└── package.json                 # Dependencies
```

## Key Technologies

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Static typing for JavaScript

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- Custom color palette with Airbnb-inspired rose/red primary and neutral grays

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client for API calls

### Form Handling & Validation
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting
- **Tailwind CSS** - Responsive design

## Custom Color Palette

### Primary Color (Rose/Red - Airbnb Style)
```
primary-50:  #fef2f2
primary-500: #ef4444  (Main)
primary-600: #dc2626
primary-900: #7f1d1d
```

### Secondary Color (Warm Accent)
```
secondary-500: #ff7700
secondary-600: #e55a00
```

### Neutral Colors (Grays)
```
neutral-50:   #fafafa
neutral-100:  #f5f5f5
neutral-500:  #9e9e9e
neutral-900:  #212121
```

## Key Files Explained

### `tailwind.config.ts`
Defines the custom color palette and theme extensions for StayElite branding.

### `app/globals.css`
- Global styling with custom CSS variables
- Base typography and spacing
- Light and dark mode theme definitions
- Tailwind v4 theme configuration

### `app/layout.tsx`
- Root layout component
- Sticky header with navigation
- Main content wrapper with max-width constraints
- Footer with multiple sections

### `store/useStayEliteStore.ts`
Zustand store for managing:
- Favorite properties
- User preferences
- Global app state

### `services/apiClient.ts`
Axios client with:
- Interceptors for authentication
- Pre-configured endpoints for properties and bookings
- Error handling (auto-logout on 401)

### `types/index.ts`
TypeScript interfaces for:
- User
- Property
- Booking
- Review
- SearchFilters
- PaginatedResponse

### `hooks/usePagination.ts`
Custom hook for pagination logic with support for:
- Current page tracking
- Page size configuration
- Navigation (next/prev/goto)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Add shadcn component (example)
npx shadcn@latest add button
```

## Project Features

### Homepage
- Hero section with search form
- Featured properties grid with ratings
- Call-to-action section for hosts
- Responsive design (mobile, tablet, desktop)

### Styling Features
- Sticky header navigation
- Dark/light mode support via CSS variables
- Responsive grid layouts
- Smooth transitions and hover effects
- Accessible color contrast

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

4. **Add components as needed:**
   ```bash
   npx shadcn@latest add button input select
   ```

## Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=https://api.stayelite.com
```

## Next Steps

1. Create API routes in `app/api/`
2. Build property listing pages
3. Implement booking flow with React Query
4. Add authentication
5. Deploy to Vercel
