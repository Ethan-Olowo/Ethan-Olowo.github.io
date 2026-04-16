# Developer Portfolio

Personal portfolio site built with **Astro**, **React**, **Tailwind CSS**, and **Framer Motion**.

## Stack
- **Framework**: Astro 4 (SSG, file-based routing)
- **Interactive Islands**: React 18
- **Styling**: Tailwind CSS + CSS custom properties
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Fonts**: Syne (display) + JetBrains Mono (code)
- **Deployment**: GitHub Pages via Actions

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Customisation Checklist

### Identity
- [ ] `src/layouts/Layout.astro` — Update `title`, `description`, and `base` path
- [ ] `src/components/Footer.astro` — Update social links + your name in copyright
- [ ] `src/pages/index.astro` — Update bio, stats, tech strip, and CTA links

### Projects
- [ ] `src/pages/index.astro` — Replace `featuredProjects` array with your own projects
- [ ] Create MDX files in `src/content/projects/` for full project pages

### Blog
- [ ] Create MDX files in `src/content/blog/` (frontmatter schema in `src/content/config.ts`)

### Deployment (GitHub Pages)
- [ ] `astro.config.mjs` — Set `site` to your GitHub Pages URL
- [ ] `astro.config.mjs` — Set `base` to `/repo-name` if deploying to a subdirectory
- [ ] In GitHub repo: Settings → Pages → Source → GitHub Actions

### Assets
- [ ] Add `public/resume.pdf`
- [ ] Add `public/og-image.png` (1200×630)
- [ ] Add `public/favicon.ico` or `public/favicon.svg`

---

## File Structure

```
src/
├── layouts/
│   └── Layout.astro          # Base layout (SEO, fonts, theme)
├── pages/
│   ├── index.astro           # Home page
│   └── 404.astro             # Terminal-themed 404
├── components/
│   ├── Navbar.astro          # Sticky responsive nav
│   ├── Footer.astro          # Footer with socials
│   ├── ProjectCard.tsx       # Framer Motion project card
│   └── SkillsRadar.tsx       # Recharts radar chart
└── content/
    └── config.ts             # Zod schemas for blog + projects
```

---

## Deployment

Push to `main` — the GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.