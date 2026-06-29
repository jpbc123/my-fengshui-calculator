# Conversion, Retention & Bounce Rate Optimization Plan

**Site:** Feng Shui & Beyond (fengshuiandbeyond.com)  
**Date Created:** 2026-06-29  
**Stack:** React 18 + Vite + Tailwind CSS + Supabase + Stripe + Vercel

---

## 1. REDUCE BOUNCE RATE

### 1.1 — Improve Page Load Performance
- [ ] Audit and lazy-load below-the-fold components on Index.tsx (CombinedDailyInsightsBanner, RecentArticlesPreview, SEO content section) using `React.lazy()` + `Suspense`
- [ ] Convert large zodiac images in HeroSection.tsx to WebP/AVIF format with responsive `srcset`
- [ ] Add `loading="lazy"` to all images below the fold
- [ ] Reduce custom font count (currently 8+ fonts: southampton, brilliant-signature, romantically, heisenberg, marquette, breathing, luckily, luckyfield) — pick 2-3 max and subset them
- [ ] Implement font-display: swap for all @font-face declarations to prevent invisible text during load
- [ ] Tree-shake unused UI components (50+ shadcn components imported but many likely unused)
- [ ] Split route bundles — add `React.lazy()` for all page-level imports in App.tsx instead of static imports

### 1.2 — Strengthen Above-the-Fold Content
- [ ] Add a clear value proposition headline in HeroSection that answers "What will I get here?" within 3 seconds
- [ ] Add a single, prominent primary CTA above the fold (e.g., "Find Your Zodiac Sign" or "Get Your Free Reading")
- [ ] Show a quick interactive element immediately (e.g., birth year input → instant zodiac result) to create instant engagement
- [ ] Remove or minimize the zodiac preview carousel on first load — it delays with dummy data and a 500ms artificial timeout

