# Seahorse Suites

## Project Structure

- `www/` — Nuxt 4 marketing website
- `firebase/` — Firebase Hosting config + Cloud Functions
- `docs/` — Internal documentation

## Development

- **Do not** run `nuxi build`, `npm run build`, or any build commands unless explicitly asked.
- **Do not** prompt the user asking if they would like to run a build.
- The dev server (`npm run dev`) is managed by the user separately.
- Use `npm` as the package manager (not yarn or pnpm).

## Nuxt & i18n Guardrails
- **Internationalized Routing:** NEVER hardcode standard links (e.g., `<NuxtLink to="/about">`). You must ALWAYS use `localePath()` for internal navigation (e.g., `<NuxtLink :to="localePath('about')">`) so the i18n module can correctly route users based on their active language.
- **Escape `@` in locale files:** vue-i18n treats `@` as linked-message syntax. Any literal `@` in translation strings (emails, handles) must be written as `{'@'}` — e.g., `"seahorsesuites{'@'}gmail.com"`.
- **No `fixed` overlays inside transformed ancestors:** the header animates with `transform`, which re-anchors `position: fixed` children to the header box. Full-screen overlays (mobile menu, modals) must be `<Teleport to="body">`.

## Agent Guidance (Modern Web Standards)
- **Zero Legacy Bloat:** You must prioritize modern, native browser APIs over legacy libraries or polyfills.
- **WebMCP:** When building forms or interactive components, utilize WebMCP annotations (Declarative API) so the site's features are exposed as structured tools for browser-based AI agents.

## Brand Identity
- **Primary color:** `#40d6dc` (brand "ocean" palette lives in `www/tailwind.config.ts` + CSS vars in `www/app/assets/css/main.css`).
- **Fonts:** `Cormorant Garamond` (display, headings) + `Quicksand` (body). Generous letter-spacing on headings and small caps labels.
- **Logo:** a filigree seahorse in a vertical-rectangle proportion (287×640). Web-optimized files at `www/public/images/logo/seahorse-{color,white,black}.png` (originals in `/logos/`). Always render it through `SeahorseMark.vue` (`variant` + `size` props).
- **Tone:** relaxing, inviting, premium coastal getaway.

## Business Facts
- **Property:** Seahorse Suites, 1167 Buttonwood Lane, Sanibel, FL 33957 — Old Town Sanibel (historic east end), Gulf at one end of the lane, San Carlos Bay at the other.
- **Contact:** seahorsesuites@gmail.com · 573 529 1529. No social media accounts.
- **Suites (real, 5):** Seahorse Retreat (2BR/1BA, 850 sqft, pet-friendly) · Sunset Haven (1BR + twin bunk/1BA, 850 sqft) · Coastal Bliss (2BR/1BA, 900 sqft, pet-friendly) · Ocean Breeze (2BR/1BA, 950 sqft, family/backyard) · Beachside Escape (2BR/2BA, 1,000 sqft, largest). No public nightly rates — never invent prices.
- **Amenities (real, 8):** high-speed WiFi, complimentary guest bicycles, laundry facilities, beach essentials (towels/chairs/umbrellas), pet-friendly, shared patios + fire pit, fully equipped kitchens, free on-site parking (rear of building).
- **Nearby:** Sanibel Lighthouse & fishing pier, J.N. "Ding" Darling National Wildlife Refuge, world-famous shelling beaches ("Sanibel Stoop"), Magic Bus on Sanibel (ice cream/candy/coffee), Wickies Lighthouse Restaurant, EmOcean (beachwear/souvenirs).
- **Bookings:** Airbnb host profile lists all properties (https://www.airbnb.com/users/profile/1529338761913645803); Vrbo needs one direct URL per suite. Both live in `www/app/app.config.ts` → `booking`.
