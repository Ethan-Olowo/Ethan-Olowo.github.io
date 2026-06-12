/**
 * src/pages/search-index.json.ts
 *
 * Astro API endpoint (SSG mode) that runs once at build time and emits
 * a flat JSON array to /search-index.json in the dist/ folder.
 *
 * The GlobalSearch overlay fetches this file on first open and caches
 * it in memory for the rest of the session — no server, no external
 * service, fully compatible with GitHub Pages static hosting.
 *
 * Shape of each entry:
 * {
 *   id:          string           // unique stable key
 *   type:        'blog' | 'project' | 'page'
 *   title:       string
 *   description: string
 *   tags:        string[]
 *   excerpt:     string           // first ~200 chars of body text, markdown stripped
 *   url:         string           // absolute path, e.g. /blog/my-post
 * }
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/** Strip markdown/MDX syntax to produce plain-text excerpts. */
function stripMarkdown(raw: string): string {
  return raw
    // Remove frontmatter (shouldn't reach here but guard anyway)
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove import/export statements (MDX)
    .replace(/^(import|export).*$/gm, '')
    // Remove JSX/HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove code fences
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove bold/italic/strikethrough
    .replace(/(\*{1,3}|_{1,3}|~~)(.*?)\1/g, '$2')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove reference-style links
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    // Remove image alt text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove table pipes
    .replace(/\|/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Static pages — manually curated list.
// Add entries here whenever you add a new static .astro page.
// ---------------------------------------------------------------------------
const staticPages = [
  {
    id:          'page-home',
    type:        'page' as const,
    title:       'Home',
    description: 'Full-Stack Developer & Data Scientist — building intelligent, scalable systems.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Full-Stack Developer, Data Scientist, Machine Learning, Computer Vision, Applied AI.',
    url:         '/',
  },
  {
    id:          'page-about',
    type:        'page' as const,
    title:       'About',
    description: 'Background, skills, and the story behind the work.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'About me — Business Information Technology, AI for Science, applied machine learning.',
    url:         '/about',
  },
  {
    id:          'page-contact',
    type:        'page' as const,
    title:       'Contact',
    description: 'Get in touch about job opportunities, project collaboration, or anything else.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Contact form, email, LinkedIn, GitHub. Available for full-time roles and freelance work.',
    url:         '/contact',
  },
  {
    id:          'page-projects',
    type:        'page' as const,
    title:       'Projects',
    description: 'A collection of full-stack, ML, and computer vision projects.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Projects index — computer vision, machine learning, full-stack, Rust, Python.',
    url:         '/projects',
  },
  {
    id:          'page-blog',
    type:        'page' as const,
    title:       'Blog',
    description: 'Writing about full-stack development, machine learning, and applied AI.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Blog posts on Python, Rust, Astro, OCR, computer vision, LLMs, and more.',
    url:         '/blog',
  },
  {
    id:          'page-certifications',
    type:        'page' as const,
    title:       'Certifications',
    description: 'Professional certifications and badges in Cloud Computing, AI, and Software Engineering.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Certifications index — AWS, IBM, Cisco, AI fundamentals, Cloud computing.',
    url:         '/certifications',
  },
  {
    id:          'page-skills',
    type:        'page' as const,
    title:       'Skills',
    description: 'Search and explore my technical skills across projects and experience.',
    tags:        [],
    languages:   [],
    frameworks:  [],
    tools:       [],
    excerpt:     'Search skills — Python, React, Machine Learning, Data Science, AWS.',
    url:         '/skills',
  },
];

export const GET: APIRoute = async () => {
  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogPosts = await getCollection('blog', ({ data }) => !data.draft);

  const blogEntries = await Promise.all(
    blogPosts.map(async (post) => {
      // Render to HTML-ish string to extract body text for the excerpt
      const { remarkPluginFrontmatter } = await post.render();
      // body is the raw MDX source; strip markdown for a clean excerpt
      const excerpt = stripMarkdown(post.body).slice(0, 220);

      return {
        id:          `blog-${post.slug}`,
        type:        'blog' as const,
        title:       post.data.title,
        description: post.data.description,
        tags:        post.data.tags,
        languages:   [],
        frameworks:  [],
        tools:       [],
        excerpt,
        url:         `/blog/${post.slug}`,
      };
    })
  );

  // ── Projects ───────────────────────────────────────────────────────────────
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  const projectEntries = await Promise.all(
    projects.map(async (project) => {
      const excerpt = stripMarkdown(project.body).slice(0, 220);

      return {
        id:          `project-${project.slug}`,
        type:        'project' as const,
        title:       project.data.title,
        description: project.data.description,
        tags:        project.data.tags,
        languages:   project.data.languages,
        frameworks:  project.data.frameworks,
        tools:       project.data.tools,
        excerpt,
        url:         `/projects/${project.slug}`,
      };
    })
  );

  // ── Certifications ─────────────────────────────────────────────────────────
  const certs = await getCollection('certifications');

  const certificationEntries = await Promise.all(
    certs.map(async (cert) => {
      const excerpt = stripMarkdown(cert.body).slice(0, 220);

      return {
        id:          `cert-${cert.slug}`,
        type:        'certification' as const,
        title:       cert.data.title,
        description: cert.data.issuer,
        tags:        cert.data.tags,
        languages:   cert.data.languages,
        frameworks:  cert.data.frameworks,
        tools:       cert.data.tools,
        excerpt,
        url:         `/certifications?q=${encodeURIComponent(cert.data.title)}`,
      };
    })
  );

  // ── Experience ──────────────────────────────────────────────────────────────
  const experiences = await getCollection('experience');

  const experienceEntries = await Promise.all(
    experiences.map(async (exp) => {
      const excerpt = stripMarkdown(exp.body).slice(0, 220);

      return {
        id:          `exp-${exp.slug}`,
        type:        'experience' as const,
        title:       exp.data.role,
        description: exp.data.company,
        tags:        [],
        languages:   exp.data.languages,
        frameworks:  exp.data.frameworks,
        tools:       exp.data.tools,
        excerpt,
        url:         `/about#experience`,
      };
    })
  );

  // ── Combine and emit ───────────────────────────────────────────────────────
  const index = [
    ...blogEntries,
    ...projectEntries,
    ...certificationEntries,
    ...experienceEntries,
    ...staticPages
  ];

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      // Allow client-side fetch from the same origin
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
