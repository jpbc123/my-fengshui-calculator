# Google Indexing — Comprehensive Action Plan

Created: 2026-07-03
Site: fengshuiandbeyond.com (Vite + vite-react-ssg on Vercel, Sanity CMS)
Prior work: `SSG-SEO-LESSONS-LEARNED.md` (May–Jun 2026), `INDEXING-FIX-PROGRESS.txt` (Jul 1, 2026)

---

## 1. Where you actually stand (verified 2026-07-03 against the LIVE site)

The good news — the technical layer is now genuinely fixed and deployed:

| Check (live production) | Result |
|---|---|
| Article pages serve full prerendered HTML (h1 + body, ~72KB) | ✅ Verified on `/articles/flying-stars-2026-feng-shui-sector-guide` |
| Unique `<title>`, meta description, canonical per page | ✅ |
| Homepage ships real article links in static HTML | ✅ 30+ internal links in raw HTML |
| Unknown URLs return real 404 (no soft-404 shell) | ✅ |
| www → non-www 308 redirect | ✅ |
| No stray `X-Robots-Tag` / `noindex` | ✅ |
| Sitemap (71 URLs) + robots.txt pointing to it | ✅ |

**The bad news — the remaining problem is not technical. It's authority and content depth:**

> **Ahrefs Domain Rating: 0.2** (effectively zero backlinks)

"Crawled — currently not indexed" after the HTML is fixed means Google fetched the page,
understood it, and *chose* not to index it. For a DR ~0 site in the astrology/feng-shui
niche (one of the most saturated content niches on the web), Google's quality threshold
simply isn't met yet. No script or API can override that decision — but the levers below
genuinely move it, and several on-site defects found today are still dragging you down.

### On-site defects found today (fixable in code, this week)

