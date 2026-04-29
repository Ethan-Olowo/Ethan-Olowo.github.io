---
title: "Engineering This Portfolio: Astro, React Islands, and Two Themes"
date: 2026-04-28
tags: ["Astro", "React", "Web Dev", "CI/CD"]
description: "Why I chose an Astro + React Islands architecture for this site, how the content pipeline works, and the thinking behind building two visually distinct themes from a single CSS variable system."
coverImage: ""
readingTime: 6
draft: false
---

Building a personal portfolio is a deceptively loaded problem. It has to demonstrate technical ability while remaining usable to non-technical readers. It has to be fast and low-cost to host, but not feel like it's cut corners. And perhaps most awkwardly, it has to represent *who you are* as a developer,  which is a harder task than almost any other project.

I sit at the intersection of full-stack development, machine learning, and data science. A drag-and-drop template doesn't communicate that. A full-blown Next.js app with a database and server is overkill for a static site. So I landed somewhere in the middle: Astro with selective React hydration, MDX content, and a dual-theme system built entirely on CSS custom properties.

## The Core Constraint: Static Hosting on GitHub Pages

The deployment target set every other decision. GitHub Pages serves static files, there is no runtime, no server-side rendering, no Node process. Everything must be pre-rendered to HTML at build time.

Astro is purpose built for exactly this. Its output is `output: 'static'` by default: every route becomes a pre-rendered HTML file at build time, and zero JavaScript ships to the browser unless I explicitly opt a component into the client. A GitHub Actions workflow handles the rest; on every push to `main`, it runs `npm run build`, uploads the `dist/` folder as a Pages artifact, and deploys it. No manual steps, no FTP, no build server to maintain.

## Islands Architecture: React Only Where It Earns Its Place

The single most important Astro concept for this project is the **Islands Architecture**. Most of the site is pure Astro components, static HTML that ships with no JavaScript at all. React components are brought in only when interactivity is genuinely needed, and they're hydrated with specific directives that control *when* the JavaScript loads.

In practice this means two React islands on the home page:

**`SkillsRadar.tsx`**: a `RadarChart` from Recharts that renders a skill profile across six domains. It uses `client:visible`, which defers hydration until the component scrolls into the viewport. A recruiter skimming the page never pays the JavaScript cost of a chart they don't reach.

**`ProjectCard.tsx`**: each card uses Framer Motion for a `whileInView` entrance animation and a hover lift-and-glow effect. These also use `client:visible` so entrance animations only fire when the cards are actually seen, which is when they should fire anyway.

The blog and projects listing pages use a **`TagFilter.tsx`** React island with `client:load`, tag filtering requires immediate interactivity on page arrival, so it hydrates as soon as the page is ready. Framer Motion's `AnimatePresence` handles the layout transition when cards filter in and out.

Everything else (the navbar, footer, page layouts, `ProseLayout`, section headers) is pure Astro. No hydration cost whatsoever.

## Content Pipeline: MDX and Astro Content Collections

For blog posts and project write ups I use Astro's **Content Collections** with MDX. The schema is defined once in `src/content/config.ts` using Zod:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});
```

Every `.mdx` file in `src/content/blog/` is validated against this at build time. A missing `title`, a malformed date, a `draft: true` flag, any of these cause the build to either error or exclude the post before anything reaches the deployed site. There is no runtime to catch mistakes later.

The workflow is deliberately minimal:

1. Write a `.mdx` file locally.
2. Commit and push to `main`.
3. GitHub Actions builds and deploys automatically.

MDX means I can drop React components directly into prose if a post needs one, like a live diagram, a custom terminal block, or an embedded visualization, without breaking out of the writing flow.

Dynamic routes (`blog/[slug].astro`, `projects/[slug].astro`) call `getStaticPaths()` to enumerate every content entry at build time, generating one pre-rendered HTML file per post. The blog detail page also auto-generates a table of contents from `h2` and `h3` headings using `IntersectionObserver`, highlights the active section as you scroll, and surfaces related posts by shared tag.

## The Design: A Data Dashboard That Knows When to Step Back

The aesthetic started from a clear place: I work with data, terminals, and code all day, and I wanted the site to reflect that fluency without performing it. The result is what I'd describe as a restrained data dashboard, not a recreation of a terminal, but something that borrows its logic.

The dark theme is built on a deep charcoal background (`#0B0F14`) with near-white text (`#E6EDF3`) and a single vibrant teal accent (`#00F5D4`). That teal appears on exactly three things: the word mark brackets, active navigation states, and call-to-action elements. Everywhere else the palette is deliberately neutral. Monospaced type (`JetBrains Mono`) is used for tags, metadata, timestamps, and code, not decoratively, but functionally, to signal that something is a label or a value rather than prose.

