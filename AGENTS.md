# LearNexo Frontend

React 19 + TypeScript + Vite 6 SPA. Deployed to Vercel. No backend in this repo — talks to a separate service.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — runs `tsc -b` (project-references typecheck) **then** `vite build`. This is the only typecheck; there is no `typecheck` script.
- `npm run lint` — `eslint .` (flat config; `react-hooks/rules-of-hooks` is **disabled** in `eslint.config.js:22`, do not re-enable without checking the codebase)
- `npm run preview` — serve the built bundle

There are **no tests** and no test runner configured. Don't add test commands without confirming the stack first.

Both `package-lock.json` and `pnpm-lock.yaml` are checked in. Pick one manager; the project was last installed with pnpm but npm works fine.

## Verification order

When asked to "verify", run in this order: `npm run lint` → `npm run build`. The build step is what surfaces type errors (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly` are all on — unused imports/vars break the build).

## Environment

- `.env` is gitignored. Locally it contains `VITE_API_BASE_URL=https://learnexo-backend.onrender.com`. Read with `import.meta.env.VITE_*`, **not** `process.env`.
- `src/lib/utils.ts` and `src/components/config.ts` still contain `process.env.NODE_ENV` / `process.env.VERCEL_PROJECT_PRODUCTION_URL` / `process.env.NEXT_PUBLIC_APP_URL!` — leftover Next.js code. `absoluteUrl()` in `utils.ts` and `config.appUrl` are not called anywhere; do not add new callers until the code is ported to Vite env.

## Architecture

- Entry: `src/main.tsx` → `src/App.tsx` → `src/routes/index.tsx` (BrowserRouter).
- Routes are split per feature: `src/routes/OnboardingRoutes.tsx`, `src/routes/DashboardRoutes.tsx` (function name is `MainRoutes`), `src/routes/AssessmentRoutes.tsx`. `src/routes/ProtectedRoutes.tsx` is an **empty file** — auth guarding is currently a no-op.
- `src/App.tsx` triggers a geolocation + Nominatim reverse-geocode fetch on mount. Don't remove without checking with the team.
- `src/index.css` is empty; all global styles live in `src/App.css` (Tailwind v4 `@theme` block defines the design tokens).
- `src/archive/` contains stale code with `T`-suffixed filenames (e.g. `SignUpT.tsx`). It's not wired into the app. Do not import from it.

## Path alias

`@` → `./src`. Configured in **both** `vite.config.ts` and `tsconfig.json` / `tsconfig.app.json`. Existing code mixes `@/` and relative imports — match the convention of the file you're editing.

## API / data layer

There are two coexisting fetch helpers:
- `src/services/api.ts` → `makeRequest(path, method, data?)`. Preferred for new code. Handles `427` responses by calling `/auth/refresh-session` once, then retrying. Reads token from `sessionStorage` key `accessToken`.
- `src/utils/hooks/useRequest.tsx` → older helper used by `src/utils/queries/*`. No refresh logic, throws on non-2xx.

Token storage helpers live in `src/utils/session.ts` (`getSessionStorage` / `setSessionStorage` / `getLocalStorage` / `setLocalStorage` — note the values are JSON-serialized, not raw strings).

Server state: TanStack Query (`QueryClient` instantiated in `App.tsx`).
Forms: `useAppForm` from `@tanstack/react-form`, wired up in `src/services/form.ts` with custom field components from `src/components/ui/form/`.

## UI stack

- Tailwind **v4** via `@tailwindcss/vite` (no `tailwind.config.*` — config is in `src/App.css` via `@theme`). Don't add a v3-style config.
- shadcn/ui, `new-york` style, `slate` base, `lucide` icons — see `components.json`. Generate new UI with the shadcn CLI in that style.
- Toasts: **`sonner`** (`<Toaster />` in `App.tsx`). `react-hot-toast` is in `package.json` but unused — do not use it.
- `axios` is in `package.json` but unused — fetch only.

## React quirks

- `main.tsx` ships with `<StrictMode>` **commented out**. Don't silently re-enable — it will double-fire the geolocation effect and unmount/reflow the auth flow. Confirm with the user first.
- `react-hooks/rules-of-hooks` is disabled in ESLint; lint will not catch hook-order violations. Be careful with conditional hooks.

## Conventions

- Component filenames are PascalCase (`AppSidebar.tsx`); utility files are lowercase (`utils.ts`, `session.ts`).
- Page components live under `src/pages/<feature>/`. Layouts in `src/layouts/`. Shared UI primitives in `src/components/ui/`. Cross-cutting utilities in `src/utils/`. Network code in `src/services/`.
- No comments in code unless the file already has them or the user asks (project rule).
- TypeScript strict; unused locals/params fail the build — clean them up rather than `// @ts-ignore`-ing.
