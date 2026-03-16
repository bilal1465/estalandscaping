# Scroll Jank – Root Cause and Targeted Fixes

## 1. Exact source of scroll lag

### Primary cause: Many IntersectionObservers + simultaneous CSS transitions

- **What was happening:** The homepage used **40+ `AnimateInView`** components. Each one:
  - Created its own **IntersectionObserver** (via `useInView`).
  - When an element entered the viewport, the IO callback ran and added the class `is-visible` to the DOM.
  - That triggered a **CSS transition** (opacity 0→1 and transform translateY(14px)→0) with stagger delays.

- **Why that caused hitching:** When scrolling quickly through **Our Services**, **Our Work**, **Testimonials**, or the **Quote/Contact** section, many elements crossed the viewport in a short time. In one or a few frames:
  - Many IO callbacks fired.
  - Many `classList.add('is-visible')` ran (inside rAF).
  - Many elements started opacity + transform transitions at once.
  - The main thread and compositor had to apply new styles and start many transitions in the same scroll frame, while **Lenis** was also running its own `requestAnimationFrame` loop. Result: **scroll hitching and frame drops**.

### Sections and components responsible

| Section / file | AnimateInView count | Role |
|----------------|---------------------|------|
| **Services** (`services-section.tsx`) | 1 header + 6 cards = **7** | Header and every service card had its own IO + transition. |
| **Gallery / Our Work** (`gallery-section.tsx`) | 1 header + 1 subheader + 2 before/after + 8 gallery items = **12** | Most IO density; fast scroll through gallery triggered many transitions at once. |
| **Testimonials** (`testimonials-section.tsx`) | 1 header + 3 cards + 1 CTA = **5** | Each card and the bottom block had separate IO + transition. |
| **Quote / Contact** (`quote-request-section.tsx`) | Multiple blocks (header, trust badges, contact card, success state) = **5+** | Same pattern: many elements revealing on scroll. |
| **About** (`about-section.tsx`) | 2 | Text block + image block. |
| **Values** (`values-section.tsx`) | 1 header + 3 cards = **4** | Each value card had IO + transition. |
| **Pricing** (`pricing-section.tsx`) | 1 header + 2 cards + 1 CTA = **4** | Same. |
| **Contact** (`contact-section.tsx`) | 1 header + 2 cards = **3** | Same. |

So the lag was not from a single component but from **many scroll-triggered reveal animations** firing in burst during fast scroll.

### Secondary factors (already addressed or confirmed)

- **Navigation:** Single Lenis scroll listener, throttled state updates. No double listener.
- **Custom cursor:** RAF at half rate; minimal impact.
- **No Framer Motion** on the site.
- **No `backdrop-filter` / heavy blur** in scroll path (only in lightbox overlay when open).
- **No `background-attachment: fixed`** or parallax in the audited code.
- **Sticky:** Quote section has `lg:sticky lg:top-24` on the contact card; left as-is; main cost was the per-element reveals.

---

## 2. What was removed or changed

### A. Removed all scroll-triggered reveal animations on the homepage

- **Services:** Removed all `AnimateInView`. Section and cards render **static** (no opacity/transform on scroll).
- **Gallery:** Removed all `AnimateInView` (header, “Before & After” subheader, both before/after cards, all 8 gallery items). Content is static.
- **Testimonials:** Removed all `AnimateInView` (header, 3 cards, bottom Google CTA). Static.
- **Quote / Contact:** Removed all `AnimateInView` (success block, main header, trust badges, contact card). Static.
- **About:** Removed both `AnimateInView` wrappers. Static.
- **Values:** Removed header and all 3 card `AnimateInView`. Static. Also dropped hover `transition-all` and `hover:shadow-xl hover:-translate-y-1` on value cards; kept `shadow-md` only to reduce paint cost.
- **Pricing:** Removed all `AnimateInView` (header, 2 package cards, bottom CTA). Static.
- **Contact:** Removed all `AnimateInView` (header, contact info card, form card). Static.

**Result:** **Zero** `AnimateInView` (and thus zero IntersectionObservers and zero scroll-triggered transitions) on the homepage. Scroll no longer triggers batches of style/transition work.

