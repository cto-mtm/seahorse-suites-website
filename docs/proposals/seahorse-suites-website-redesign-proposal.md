# Website Redesign Proposal

**Prepared for: Seahorse Suites** (seahorsesuites.com)
**Prepared by: MTM C&A**

Thank you for the opportunity to review seahorsesuites.com. Rather than describing what a new website *could* look like, we have built a working preview of it. This document summarizes what we found on your current site, what the new build already does differently — visually, commercially, and technically — and the investment required to take it live. A few questions are embedded throughout; your answers will let us finalize scope.

---

## Part 1: Current State Summary

The current seahorsesuites.com is a WordPress site built with the Elementor page builder (v4.0.9). It presents the property warmly and covers the essentials — five suites, an amenities page, and a contact form — but our audit surfaced issues that limit it both as a marketing asset and as a booking engine.

### Technical audit findings

| # | Finding | Impact |
|---|---------|--------|
| 1 | The main **"Reserve Now" button links to the Suites page — which is where the visitor often already is.** No path leads to an actual booking. | The single most important call to action on the site is a dead end. Guests must leave and search Airbnb/Vrbo themselves. |
| 2 | The **check-in/check-out date form** collects dates and party size but only sends an email; guests receive no availability, no confirmation, no next step. It also caps guests at 4, though several suites sleep more. | Lost bookings and mismatched expectations; inquiries instead of reservations. |
| 3 | **Dozens of broken/empty image slots** across the homepage and Suites page (gallery frames rendering with no image). | Visitors see missing photos on a business whose product *is* the visuals. |
| 4 | **Social media icons link to “#”** — placeholder links to accounts that don't exist. | Dead clicks and an unfinished impression. |
| 5 | A **raw WhatsApp video file** (`Video-de-WhatsApp-...mp4`) is served directly from the media library. | Large unoptimized download; slow on mobile connections guests actually use. |
| 6 | **English only.** | Florida's visitor mix includes a large Spanish-speaking market that the site cannot serve. |
| 7 | **No structured data** (Schema.org lodging markup), generic page titles, no localized meta. | Google cannot surface the property properly in local/travel results. |
| 8 | **Elementor page-builder stack**: heavy CSS/JS payload, render-blocking assets, plugin dependency chain on every page load. | Slower Core Web Vitals (a Google ranking factor), plus ongoing plugin/security maintenance burden. |

None of this is unusual for a first-generation small-business site — it got Seahorse Suites online. But each item above is either a leaked booking or a maintenance liability.

---

## Part 2: What We Built — The Working Preview

We rebuilt the site from scratch on a modern stack and you can click through it today. Below, each area follows the same pattern: what exists now, and what the new build does.

### 2.1 Brand & Visual Experience

- **The Reality:** A generic template look; the seahorse logo sits in the corner but the brand stops there. Broken galleries undercut the premium feel the suites deserve.
- **The New Build:** A complete brand system built around your filigree seahorse and the `#40d6dc` ocean palette: elegant serif display typography (Cormorant Garamond) paired with a warm, readable body font (Quicksand); a full-screen hero video with copy written to sell the *feeling* ("Steps from the Gulf. A world from everything else."); animated translucent waves, scroll-triggered reveals, a parallax local-attractions section, a floating seahorse watermark, and an immersive full-screen mobile menu. Every hover, transition, and loading state is deliberate.

### 2.2 The Booking Funnel (Business Impact)

- **The Reality:** "Reserve Now" circles back to the Suites page; the date form emails you and leaves the guest waiting.
- **The New Build:** Every primary call to action opens a **booking chooser**: one tap to your Airbnb host profile (all listings), or directly to the **individual Vrbo/Airbnb listing for a specific suite**. Each of the five suites now has **its own dedicated page** — gallery, amenities, specs, description — with a sticky "Book this suite" card holding its two direct listing links. The path from "I like this suite" to "I'm on its booking page" is now one click, on every page of the site.
- **Supporting trust:** A guest-review section with your 5.0 rating, Airbnb *Guest Favourite* / *Superhost* and Vrbo *Premier Host* badges — the social proof that converts lookers into bookers.

### 2.3 Content & Local SEO Architecture

- **The Reality:** Three pages plus suite listings; the neighborhood gems (Magic Bus, Wickies, EmOcean) are name-dropped on the homepage with broken images.
- **The New Build:** A 15+ page architecture in **English and Spanish**: home, suites index, **5 individual suite pages**, amenities, contact, and **6 dedicated local guide pages** (Sanibel Lighthouse, "Ding" Darling Wildlife Refuge, world-famous shelling, Magic Bus, Wickies, EmOcean). These guide pages do double duty: they answer the questions travelers actually search for ("things to do Sanibel east end") and funnel that traffic to your booking links. All copy was rewritten around Old Town Sanibel's genuine strengths — the lighthouse walk, the Sanibel Stoop, 25 miles of bike paths that pair with your free guest bicycles.

