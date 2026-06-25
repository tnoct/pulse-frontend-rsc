# Pulse Frontend

An interactive project analytics dashboard built with React 19, Vite, Framer Motion, GSAP, and Tailwind CSS. It fetches live project metrics from the Pulse backend and presents them through animated KPI counters, SVG performance rings, a grid/list view toggle with layout morphing, and a shared-layout card-to-modal expansion.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/) or npm
- Pulse backend running at `http://localhost:4004` — see [pulse-backend-nsc](../pulse-backend-nsc/README.md)

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Start the development server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`. API calls to `/api/*` are proxied to the backend at `http://localhost:4004`.

### 3. Production build

```bash
npm run build
npm run serve
```

## Project Structure

```
src/
├── api/              # Fetch wrappers (metrics.ts)
├── types/            # Shared TypeScript interfaces
├── hooks/            # Data-fetching hooks (useMetrics)
├── lib/              # Framer Motion variant presets
├── components/
│   ├── layout/       # Sidebar, TopNav
│   ├── cards/        # ProjectCard, ProjectModal
│   ├── kpi/          # KpiCounter (GSAP tween)
│   ├── charts/       # PerformanceRing (SVG + GSAP)
│   └── ui/           # StatusBadge, ViewToggle
└── pages/            # Dashboard page
```

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start dev server with HMR            |
| `npm run build`    | Type-check and build for production  |
| `npm run serve`    | Preview the production build         |
| `npm run lint`     | Run ESLint                           |
| `npm run format`   | Format source files with Prettier    |

## Animation Architecture

GSAP tweens are initialised inside `useEffect` with the returned `tween.kill()` as the cleanup, so no timeline leaks across re-renders. Framer Motion layout animations are scoped to each card via `layoutId`, keeping them isolated and preventing the parent container from triggering unnecessary re-renders on sibling components. The React Compiler (Babel plugin) handles memoisation automatically, so component subtrees that don't receive new props are skipped entirely during animation-driven state updates.
