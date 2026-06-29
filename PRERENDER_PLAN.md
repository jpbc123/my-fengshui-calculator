# Pre-rendering Implementation Plan (vite-react-ssg)

## Goal

Make all pages serve fully-rendered HTML at build time so Google (and other crawlers)
see real content instead of an empty `<div id="root">`. This directly fixes the
"0 indexed pages" problem in Google Search Console.

## Why vite-react-ssg

- Purpose-built for React + Vite + react-router-dom v6
- Actively maintained (v0.8.9 stable, v0.9.1-beta)
- Minimal changes to existing code -- no framework migration needed
- Outputs static HTML files that deploy to Vercel as-is
- Supports react-helmet-async (meta tags baked into HTML)

## What changes

After implementation, every route produces a standalone `.html` file in `dist/`:
```
dist/
  index.html                          (homepage with full content)
  feng-shui/index.html                (fully rendered feng shui page)
  meditation/index.html               (fully rendered meditation page)
  articles/feng-shui-2026.../index.html
  zodiac/rat/index.html
  ... (all 60+ routes)
```

Google crawls these and sees real titles, descriptions, canonical URLs, structured
data, and page content -- no JavaScript execution needed.

---

## Implementation Steps

### Step 1: Install vite-react-ssg

```bash
npm install vite-react-ssg
```

### Step 2: Convert routes from JSX to RouteObject[] format

Currently in `src/App.tsx`, routes are JSX:
```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/feng-shui" element={<FengShui />} />
    ...
  </Routes>
</BrowserRouter>
```

Convert to `RouteObject[]` array (react-router-dom v6 data format):
```tsx
// src/routes.tsx
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Use lazy loading for code splitting
const Index = lazy(() => import('./pages/Index'));
const FengShui = lazy(() => import('./pages/FengShui'));
// ... etc

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,   // wrapper with Footer, ScrollToTop, etc.
    children: [
      { index: true, element: <Index /> },
      { path: 'feng-shui', element: <FengShui /> },
      { path: 'feng-shui/personal-element', element: <PersonalElement /> },
      { path: 'numerology', element: <Numerology /> },
      // ... all routes
      { path: '*', element: <NotFound /> },
    ],
  },
];
```

The `<AppLayout />` component contains the shared layout (ScrollToTop, PageTitleManager,
Footer, Toaster, etc.) and renders `<Outlet />` for child routes.

### Step 3: Create the AppLayout wrapper component

Extract the layout from current `App.tsx` into a new component:

```tsx
// src/components/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Footer from './Footer';
import PageTitleManager from './PageTitleManager';
import { Toaster } from './ui/toaster';
import { Toaster as Sonner } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

const AppLayout = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <ScrollToTop />
    <PageTitleManager>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </PageTitleManager>
  </TooltipProvider>
);

export default AppLayout;
```

### Step 4: Update main.tsx entry point

Replace the current ReactDOM.createRoot approach:

```tsx
// src/main.tsx  (BEFORE)
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

With the vite-react-ssg entry:

```tsx
// src/main.tsx  (AFTER)
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

export const createRoot = ViteReactSSG({
  routes,
  // Wrap with providers
  getStyleCollector: null,
})
```

Note: vite-react-ssg handles HelmetProvider internally via its `<Head>` component,
but we can also keep react-helmet-async by adding it to the root wrapper (Step 6).

### Step 5: Update vite.config.ts

Add SSR configuration for react-helmet-async:

```ts
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: '/',
    server: {
      host: true,
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@root": path.resolve(__dirname, "./"),
      },
    },
    // ADD THIS: Required for react-helmet-async to work during SSG build
    ssr: {
      noExternal: ['react-helmet-async'],
    },
    build: {
      sourcemap: false,
      target: 'es2015',
      minify: "terser",
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      terserOptions: {
        compress: { drop_console: false },
        format: { comments: false },
      },
    },
  };
});
```

### Step 6: Update package.json build scripts

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "vite-react-ssg build",
    "preview": "vite preview",
    "vercel-build": "npm run generate-sitemap && vite-react-ssg build",
    "generate-sitemap": "node utils/generate-sitemap.js"
  }
}
```

### Step 7: Fix window/document references for SSG compatibility

During the SSG build, code runs in Node.js where `window` and `document` don't exist.
All current usages are inside useEffect/event handlers (safe), EXCEPT:

**File: `src/pages/ArticlePage.tsx` (line 429)**
```tsx
// BEFORE (breaks during SSG):
<link rel="canonical" href={`${window.location.origin}/articles/${slug}`} />

// AFTER:
<link rel="canonical" href={`https://fengshuiandbeyond.com/articles/${slug}`} />
```

All other `window.*` usages are inside callbacks/effects and are safe.

### Step 8: Handle QueryClient provider

The QueryClientProvider currently wraps the entire app in App.tsx. Move it into the
AppLayout component or the root wrapper:

```tsx
// In AppLayout.tsx, wrap with QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AppLayout = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ... rest of layout */}
    </TooltipProvider>
  </QueryClientProvider>
);
```

### Step 9: Handle Vercel Analytics

```tsx
// Move Analytics into AppLayout
import { Analytics } from '@vercel/analytics/react';

// Add at the end of AppLayout's return:
<>
  {/* ...layout content... */}
  <Analytics />