### 2.4 Backend & Infrastructure

- **The Reality:** WordPress + Elementor + plugins on traditional hosting — a database-driven system that must be patched, updated, and secured indefinitely, with a plugin dependency chain that can break on any update.
- **The New Build:** A **static, pre-rendered site** (Nuxt 4) served from Firebase's global CDN. There is no database to hack, no plugins to renew, no WordPress admin to secure. Contact and direct reservation-request forms run on a serverless Cloud Function with input validation, reCAPTCHA v3 spam protection, an email notification to you, and an automatic branded confirmation to the guest. Legacy URLs from the current site will be 301-redirected so no search equity is lost.

### 2.5 Performance & SEO

- **The Reality:** Page-builder payloads, unoptimized media, no structured data.
- **The New Build:** Pre-rendered static HTML (sub-second first paint), an automated WebP image-optimization pipeline, aggressive CDN cache headers, and lazy-loaded media. SEO is implemented, not sprinkled: per-page localized titles/descriptions, automatic sitemap + robots + canonical URLs, English/Spanish hreflang alternates, Open Graph share images, and **Schema.org `LodgingBusiness` structured data** (address, geo, pet policy, amenity list) — the markup Google's local and travel results feed on.

### Side-by-side

| | Current Site | New Build |
|---|---|---|
| Platform | WordPress + Elementor + plugins | Static Nuxt 4 on Firebase CDN |
| Booking path | Dead-end button + email form | 1-click to Airbnb/Vrbo, per suite, from every page |
| Suite presentation | One shared page, broken galleries | Dedicated page per suite with direct booking links |
| Languages | English | English + Spanish |
| Local SEO | None | 6 local guide pages + LodgingBusiness structured data |
| Performance | Builder payload, raw video files | Pre-rendered static pages, optimized media |
| Security/maintenance | Plugin updates, patching, backups | No database, no plugins, nothing to patch |

---

## Part 3: What We Need From You

1. **Photography:** A photo set per suite (we have gallery slots ready for a hero shot + 4 photos each), plus property/backyard/neighborhood shots. Existing listing photos work — we'll optimize them.
2. **Listing URLs:** The Vrbo listing URL for each of the five suites, and each suite's individual Airbnb listing URL (we already link your Airbnb host profile).
3. **Cancellation policy:** The current text, so we carry it over (and translate it).
4. **Access:** Domain registrar/DNS access for the launch swap, and Google Analytics/Search Console access (or we create them fresh).
5. **Spanish review:** Our Spanish copy is complete; a quick read-through from your side is welcome before launch.
6. *Question:* Do you want nightly rate ranges displayed on the site, or should pricing live exclusively on the booking platforms (current behavior)?

---

## Part 4: Investment

**Market context.** Industry pricing guides for 2026 place template-based boutique lodging sites at **$5,000–$15,000** and custom-designed independent/boutique hotel sites at **$20,000–$35,000**, with custom hotel builds ranging **$10,000–$50,000** overall.¹ Our fixed bid below sits deliberately at the accessible end of that range for a five-suite property — because the build is already substantially complete and you can verify exactly what you're buying before signing.

### Tier 1 — Launch the New Site (Fixed Bid): **$7,400**

Everything shown in the working preview, finished and live on seahorsesuites.com.

| Work Item | What It Covers | Cost |
|---|---|---|
| Brand & design system | Logo system, palette, typography, animation language, mobile experience | $1,600 |
| Site build (15+ pages, bilingual) | Home, suites index, 5 suite pages, amenities, 6 local guides, contact — EN + ES | $2,600 |
| Booking funnel | Platform-choice modal, per-suite Airbnb/Vrbo deep links, trust/review section | $700 |
| Forms backend | Serverless functions, validation, reCAPTCHA, notifications + guest confirmations | $900 |
| SEO package | Structured data, localized meta, sitemap/hreflang/canonicals, 301 redirect map | $800 |
| Performance, QA & launch | Media optimization pipeline, cross-device QA, DNS swap, analytics setup | $800 |
| **Total** | | **$7,400** |

