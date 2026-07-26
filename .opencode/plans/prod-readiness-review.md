# LearNexo Frontend — Production Readiness Review & Action Plan

## Executive Summary
The app is functional and well-architected (React 19 + Vite + TanStack Query + shadcn/ui) but has **critical data bugs**, **significant dead UI**, and **missing dark-mode infrastructure** that must be addressed before going to production.

---

## Critical Bugs (Block Production)

### 1. "Question not found" in Report Corrections
**Root Cause:** The backend `Assessment` model stores `submittedAnswers` as `{questionId, selected, isCorrect}` only. The `/assessment/:id/report` endpoint does **not** populate the actual question text, options, or explanation when building `corrections`. It sends `"Question not found"` as a fallback.

**Evidence:**
- Frontend expects `CorrectionItem.question` (`src/utils/queries/reports.ts:22`)
- Backend `assessment.model.ts` line 145-156: `submittedAnswers` has no `question` field
- User screenshot confirms `Q1. Question not found` with empty `Correct answer:`

**Fix Options:**
- **Option A (Preferred):** Backend fix. In the report controller, when building `corrections`, look up each `questionId` from the `AssessmentQuestion` collection and attach `question`, `options`, `answer`, `explanation`.
- **Option B:** Frontend fix. After fetching the report, if `correction.question === "Question not found"`, make a secondary API call to fetch the full questions for that assessment and merge them by `questionId`.

### 2. PDF Generation Cuts Off Content (Single Page Only)
**Root Cause:** `ReportDetail.tsx` uses `html2canvas` to capture the entire report DOM as **one image**, then `jsPDF.addImage()` places it on a single A4 page. If the report is long (many corrections + recommendations), anything below the A4 height is lost.

**Evidence:**
- `src/pages/reports/ReportDetail.tsx:38-43`: Single canvas → single `pdf.addImage()` call
- User explicitly states "corrections and some part of recommendations is not showing on the pdf"

**Fix:** Implement multi-page PDF by tiling the canvas into A4-height chunks:
```typescript
const imgWidth = pdfWidth;
const imgHeight = (canvas.height * imgWidth) / canvas.width;
let heightLeft = imgHeight;
let position = 0;

pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
heightLeft -= pdfHeight;

while (heightLeft > 0) {
  position = heightLeft - imgHeight;
  pdf.addPage();
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;
}
```

---

## Unused / Empty / Redundant Items to Remove

### Dead Files
| File | Action |
|------|--------|
| `src/routes/ProtectedRoutes.tsx` | **Delete** — empty file (0 bytes) |
| `src/archive/` | **Delete entire folder** — stale code not wired into app |
| `src/index.css` | **Delete** — empty file; global styles live in `App.css` |

### Sidebar Dead Links (`src/components/app-sidebar.tsx`)
These items have `url: "#"` and go nowhere:
- **Notifications** — no notifications system exists
- **Quizzes** — no quizzes page exists (only "Assessment")
- **Instructors** — no instructors feature
- **Support** — no support page
- **Settings** — no settings page

**Action:** Remove or comment out these nav items until the features are built.

### Non-Functional Dashboard Components
| Component | Issue | Action |
|-----------|-------|--------|
| `VerticalDropdown` (`src/components/ui/dashboard/VerticalDropdown.tsx`) | All dropdown content is commented out. Just renders a useless ellipsis icon. | **Remove** the dropdown from `MetricBento` until it has actual actions |
| `ActivitiesTable` hardcoded Math tab | The "Mathematics" tab always shows `content: null` (line 55-56) | Either wire to real API or remove the Math tab until data exists |
| `MetricBento` static values | "Practice 5 questions today", "0", "0" are all hardcoded | Wire to real user data or show dynamic placeholders |
| `activityFeed` | Static mock data from `utils/lib/dashboard.ts` | Replace with real activity from API, or remove the Activities section |
| `SubjectRecommendation` cards | Hardcoded math/english links | Make dynamic based on user's class/subjects |

### Unused Dependencies
| Package | Status | Action |
|---------|--------|--------|
| `react-hot-toast` | In `package.json` but never imported; `sonner` is used everywhere | **Remove** from dependencies |
| `axios` | In `package.json` but never used; `fetch` via `makeRequest` is used | **Remove** from dependencies |
| `react-hook-form` | Only used in `Profile.tsx`; rest of app uses `@tanstack/react-form` | Keep for now (Profile uses it), but consider migrating Profile to `useAppForm` for consistency |

---

## Dark Theme Infrastructure (Missing)

**Current State:**
- `next-themes` is installed and imported in `sonner.tsx` (`useTheme()`)
- **No `<ThemeProvider>`** is mounted anywhere in the React tree
- `App.css` `@theme` block has **zero dark color tokens**
- shadcn/ui components have `dark:` Tailwind classes that never activate