1. **Sitemap `lastmod` is fake.** `utils/generate-sitemap.js:134` stamps *every* URL with
   the build date. Google detects "everything changed today, every deploy" and starts
   ignoring your lastmod entirely — killing recrawl prioritization. This is a documented
   Google position (lastmod must be accurate or it's discounted).
2. **Zero structured data on articles.** No `Article`/`BlogPosting` JSON-LD, no author,
   no datePublished/dateModified. The homepage has 6 JSON-LD blocks; article pages have 0.
3. **Homepage `ItemList` JSON-LD points to 4 URLs that don't exist**:
   `/horoscopes`, `/kua-calculator`, `/wedding-dates` (real: `/horoscope`,
   `/feng-shui/kua-number`, `/auspicious-wedding-date-planner`). Broken structured data
   is a trust signal against you.
4. **Thin/empty pages are polluting the sitemap.** Measured visible text in live static HTML:
   - `/daily-wisdom-article` — **56 words** (content is client-fetched; Googlebot sees a shell)
   - `/zodiac/rat` (and all 12) — ~418 words, mostly chrome; the daily horoscope itself is client-fetched
   - `/games-fun/fortune-cookie` — 452 words; `/feng-shui/kua-number` — 495 words
   - `/credits`, `/sitemap`, legal pages — in the sitemap at priority 0.7
   Google judges site-level quality. 30+ thin URLs out of 71 = the whole domain looks thin.
5. **Room analyzer half-removed.** Commit `c3dcc2a` "remove room analyzer", but the route
   still exists in `src/routes.tsx:84`, the page is live, and `generate-sitemap.js:78`
   still lists it. Decide: keep it (then it's fine) or remove route + sitemap entry
   (then it becomes a 404 that must leave the sitemap).
6. **Stale dated content**: `october-2025-horoscope-zodiac-forecast`,
   `feng-shui-astrology-for-october-2025`, `universal-number-9-september-numerology`,
   `mid-autumn-festival-guide` are 9+ months out of date. Google won't index an
   October 2025 forecast in July 2026.

---

## 2. Straight answers to your questions

**"Will submit-to-google-index.js help?"** — Essentially no, and the script's own header
says so. Google's Indexing API only acts on `JobPosting` / `BroadcastEvent` pages. For
everything else you'll get 200 OK responses and no indexing. Running it is harmless
(free "nudge", zero risk beyond nothing happening), so run it if it makes you feel
better — but do not count it as a lever. Third-party "instant indexing services" abuse
this same API and Google largely neutralized them; avoid paying for any of them.

**"Any workaround to get indexed NOW/fast?"** — There is no forced path into Google's
index. The complete honest list of accelerators:

| Lever | Effect on Google | Speed |
|---|---|---|
| GSC URL Inspection → Request Indexing | Real, per-URL (~10–12/day quota) | Days |
| Fresh, accurate sitemap lastmod | Recrawl prioritization | 1–2 weeks |
| Internal links from already-indexed pages | Strong | Days–weeks |
| External links (even 2–3 real ones) | **The strongest signal at DR 0** | 2–6 weeks |
| IndexNow (Bing/Yandex/Naver/Seznam) | Zero for Google — but near-instant Bing indexing = real traffic while you wait | Hours |
| Content depth on thin pages | Removes the "not worth indexing" verdict | 2–8 weeks |
| Sitemap ping endpoint | **Dead** — Google retired it June 2023 | — |
| Indexing API for normal pages | **No** (see above) | — |

Realistic timeline if you execute Phases 0–2: Bing/DuckDuckGo traffic within days,
Google indexing of priority pages in 2–4 weeks, broad indexing in 1–3 months.

---

## 3. PHASE 0 — This week (code fixes + submissions, ~1 day of work)

### 0.1 Fix sitemap lastmod (high impact, 1 hour)
In `utils/generate-sitemap.js`:
- Articles: use `publishedAt` / `_updatedAt` from `src/data/articles-manifest.json` (already contains them, or add them in `generate-articles-manifest.mjs`).
- Static routes: keep a hardcoded map of "last meaningful content change" dates; bump manually when a page really changes.
- Daily-content pages (`/horoscope`, `/zodiac/*`, `/daily-wisdom-article`): today's date is legitimately correct **only if** the static HTML actually contains today's content (see 1.2); until then, use a stable date.
- Drop `<changefreq>`/`<priority>` if you like — Google ignores both; `lastmod` is the only field it uses.

### 0.2 Clean the sitemap (30 min)
Remove from `generate-sitemap.js`:
- `/credits`, `/sitemap`, `/privacy-policy`, `/terms-of-service` (keep the pages; they just don't belong in the sitemap and dilute it)
- `/daily-wisdom-article`, `/planetary-overview` until they have build-time content (see 1.2)
- `/feng-shui/room-analyzer` if you're removing the feature (also delete route in `src/routes.tsx:57,84`); keep both if you're keeping it
- Stale seasonal articles (see 1.4) until updated/redirected

Target: a sitemap of ~50 URLs where **every single one** is a full-content page you'd defend to a human reviewer.

### 0.3 Fix homepage JSON-LD ItemList URLs (15 min)
In the homepage component (Index page Helmet): `/horoscopes` → `/horoscope`,
`/kua-calculator` → `/feng-shui/kua-number`, `/wedding-dates` → `/auspicious-wedding-date-planner`.
Validate with https://search.google.com/test/rich-results after deploy.

### 0.4 Add Article JSON-LD to every article (2 hours)
In `src/pages/ArticlePage.tsx` (and the 2 hardcoded article components), inject via Helmet shim:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...", "description": "...",
  "image": "mainImageUrl",
  "datePublished": "publishedAt", "dateModified": "_updatedAt",
  "author": { "@type": "Person", "name": "...", "url": "https://fengshuiandbeyond.com/about-us" },
  "publisher": { "@type": "Organization", "name": "Feng Shui & Beyond", "logo": { "@type": "ImageObject", "url": ".../circle-logo.png" } },
  "mainEntityOfPage": "canonical URL"
}
```
Add `BreadcrumbList` JSON-LD too (Home → Articles → Title). All data is already in the manifest.

### 0.5 GSC manual indexing requests (10/day, start today)
Priority order (do ~10 per day until exhausted; re-request any that stay unindexed after 2 weeks):
1. Day 1: `/`, `/feng-shui`, `/astrology`, `/numerology`, `/horoscope`, `/article`, `/birth-chart`, `/feng-shui/kua-number`, `/articles/feng-shui-2026-year-of-fire-horse`, `/articles/flying-stars-2026-feng-shui-sector-guide`
2. Day 2: `/articles/feng-shui-2026-lucky-colors-symbols-zodiac-forecast`, `/articles/2026-numerology-universal-year-1-global-reset`, `/articles/hungry-ghost-month-2026-survival-guide`, `/articles/the-number-33`, `/articles/house-numbers-destiny`, `/articles/astrology-101-complete-beginners-guide`, `/auspicious-wedding-date-planner`, `/feng-shui/personal-element`, `/numerology/visiber-calculator`, `/articles/famous-celebrity-birthdays`
3. Day 3+: remaining articles, then calculators, then zodiac pages (only after 1.2 gives them content).

Also in GSC: Sitemaps → resubmit `sitemap.xml` after 0.1/0.2 deploy, and check
Settings → Crawl stats for anomalies.

### 0.6 Set up IndexNow (1 hour — instant Bing/Yandex/Naver, not Google)
1. Generate a key (any 32-hex string), save `public/<key>.txt` containing the key.
2. New script `utils/submit-indexnow.mjs`: POST to `https://api.indexnow.org/indexnow`
   with `{ host, key, keyLocation, urlList: [...all sitemap URLs] }`.
3. Run on every deploy (append to `vercel-build`) — it's idempotent and free.
Bing typically indexes within hours; Bing also feeds DuckDuckGo. This gets you *some*
search traffic immediately, which is itself a positive engagement signal.

### 0.7 Optional: run the Indexing API script once
`node submit-to-google-index.js` — free nudge, zero expectations. Don't rerun daily.

---

## 4. PHASE 1 — Weeks 1–2: make thin pages worth indexing

### 1.1 Zodiac pages (12 pages, biggest thin-content cluster)
Each `/zodiac/<sign>` page should carry **~1,000+ words of evergreen static content baked
into the build**: personality traits, element/yin-yang, birth years table, compatibility
(best/worst matches), lucky numbers/colors/directions, famous people of the sign, FAQ.
The daily horoscope stays client-fetched *on top of* that base. Structure: build-time
data file (`src/data/zodiac-profiles.ts`) rendered in the component so it's in static HTML.
Add `FAQPage` JSON-LD per sign. These pages can actually rank ("rat zodiac personality",
"year of the rat years" are real queries) — right now they're 418-word shells.

### 1.2 Daily-content pages: seed at build time
`/daily-wisdom-article` (56 words!) and `/planetary-overview` render skeletons to Googlebot.
Same fix as the articles manifest: fetch the latest content from Sanity in a build-time
generator and seed initial state. You already run daily content syncs — trigger a Vercel
deploy after the daily sync (Vercel deploy hook URL called at the end of the sync script)
so the static HTML always contains today's content. If that's too much, remove these URLs
from the sitemap and `noindex` them until done.

### 1.3 Calculator pages: add explainer content
`/feng-shui/kua-number`, `/feng-shui/personal-element`, `/numerology/visiber-calculator`,
compatibility games: add 500–800 words below each tool — how the calculation works, the
formula, what results mean, worked example, 4–6 FAQs (+ `FAQPage` JSON-LD). Calculators
with zero explanation are classic "crawled not indexed" victims; calculators with
methodology text are link magnets (see Phase 2).

### 1.4 Deal with stale seasonal content (pick one per article)
- **Update & re-date**: turn `october-2025-horoscope-zodiac-forecast` into the current
  month at a stable URL (e.g. `/articles/monthly-horoscope` updated monthly), 301 the old slug.
- **Or 301** the stale slugs to the closest evergreen page (`/horoscope`).
- `mid-autumn-festival-guide` / `universal-number-9-september-numerology`: refresh for 2026
  before their season returns (Sep 2026 — soon; these can become your first ranking wins).

### 1.5 Internal linking upgrades
- **Breadcrumbs** (visible + JSON-LD) on every page: Home → Section → Page.
- **In-body contextual links**: when article text mentions "Kua number", link the phrase to
  the calculator. Do a one-time pass over the 17 Sanity articles (links inside Portable
  Text body), and add a standard "Try our calculators" block on every article.
- **Tools → articles**: each calculator links to 2–3 related articles (Kua calculator →
  flying stars article, etc.). Articles → tools already partially exists; make it bidirectional.
- Footer: link the 4 hubs + top 3 evergreen articles sitewide.

### 1.6 Publish 2 new articles/week, targeted by data
You have Ahrefs — use Keywords Explorer and only write for keywords with **KD ≤ 10** and
some volume, e.g. long-tails like "kua number 8 meaning", "fire horse year 2026 meaning",
"house number 4 feng shui". Every new article: manifest auto-includes it (already wired),
request indexing in GSC on publish day, submit via IndexNow.

---

## 5. PHASE 2 — Weeks 2–8: authority (the lever that actually decides this)

At DR 0.2, even perfect pages sit in "Discovered/Crawled — not indexed". A handful of real
links changes Google's crawl budget and quality prior for the whole domain. Ordered by
effort/return:

1. **Pinterest — seriously.** Feng shui/home content is a top Pinterest vertical. Create
   the business account (your Organization schema already claims one), pin every article
   image with a link. Pinterest links are nofollow but drive real referral traffic and
   crawl discovery. 30 min/week.
2. **Free-tool outreach.** Your calculators are the linkable assets. Find pages that list
   "feng shui calculators", "kua number calculator", "chinese zodiac tools" (Ahrefs →
   Site Explorer on competitors → Backlinks) and email them to include yours. Even 3–5
   links from DR 20–40 blogs transforms a DR 0 site.
3. **Expert-quote platforms**: Connectively (ex-HARO), Qwoted, Featured, SourceBottle —
   answer journalist queries on feng shui, astrology, home/wellness. 1–2 wins/month is
   realistic and these are often DR 60+ links.
4. **Guest posts** on home-decor / wellness / spirituality blogs (pitch "Feng shui mistakes
   in small apartments" etc. with one contextual link back).
5. **Communities**: answer genuinely on r/fengshui, r/astrology, Quora; link only when it
   truly answers the question. Value: traffic + crawl paths, not PageRank.
6. **Social profiles for real**: the Organization schema lists Facebook/Instagram/Twitter/
   Pinterest — make sure all four exist and link back (consistency signal + crawl paths).
7. **E-E-A-T basics**: give articles a named author with a short bio + photo; beef up
   `/about-us` with who's behind the site and credentials/experience. Astrology is
   fringe-YMYL — Google is extra picky about anonymous sites here.

---

## 6. PHASE 3 — Ongoing monitoring & cadence

Weekly (15 min):
- GSC → Indexing → Pages: track the "Why pages aren't indexed" buckets. Success = URLs
  migrating from "Crawled — currently not indexed" → "Indexed".
- GSC → Performance: impressions are the leading indicator (they rise weeks before clicks).
- Re-request indexing for priority URLs still not indexed after 2 weeks.
- Ahrefs: Domain Rating and referring domains (goal: DR 5+ by Sep 2026, 10+ referring domains).

Per deploy (automated): manifest → sitemap (real lastmod) → SSG build → IndexNow submit.
Per new article: GSC request indexing same day.

### Expectations (honest)
- **Days**: Bing/DuckDuckGo indexing via IndexNow.
- **2–4 weeks**: priority pages requested via GSC start indexing (tech is fixed; requests now carry a real payload).
- **4–8 weeks**: broad indexing follows the first backlinks + content depth.
- **2–3 months**: impressions curve visibly up.
A site that spent ~10 months serving Google an empty shell has a trust deficit; Google
re-evaluates slowly. Everything above shortens that — nothing eliminates it.

---

## 7. Quick reference — what NOT to waste time/money on

- ❌ Indexing API for regular pages (incl. `submit-to-google-index.js` as a "fix")
- ❌ Paid "instant indexing" / "backlink indexer" services (API abuse or spam links)
- ❌ Google sitemap ping endpoint (retired 2023)
- ❌ Fiverr bulk backlinks (fastest way to make a DR 0.2 site worse)
- ❌ Rewriting titles/descriptions repeatedly hoping for indexing (tech head is already correct)
- ❌ `changefreq`/`priority` tuning in the sitemap (Google ignores both)
