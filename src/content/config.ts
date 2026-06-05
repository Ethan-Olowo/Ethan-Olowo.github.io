import { defineCollection, z } from 'astro:content';

/**
 * Blog posts collection
 * Usage: create MDX files in src/content/blog/
 * e.g. src/content/blog/my-first-post.mdx
 */
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    /** Post title — shown in <h1> and meta */
    title: z.string(),

    /** Publication date — used for sorting and display */
    date: z.coerce.date(),

    /** Categorization tags — e.g. ['Python', 'Machine Learning'] */
    tags: z.array(z.string()).default([]),

    /** Short summary for cards and meta description */
    description: z.string(),

    /** OG / hero image path relative to /public */
    coverImage: z.string().optional(),

    /** Draft posts are excluded from production builds */
    draft: z.boolean().default(false),

    /** Estimated reading time in minutes (auto-calculated if omitted) */
    readingTime: z.number().optional(),
  }),
});

/**
 * Projects collection
 * Usage: create MDX files in src/content/projects/
 * e.g. src/content/projects/ptz-tracker.mdx
 */
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),

    /** Short project description for cards */
    description: z.string(),

    /** Tech stack tags */
    tags: z.array(z.string()).default([]),

    /** Tools used in project */
    tools: z.array(z.string()).default([]),

    /** Languages used in project */
    languages: z.array(z.string()).default([]),

    /** Frameworks and libraries used in project */
    frameworks: z.array(z.string()).default([]),

    /** Link to GitHub repository */
    githubUrl: z.string().url().optional(),

    /** Link to live demo or deployment */
    liveUrl: z.string().url().optional(),

    /** Hero / thumbnail image path relative to /public */
    coverImage: z.string().optional(),

    /** Controls card ordering — lower number appears first */
    order: z.number().default(99),

    /** Featured projects appear on the home page */
    featured: z.boolean().default(false),

    /** Whether to show in project listings */
    draft: z.boolean().default(false),

    type: z.array(z.enum(['software', 'data-science', 'ai-ml', 'other'])).default(['software']),
  }),
});

export const collections = { blog, projects };