### B. Image and layout adjustments

- **Services:**  
  - Wrapped each card image in a container with `aspect-[4/3]` and `width={400}` / `height={300}` on `<img>` so layout is reserved and decode/layout shift is reduced.  
  - Kept `loading="lazy"` and `decoding="async"`.
- **About:**  
  - Added `width={600}` and `height={400}` to the about image to reserve space.  
  - Removed hover `transition-transform` / `hover:scale` on the “4.9” badge to avoid extra work during scroll.

No other image changes were required for the reported jank; gallery images already had dimensions.

### C. Other

- **Pricing “Get Custom Quote” button:** `scrollToSection("quote")` was changed to `scrollToSection("contact")` because the target section uses `id="contact"` (no `id="quote"`).

---

## 3. Why this improves scroll smoothness

1. **No burst of IO + transitions:** Previously, fast scroll through Services/Gallery/Testimonials/Quote caused many elements to become visible in one or a few frames, each starting an opacity + transform transition. That work happened on the main thread and compositor in the same window as Lenis’ scroll updates, causing hitches. Now, **no** scroll-driven transitions run, so scroll is just Lenis + paint of already-visible content.

2. **No IntersectionObserver cost:** Dozens of observers and callbacks were removed. Scroll no longer triggers any IO-based logic.

3. **Fewer/style changes during scroll:** Values cards no longer use `transition-all` or hover shadow/transform; Services cards no longer animate in. So there are fewer style/transition updates tied to scroll or hover in the problem areas.

4. **Stable layout:** Reserved image dimensions and aspect-ratio reduce layout shift and help the browser avoid extra reflow when images load near the viewport.

Design and content are unchanged; only scroll-triggered animation and a few hover effects were removed or simplified to prioritize scroll performance.

---

## 4. Exact code change summary

| File | Change |
|------|--------|
| `client/src/components/services-section.tsx` | Removed `AnimateInView` import and all usages (header + 6 cards). Replaced with plain `div`s. Wrapped card images in `aspect-[4/3]` container; added `width={400} height={300}` on `<img>`. |
| `client/src/components/gallery-section.tsx` | Removed `AnimateInView` import and all usages (header, subheader, 2 before/after cards, 8 gallery items). Replaced with `div`s and direct `BeforeAfterCard` / `button` rendering. |
| `client/src/components/testimonials-section.tsx` | Removed `AnimateInView` import and all usages (header, 3 cards, bottom CTA). Replaced with `div`s and direct `Card` rendering. |
| `client/src/components/quote-request-section.tsx` | Removed `AnimateInView` import and all usages (success block, main header, trust badges, contact card). Replaced with `div`s. |
| `client/src/components/about-section.tsx` | Removed `AnimateInView` import and both wrappers. Added `width={600} height={400}` to about image. Removed hover scale on “4.9” badge. |
| `client/src/components/values-section.tsx` | Removed `AnimateInView` import and all usages (header + 3 cards). Value cards: removed `transition-all`, `hover:shadow-xl`, `hover:-translate-y-1`; use `shadow-md` only. |
| `client/src/components/pricing-section.tsx` | Removed `AnimateInView` import and all usages (header, 2 cards, CTA). Replaced with `div`s and direct `Card` rendering. Button `scrollToSection("quote")` → `scrollToSection("contact")`. |
| `client/src/components/contact-section.tsx` | Removed `AnimateInView` import and all usages (header, contact card, form card). Replaced with `div`s. |

The components `client/src/components/animate-in-view.tsx` and `client/src/hooks/useInView.ts` are **unchanged** and remain available if you want scroll reveals elsewhere (e.g. another page). The CSS for `.animate-in-view` in `client/src/index.css` is also unchanged.

---

## 5. How to verify

- Scroll quickly through **Our Services**, **Our Work**, **Testimonials**, and the **Quote/Contact** area.
- Scroll should feel smooth and stable, with no visible hitch when sections enter the viewport.
- Content and layout should look the same; only the scroll-in animations are gone.

If you later want light scroll reveals again, use **at most one** `AnimateInView` per section (e.g. section wrapper or header only), not per card or per item, to avoid the same burst-of-transitions problem.