</>
```

### Step 10: Update vercel.json (already partially done)

The `vercel.json` rewrites should still work -- Vercel serves the pre-rendered
HTML files directly for matching paths, and falls back to the SPA rewrite for
any dynamic/unmatched routes.

No changes needed beyond what was already done.

---

## Files to Create/Modify

| File | Action | Description |
|---|---|---|
| `src/routes.tsx` | CREATE | Route definitions as RouteObject[] |
| `src/components/AppLayout.tsx` | CREATE | Shared layout wrapper with Outlet |
| `src/main.tsx` | MODIFY | Replace createRoot with ViteReactSSG |
| `src/App.tsx` | MODIFY | Simplify to just export (or remove if routes.tsx replaces it) |
| `vite.config.ts` | MODIFY | Add `ssr.noExternal` for react-helmet-async |
| `package.json` | MODIFY | Update build scripts to use vite-react-ssg |
| `src/pages/ArticlePage.tsx` | MODIFY | Replace `window.location.origin` with hardcoded domain |

## Files NOT changed

All 50+ page components stay exactly as they are. Their Helmet tags, content,
styling, and logic are untouched.

---

## Potential Gotchas

### 1. react-helmet-async CJS/ESM conflict
During the SSG Node.js build, react-helmet-async may throw:
"does not provide an export named 'HelmetProvider'"

**Fix**: The `ssr: { noExternal: ['react-helmet-async'] }` in vite.config.ts
should resolve this. If not, change imports to:
```tsx
import pkg from 'react-helmet-async';
const { Helmet, HelmetProvider } = pkg;
```

### 2. Third-party libraries accessing browser APIs at import time
Some npm packages (e.g., lottie-react, html2canvas, canvas) may reference
`window` or `document` when imported. During SSG build this crashes.

**Fix**: Use dynamic imports in the components that use them:
```tsx
const LottieComponent = lazy(() => import('lottie-react'));
```
Or guard with:
```tsx
if (typeof window !== 'undefined') { /* browser-only code */ }
```

### 3. Build time
With 60+ routes, the SSG build visits each route with a headless renderer.
Expect build time to increase from ~30s to ~2-3 minutes. This is acceptable
for Vercel deployments.

### 4. Dynamic content (horoscopes)
Pages like daily horoscopes fetch data client-side from APIs. The pre-rendered
HTML will show the loading/skeleton state. This is fine -- Google sees the page
structure, meta tags, and static content. The dynamic horoscope content loads
after hydration. This is the same behavior as Next.js with client-side fetching.

### 5. The `/zodiac/:zodiac` dynamic route
This route has 12 variations (rat, ox, tiger...). vite-react-ssg needs to know
all paths at build time. Configure with `getStaticPaths`:

```tsx
// In routes.tsx
{
  path: 'zodiac/:zodiac',
  element: <ChineseHoroscopeResult />,
  entry: 'src/pages/ChineseHoroscopeResult.tsx',
  getStaticPaths: () => [
    'zodiac/rat', 'zodiac/ox', 'zodiac/tiger', 'zodiac/rabbit',
    'zodiac/dragon', 'zodiac/snake', 'zodiac/horse', 'zodiac/goat',
    'zodiac/monkey', 'zodiac/rooster', 'zodiac/dog', 'zodiac/pig',
  ],
}
```

### 6. The `/articles/:slug` dynamic route
Same approach -- list all known article slugs:

```tsx
{
  path: 'articles/:slug',
  element: <ArticlePage />,
  getStaticPaths: () => [
    'articles/feng-shui-2026-lucky-colors-symbols-zodiac-forecast',
    'articles/flying-stars-2026-feng-shui-sector-guide',
    'articles/feng-shui-2026-year-of-fire-horse',
    // ... all article slugs
  ],
}
```

Note: New articles added in Sanity CMS won't be pre-rendered until the next
deploy. This is acceptable -- trigger a Vercel redeploy when publishing new articles.

---

## Testing Plan

1. **Local build test**: Run `npm run build` and verify HTML files are generated
   in `dist/` for each route
2. **Content verification**: Open `dist/meditation/index.html` in a text editor
   and verify it contains the full page content, meta tags, canonical URL, and
   structured data (not just `<div id="root">`)
3. **Local preview**: Run `npm run preview` and browse the site -- verify all
   pages load correctly with client-side navigation still working (hydration)
4. **SEO check**: View page source in browser for any route -- confirm Helmet
   meta tags are in the HTML
5. **Deploy to Vercel preview**: Push to a branch, verify Vercel preview deployment
   works correctly
6. **Google validation**: After production deploy, use Google Search Console's
   URL Inspection tool to verify Google sees the rendered content

---

## Expected SEO Impact

- Google will see fully-rendered HTML with correct titles, descriptions, canonical
  URLs, and structured data for every page
- The "0 indexed pages" problem should resolve within 1-2 weeks as Google recrawls
- The redirect errors should already be fixed (Vercel domain config + vercel.json changes)
- With 60+ properly indexed pages containing relevant feng shui/astrology content,
  organic search traffic should begin growing

---

## Estimated Effort

- Implementation: 3-5 hours
- Testing: 1-2 hours
- Total: ~1 day

No page components need rewriting. The work is structural (entry point, routing
format, build config) rather than content changes.