### 1.3 — Fix Navigation & Orientation
- [ ] Add breadcrumbs to all inner pages (component exists at `src/components/Breadcrumb.tsx` — verify it's used everywhere)
- [ ] Add a sticky/fixed header so navigation is always accessible while scrolling
- [ ] Add a visible search bar in the header for content discovery
- [ ] Fix the "Learn More" button in CTASection.tsx — it currently does nothing (no onClick, no href)
- [ ] Ensure all ToolsSection links are correct (e.g., `/visiber-calculator` vs `/numerology/visiber-calculator`)

### 1.4 — Improve Mobile Experience
- [ ] Audit mobile layout for all pages — ensure touch targets are 44px+ minimum
- [ ] Test mega menu on mobile — complex accordion menus can frustrate users
- [ ] Add swipe gestures for zodiac carousel on mobile
- [ ] Ensure the homepage doesn't feel endlessly long on mobile — add section anchors or a floating "jump to" nav

---

## 2. INCREASE CONVERSIONS

### 2.1 — Add Email Capture / Lead Generation
- [ ] Add a newsletter signup form in the footer (e.g., "Get your daily horoscope & feng shui tips in your inbox")
- [ ] Create a lead magnet popup after a user completes any calculator (e.g., "Save your results — enter your email")
- [ ] Add an email gate for premium content (e.g., detailed birth chart PDF download requires email)
- [ ] Build an exit-intent popup offering a free personalized reading in exchange for email
- [ ] Store subscribers in Supabase (already in dependencies)

### 2.2 — Optimize CTAs Throughout the Site
- [ ] Replace generic "Start Your Calculation" CTA with specific, benefit-driven text (e.g., "Discover My Lucky Directions")
- [ ] Add contextual CTAs at the end of every article page pointing to relevant calculators
- [ ] Add CTAs within calculator results pointing to related tools (e.g., after Kua Number → suggest Personal Element)
- [ ] Make the Birth Chart and Wedding Date services more prominent with pricing, testimonials, and urgency
- [ ] Add a floating/sticky CTA button on mobile for key conversion pages

### 2.3 — Add Social Proof & Trust Signals
- [ ] Add user testimonials/reviews on the homepage and service pages
- [ ] Display user count or calculation count (e.g., "Join 50,000+ users who've discovered their element")
- [ ] Add expert credentials or "About the Author" sections on article pages
- [ ] Add trust badges near payment/service CTAs (secure payment, satisfaction guarantee)
- [ ] Show real-time activity notifications (e.g., "Sarah from NY just discovered her Kua Number")

### 2.4 — Streamline the Conversion Funnel for Paid Services
- [ ] Create dedicated landing pages for Birth Chart and Wedding Date services with clear pricing
- [ ] Add comparison tables (free vs. premium features)
- [ ] Reduce form fields to minimum required
- [ ] Add progress indicators on multi-step forms
- [ ] Implement abandoned cart / incomplete form email reminders (via Supabase Edge Functions)

---

## 3. IMPROVE USER RETENTION

### 3.1 — Personalization & User Accounts
- [ ] Implement user accounts via Supabase Auth (Google/email login)
- [ ] Save user's zodiac sign, birth data, and preferences to their profile
- [ ] Show personalized dashboard on return visits (your sign, today's horoscope, your element, etc.)
- [ ] Remember last-visited calculator/tool and show "Continue where you left off"
- [ ] Allow users to save/bookmark favorite articles and tools

### 3.2 — Daily & Recurring Content Hooks
- [ ] Implement daily push notifications for horoscope updates (Web Push API)
- [ ] Create a "Daily Digest" email with personalized horoscope + feng shui tip + article
- [ ] Add a daily streak/check-in feature (e.g., "You've checked your horoscope 7 days in a row!")
- [ ] Make Daily Wisdom article page auto-refresh content each day with prominent "new today" badge
- [ ] Add a "Tomorrow's Preview" teaser at the bottom of daily horoscope to drive return visits

### 3.3 — Gamification & Engagement
- [ ] Add a progress system: "You've explored 3 of 12 zodiac tools — keep going!"
- [ ] Implement achievement badges (e.g., "Element Master" after completing all feng shui tools)
- [ ] Add shareable result cards for social media (already have ShareResult component — expand usage)
- [ ] Create monthly challenges (e.g., "30-Day Meditation Challenge" tied to the meditation section)
- [ ] Add a points/rewards system for engagement (points for daily visits, tool usage, article reads)

### 3.4 — Content Strategy for Return Visits
- [ ] Add "Related Articles" section at the bottom of every article page
- [ ] Create content series (e.g., "Feng Shui Room-by-Room" weekly series)
- [ ] Add "What's New" or changelog section to highlight fresh content
- [ ] Implement article commenting system for community engagement
- [ ] Create a community/forum section (currently "Coming Soon" — prioritize this)

---

## 4. ANALYTICS & MEASUREMENT

### 4.1 — Set Up Conversion Tracking
- [ ] Define and track key conversion events in Vercel Analytics (calculator completions, email signups, service purchases)
- [ ] Set up funnel visualization: landing → tool usage → email capture → paid service
- [ ] Track scroll depth on homepage to see where users drop off
- [ ] Add heatmap tracking (e.g., Hotjar or Microsoft Clarity — free tier)
- [ ] Set up A/B testing for hero section variants and CTA copy

### 4.2 — Monitor Bounce Rate by Page
- [ ] Identify the top 5 highest-bounce pages and prioritize fixes
- [ ] Track time-on-page for calculator pages vs. content pages
- [ ] Monitor exit pages to find where users leave the site
- [ ] Set up alerts for sudden bounce rate increases

---

## 5. QUICK WINS (Do These First)

Priority items that are low-effort, high-impact:

1. [ ] **Fix broken "Learn More" button** in CTASection.tsx — immediate UX issue
2. [ ] **Add lazy loading** to App.tsx route imports — instant performance gain
3. [ ] **Add email signup** to Footer.tsx — captures leads on every page
4. [ ] **Add "Related Tools" links** at the bottom of each calculator result page
5. [ ] **Fix ToolsSection.tsx link paths** — some routes don't match App.tsx routes
6. [ ] **Remove the 500ms artificial delay** in HeroSection.tsx zodiac preview fetch
7. [ ] **Add a clear H1 headline** visible (not sr-only) on the homepage hero
8. [ ] **Reduce font files** from 8 to 2-3 — cuts 500KB+ from initial load
9. [ ] **Add `<meta name="viewport">` audit** — ensure proper mobile scaling
10. [ ] **Connect the "Store" link** — currently goes to "Coming Soon" which increases bounce

---

## PRIORITY ORDER

| Phase | Focus | Timeline | Impact |
|-------|-------|----------|--------|
| Phase 1 | Quick Wins (#5 above) | Week 1 | High — fixes broken UX and low-hanging fruit |
| Phase 2 | Bounce Rate (#1) | Week 2-3 | High — faster loads = fewer bounces |
| Phase 3 | Conversion CTAs & Email (#2.1, #2.2) | Week 3-4 | High — starts capturing leads |
| Phase 4 | Social Proof (#2.3) | Week 4-5 | Medium — builds trust |
| Phase 5 | User Accounts & Personalization (#3.1) | Week 5-8 | High — biggest retention lever |
| Phase 6 | Gamification & Daily Hooks (#3.2, #3.3) | Week 8-12 | Medium — compounds over time |
| Phase 7 | Analytics & A/B Testing (#4) | Ongoing | High — data-driven decisions |

---

*This plan is based on analysis of the current codebase as of 2026-06-29.*