The hero grid lines, the noise texture overlay, the ambient orb, each of these is present but quiet. They give the page depth without competing with content.

## The Dual-Theme System

The light mode started from a personal constraint: I wanted it to feel like a completely different space, not just the dark mode with the brightness turned up.

The entire system runs on CSS custom properties. Dark and light themes are defined as two separate variable blocks on `html.dark` and `html.light` respectively:

```css
html.dark {
  --bg:         #0B0F14;
  --accent:     #00F5D4;
  --navbar-scrolled: rgba(11, 15, 20, 0.88);
  /* ... */
}

html.light {
  --bg:         #f7efe9;
  --accent:     #2f5d50;
  --navbar-scrolled: rgba(247, 239, 233, 0.92);
  /* ... */
}
```

Because every component is built from these tokens  (never from raw hex values) switching themes requires only adding or removing a class on the `<html>` element. The toggle button in the navbar does exactly that, persisting the choice to `localStorage` and updating `<meta name="theme-color">` so the browser chrome matches.

A small inline script in `<head>` runs before the first paint and reads `localStorage`, applying the correct class before any CSS is parsed. This prevents any flash of the wrong theme on page load.

Beyond colors, I made several non color decisions that separate the two themes more distinctly:

- **Noise texture opacity**: 0.025 in dark mode, 0.018 in light. The grain is subtler over warm paper than over near-black.
- **A second paper texture** is added in light mode via `body::after`, a lower-frequency fractal noise that gives the background a slight handmade quality.
- **Grid decoration opacity**: 0.35 in dark, 0.18 in light. The hero grid steps back in the light theme so the page feels airy rather than technical.
- **Orb color**: teal-tinted glow in dark, a soft sage green (`rgba(168, 213, 194, 0.35)`) in light. The ambient light feels organic rather than electric.
- **Code block backgrounds**: `#0D1117` in dark (GitHub Dark), `#eee7e0` (warm parchment) in light. The code is readable in both without the light background reverting to harsh white.
- **Text selection**: teal-on-dark in dark mode; `#a8d5c2` (pastel green) with deep green text in light — the feeling of a natural highlighter rather than a neon one.

For the light theme itself I drew on greens, browns, and soft peach tones — deep natural green (`#2f5d50`) as the accent, warm light neutral (`#f7efe9`) as the background, earthy brown (`#4a3f35`) for body text. The first iteration of it is functional and cohesive; it will continue to evolve as I lean further into that identity.

## What I'd Do Differently

The one rough edge is the `TagFilter` component using `client:load`. For a listing page with many posts, this means the entire React + Framer Motion bundle loads before the user has interacted with anything. `client:idle` would be a better fit, it defers hydration until the browser is idle, which in practice means after the visible content has painted. On a low-end device with a slow connection, that trade-off matters.

The other thing I'd revisit is reading time. Currently it's a manual frontmatter field (`readingTime: 6`). Astro Content Collections expose `remarkPluginFrontmatter` which can be used with `remark-reading-time` to compute this automatically from the word count at build time. That removes the maintenance burden of remembering to update it every time a post changes significantly.

---

The full source is on [GitHub](https://github.com/Ethan-Olowo/Ethan-Olowo.github.io). The site is deployed to GitHub Pages and builds in under 30 seconds from a cold cache.