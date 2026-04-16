import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';


export default defineConfig({
  site: 'https://ethan_olowo.github.io', 
  base: '/',                               // TODO: Replace with /repo-name if needed

  output: 'static', // GitHub Pages requires static export

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ],

  // Markdown config for blog posts
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // Vite config
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'recharts'],
    },
  },
});
