# Personal Portfolio

This is a personal portfolio site built with **Astro**, **React**, **Tailwind CSS**, and **Framer Motion**. It showcases projects, skills, and a blog section, serving as a central hub for professional and personal development highlights.

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
## Current State

The portfolio is structured to highlight key projects and skills. It includes:
- A homepage with an introduction, featured projects, and a call-to-action.
- A dedicated projects section with detailed pages for each project.
- A blog section for sharing insights and experiences.
- A responsive design with smooth animations and interactive elements.

The site is fully functional and deployed on GitHub Pages. It is designed to be easily extendable, allowing for the addition of new projects, blog posts, and other content as needed.

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

The site is automatically deployed via GitHub Actions. Any changes pushed to the `main` branch trigger a build and deployment process, ensuring the live site is always up-to-date.