> **Decisive-client pricing: $5,550 (25% off) if we sign within 14 days of this proposal.**
> We'll be transparent about why: we're a small team, and long sales cycles are where our resources actually go. When a client can decide quickly, our cost to serve them drops — so we pass that difference on rather than pricing every project as if it will take months to close. After the 14-day window, Tier 1 reverts to the standard $7,400.
>
> **Partner pricing — locked in when you sign within the window:** your **next website project with us at 10% off**, and the **one after that at 20% off**. Once we've built your brand system and infrastructure, follow-up projects genuinely cost us less to deliver — so returning clients shouldn't pay first-project prices. Valid for projects commissioned within 24 months, of similar or smaller scope; not combinable with other promotional discounts.

### Tier 2 — Launch + Content & Local SEO Package: **$9,900**

Tier 1, plus: full curation and optimization of your photo library across all gallery slots, a real hero video edit from your footage, Google Business Profile optimization (categories, photos, booking links), review schema, GA4 + Search Console configuration, and 60 days of post-launch search tuning. *(The 14-day decisive-client discount applies to the Tier 1 portion of this package: $8,050 within the window.)*

### Tier 3 — Direct Bookings (Future Phase, two ways to get there)

Both options add what guests increasingly expect — checking availability and booking without leaving your site — and both cut into the **10–17% you currently pay in platform commissions**. Billed as a separate phase once Tier 1 or 2 is live.

**Option A — In-House Availability & Direct Booking: $6,500 – $8,500, no monthly software**
We build it ourselves on your existing infrastructure: live availability calendars on every suite page (synced from your Airbnb/Vrbo calendars via their iCal feeds), and direct booking with secure Stripe checkout. When a guest books direct, the platforms' calendars are blocked automatically via the same mechanism. *The honest caveat:* iCal syncs on a delay (platforms refresh roughly every couple of hours), which leaves a small double-booking window. For a five-suite property with moderate volume this risk is low and manageable — but it is real, and we'd rather you know it than discover it.

**Option B — Full Automation via Channel Manager: $14,500 – $18,500 + ~$40–70/mo**
Integration with a professional channel manager (Lodgify, OwnerRez, or Hostaway): true two-way, near-real-time sync through the platforms' official partner APIs, rate management, unified inbox, and automated tax handling. This is the "set it and forget it" version — the monthly subscription is the price of eliminating the sync-delay risk entirely.

Our recommendation: start with Option A. If direct booking volume grows to where the sync window worries you, the upgrade path to Option B is clean — nothing built in Option A is wasted.

---

## Part 5: Ongoing Operating Costs

This is where the new architecture quietly earns its keep. Because the site is delivered as static files from a pay-as-you-go CDN, your fixed monthly costs approach zero.

| Item | New Site | Current (WordPress) |
|---|---|---|
| Hosting | **$0–5/mo** (Firebase free tier covers typical traffic) | $10–40/mo managed WP hosting |
| Forms backend | **$0–2/mo** (serverless free tier) | Included, but via plugins |
| Page builder / plugin licenses | **$0** | ~$60–200/yr (Elementor Pro + plugin renewals) |
| Security patching & backups | **$0 — nothing to patch** | DIY risk, or $50–150/mo maintenance retainer |
| Domain renewal | ~$15–20/yr (unchanged) | ~$15–20/yr |
| Analytics, Search Console, reCAPTCHA | $0 | $0 |
| Booking platform fees | Transaction-based (unchanged — Airbnb/Vrbo) | Same |

**Realistic total: roughly $0–7/month** in infrastructure, versus an equivalent WordPress footprint typically running $25–60+/month once hosting, licenses, and maintenance are counted honestly.

**Optional care plan:** If you'd like us on call for content updates, seasonal photo swaps, new suite pages, and monitoring, we offer a light-touch plan at **$95/month** (up to 2 hours of changes) — optional, cancel anytime, and never required for security reasons.

**If Tier 3 is added later:** Option A adds only Stripe's card processing (~2.9% + 30¢ per direct transaction — versus the 10–17% the platforms take today). Option B additionally carries the channel manager subscription at ~$40–70/month. Either way, the fees are offset by the OTA commissions direct bookings avoid.

---

## Next Steps

1. Click through the preview and mark anything you'd like changed.
2. Answer the questions in Part 3 (photos, Vrbo/Airbnb URLs, DNS access).
3. Pick a tier. We finalize the agreement, complete the content, and schedule the DNS swap — the public sees the new site instantly, with zero downtime and all legacy URLs redirected.

---

¹ Market pricing references: Qrolic "Hotel & Resort Website Cost 2026", Hooray Agency "Custom Hotel Website Cost 2026", RevPARGenius "How Much Should a Hotel Website Cost 2026".
