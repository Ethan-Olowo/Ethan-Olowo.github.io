# Project: Developer Portfolio (Ethan Olowo)

Personal portfolio site built with **Astro 4**, **React**, **Tailwind CSS**, and **Framer Motion**. It serves as a showcase for projects, skills, and blog posts.

## Project Overview
- **Architecture:** Static Site Generation (SSG) using Astro.
- **Frontend:** Astro components for static structure, React for interactive islands (Framer Motion, Recharts, Search).
- **Styling:** Tailwind CSS with extensive use of CSS custom properties for dual-theme support (Dark/Light).
- **Content:** Managed via Astro Content Collections (Markdown/MDX) with Zod schemas.
- **Deployment:** GitHub Pages (Static output).

## Tech Stack
- **Framework:** Astro 4
- **UI Libraries:** React 18, Framer Motion (animations), Recharts (data viz)
- **Search:** Fuse.js for client-side search indexing
- **Fonts:** Syne (display), JetBrains Mono (monospace)

## Core Commands
- `npm run dev`: Start development server with HMR.
- `npm run build`: Generate static site in `dist/`.
- `npm run check`: Run Astro and TypeScript type-checking.
- `npm run preview`: Locally preview the production build.

## Development Conventions

### Content Management
- **Projects:** Defined in `src/content/projects/`. Schema in `src/content/config.ts` includes `tags` (concepts/domains) and a split tech stack: `languages`, `frameworks`, and `tools`.
- **Blog:** Defined in `src/content/blog/`. Schema is in `src/content/config.ts`.
- **Images:** Assets should be placed in `public/` or `src/assets/`. Project/Blog cover images are typically referenced relative to `/public`.

### Components
- **Astro Components:** Prefer for static elements (Navbar, Footer, Layouts) to minimize client-side JS.
- **React Components:** Use for complex interactivity or when using libraries like Framer Motion or Recharts. Ensure they are used with `client:load` or `client:visible` directives in Astro files when interactivity is needed.

### Styling & Theming
- **CSS Variables:** Colors and theme-specific values are defined in `src/layouts/Layout.astro` under `:root`, `html.dark`, and `html.light`.
- **Tailwind:** Use Tailwind for layout and utility styling. Custom properties are used within Tailwind or standard CSS as needed.
- **Themes:** Dark mode is the default. Theme state is persisted in `localStorage` and toggled via a script in `Layout.astro`.

### Layouts
- `src/layouts/Layout.astro`: Base layout containing SEO meta tags, fonts, and global styles.
- `src/layouts/ProseLayout.astro`: Specialized layout for long-form content (blog posts, project details).

## Key Files
- `astro.config.mjs`: Astro configuration and integrations.
- `src/content/config.ts`: Zod schema definitions for content collections.
- `src/layouts/Layout.astro`: The root layout and global CSS/theme logic.
- `tailwind.config.mjs`: Tailwind configuration.