**What "the popular toggle UI thingy" means:**
The standard modern pattern is a sun/moon icon toggle (usually in the header/nav) that switches between light/dark/system, with a smooth CSS transition.

**Implementation Plan:**
1. **Add dark tokens to `App.css`**:
   ```css
   @theme {
     --color-dark-bg: #0a0a0f;
     --color-dark-surface: #12121a;
     --color-dark-border: #1e1e2e;
     --color-dark-text: #e2e2ea;
     --color-dark-muted: #a0a0b0;
   }
   ```
2. **Wrap app in `ThemeProvider`** in `main.tsx` or `App.tsx`
3. **Create `ThemeToggle` component** (sun/moon icons from lucide-react) and place it in the `Header` component
4. **Audit all hardcoded `bg-white`, `text-slate-900`, `border-slate-200`** styles across pages and make them theme-aware using `dark:bg-dark-surface dark:text-dark-text` etc.
5. **Priority pages to theme first:** Dashboard, Reports, Assessment, Profile (these are the main user-facing pages)

---

## Dashboard Improvements

### Current Pain Points
- **Static data everywhere** — no real metrics from API
- **Misleading zeros** — "courses in progress: 0", "assessment quest: 0" look broken
- **Hardcoded subject cards** — always shows Math & English regardless of user's class
- **Activities table** — only English tab works; Math tab is always empty
- **Activity feed** — fake static data

### Recommended Changes
1. **Wire metrics to real APIs**:
   - `courses in progress` → `GET /assessment/courses` count
   - `assessment quest` → `GET /assessment/history` count
   - `today's goal` → Could be computed from streak/last assessment date
2. **Subject Recommendations**: Use the assessment catalog API (`/assessment/catalog/:class/subjects`) to show the user's actual enrolled class subjects, not hardcoded math/english.
3. **Activities Table**: Remove the hardcoded "Mathematics" tab until the backend provides cross-subject recommendations. Or rename tabs to be subject-agnostic.
4. **Activity Feed**: Remove the static `activityFeed` mock data. Either:
   - Show real assessment history ("Completed English assessment — 85%")
   - Hide the section until a real activity API is built
5. **Add a "Recent Assessments" quick-view** on the dashboard (top 3 from `/assessment/history`) so users can jump back to reports.

---

## Other Production Polish

### Logging & Privacy
- `App.tsx` geolocation fetch (`lines 16-63`) logs latitude, longitude, and full address to the browser console. **Remove `console.log`s** before production — this leaks PII.

### Error Handling
- **No React Error Boundaries** — any component crash will white-screen the app. Add a simple `ErrorBoundary` around route sections.
- **No 404 page** — visiting `/dashboard/nonexistent` shows a blank page. Add a catch-all `NotFound` route.

### Page Titles
- `document.title` never changes; every page is just "LearNexo" (or whatever the HTML template says). Add `useDocumentTitle` hook and set titles per page (e.g., "Dashboard | LearNexo", "Assessment Report | LearNexo").

### Build & Type Safety
- `npm run build` should pass cleanly. Verify there are no `noUnusedLocals` / `noUnusedParameters` errors.
- `npm run lint` should pass cleanly.

---

## Recommended Execution Order

### Phase 1 — Critical Bugs (Do First)
1. Fix backend report endpoint to populate `question`, `options`, `explanation` in corrections
2. Fix PDF multi-page generation in `ReportDetail.tsx`

### Phase 2 — Cleanup (High Impact, Low Effort)
3. Delete `src/routes/ProtectedRoutes.tsx`, `src/archive/`, `src/index.css`
4. Remove dead sidebar links (Notifications, Quizzes, Instructors, Support, Settings)
5. Remove `VerticalDropdown` from `MetricBento`
6. Remove unused deps: `react-hot-toast`, `axios`
7. Remove `console.log`s from `App.tsx` geolocation effect

### Phase 3 — Dashboard Polish
8. Wire dashboard metrics to real APIs (or show sensible empty states)
9. Make `SubjectRecommendation` dynamic from catalog API
10. Fix `ActivitiesTable` — remove hardcoded Math tab or wire to API
11. Replace static `activityFeed` with real data or remove section

### Phase 4 — Dark Mode
12. Add `ThemeProvider` + `ThemeToggle`
13. Add dark tokens to `App.css`
14. Theme the main pages (Dashboard, Reports, Assessment, Profile)

### Phase 5 — Final Polish
15. Add Error Boundary + 404 page
16. Add page titles
17. Run `npm run lint && npm run build` to verify

---

## Backend Note
The "Question not found" bug is primarily a **backend data population issue**. The frontend code in `ReportDetail.tsx` is actually correct — it faithfully renders `correction.question`. If you want a frontend-only workaround (while backend is being fixed), the frontend could cache the original assessment questions (from `sessionStorage` during the test) and match them to `correction.questionId` to display the question text.
