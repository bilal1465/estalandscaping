# ESTA Landscaping — Performance & Smoothness Optimizations

## Summary: What Was Causing Lag

1. **Duplicate, heavy scroll animations**  
   `useScrollReveal` ran GSAP ScrollTrigger on every `section img` and every `section h2`/`h3`, using **filter: blur(6px)** and scale animations. That meant many ScrollTrigger instances, blur (expensive on the GPU), and overlap with the existing AnimateInView CSS transitions. This was a major source of jank and delayed feeling.

2. **ScrollTrigger on every Lenis scroll**  
   `lenis.on("scroll", ScrollTrigger.update)` ran on every scroll tick. With many ScrollTrigger instances from useScrollReveal, this added unnecessary work and could cause stutter.

3. **Custom cursor**  
   The cursor used **gsap.set()** inside a **requestAnimationFrame** loop every frame to update position and scale. That meant constant GSAP work and DOM updates every frame.

4. **Intro exit**  
   The intro used **filter: blur(12px)** on exit, which is costly. The total intro sequence was also a bit long (~2.7s).

5. **Slower animation timings**  
   Section reveal duration was 400ms with stagger up to 400ms, so content felt like it was appearing late. General durations (200–400ms) were on the heavier side.

6. **Scrolling not unified**  
   Hero, Quote, Footer, and Pricing used native `scrollIntoView` while the rest of the app used Lenis, so scroll behavior was inconsistent and could feel disjointed.

7. **Navigation header**  
   `backdrop-blur-md` on the sticky header added extra compositing work.

---

## What Was Changed

### Animations / effects simplified or rebuilt

- **Removed `useScrollReveal`**  
  No more GSAP ScrollTrigger on all section images and headings. Section reveals are handled only by **AnimateInView** (CSS opacity + transform). This removes blur-based animations and duplicate logic.

- **Lenis only**  
  ScrollTrigger was removed from the smooth-scroll hook. Lenis runs on its own with no ScrollTrigger registration or `scroll` listener. Scroll is lighter and more predictable.

- **Custom cursor**  
  Rebuilt to use a single **requestAnimationFrame** loop that updates the cursor with **style.transform** and **style.opacity** only. No GSAP in the loop. Scale is smoothed by lerping toward the target scale in the same loop. Hover state still updates scale/opacity smoothly without extra libraries per frame.

- **Intro**  
  Exit no longer uses blur: only **opacity** is animated (0.35s). Hold before exit shortened (0.35s instead of 0.5s). Total intro is a bit shorter and leaves the page faster.

- **AnimateInView (CSS)**  
  Durations shortened: **--duration-slow: 320ms** (was 400ms), **--duration-normal: 260ms**, **--duration-fast: 180ms**. Stagger steps reduced to **50ms** (max 250ms). **translateY** reduced from 24px to **18px**. Reveals feel quicker and more responsive.

- **Navigation**  
  Header blur reduced from **backdrop-blur-md** to **backdrop-blur-sm** to cut compositing cost while keeping the effect.

---

## Scrolling smoothness

- **Lenis config**  
  - **duration: 0.85** (was 1.1) for snappier response.  
  - **touchMultiplier: 1.5** (was 1.2).  
  - **smoothTouch: false** so touch devices use native scrolling and avoid Lenis overhead on mobile.  
  - **ScrollTrigger removed** so no scroll-linked calculations run on each tick.

- **Unified scroll-to-section**  
  Hero, QuoteSection, Footer, and PricingSection now use **useLenisRef** and **lenis.scrollTo()** when Lenis is available, with **scrollIntoView** as fallback. All in-page links use the same smooth scroll behavior.

---

## Mobile performance

- **Touch devices**  
  Lenis runs with **smoothTouch: false**, so touch scroll is native and avoids extra JS work.

- **Custom cursor**  
  Already hidden on touch (pointer: fine check). No change.

- **Reduced motion**  
  Existing `prefers-reduced-motion` rules are unchanged; animations are disabled for users who request it.

- **Lighter timings**  
  Shorter durations and stagger help mobile feel more responsive.

---

## Images and rendering

- **Hero**  
  **Preload** added for the hero background image in `index.html` (`/images/image-36.JPG`) to improve LCP. Hero container uses **min-h-screen** and the background div has **role="img"** and **aria-label** for accessibility. Removed an unnecessary transition class on the background.

- **Gallery / about**  
  Existing **loading="lazy"** and **decoding="async"** on images kept. Gallery items use fixed height (**h-48**) and **object-cover** so layout is stable.

- **content-visibility**  
  Considered for sections but not applied, to avoid affecting Lenis scroll height and layout.

---

## Technical practices

- **Single rAF loop for cursor**  
  One loop updates position and scale; no GSAP in the loop; cleanup with **cancelAnimationFrame** on unmount.

- **Passive scroll listener**  
  Navigation uses **passive: true** for the scroll listener.

- **AnimateInView**  
  Uses **will-change: opacity, transform** only while not visible; **will-change: auto** when visible to avoid unnecessary layers.

- **IntersectionObserver**  
  **useInView** uses **requestAnimationFrame** when toggling the visible state. **rootMargin** set to **-6%** and **threshold** to **0.08** so elements reveal slightly earlier and feel less late.

---

## Tradeoffs

- **ScrollTrigger removed**  
  Any future scroll-based effects (e.g. parallax) would need to be reimplemented (e.g. with Lenis scroll event or a lightweight observer). Current design relies on AnimateInView only for reveal, which is sufficient and performant.

- **Lenis on desktop only (smooth touch off)**  
  Mobile uses native scroll. Scrolling is consistent and fast on touch; desktop keeps Lenis smoothness.

- **Less blur**  
  Blur was removed from intro exit and reduced on the nav. The site still looks polished with less GPU cost.

- **useScrollReveal.ts**  
  File is still in the repo but unused. It can be deleted or repurposed later.

---

## Result

The site should feel:

- **Smoother** — One reveal system (AnimateInView), no ScrollTrigger on scroll, lighter Lenis config.  
- **Faster** — Shorter durations, no blur on intro exit, preloaded hero image.  
- **More consistent** — Same Lenis-based scroll for all in-page links when available.  
- **Lighter on mobile** — Native touch scroll, no custom cursor, quicker animations.  
- **Still premium** — Same layout and motion style, with less overhead and no obvious lag or delayed content.
