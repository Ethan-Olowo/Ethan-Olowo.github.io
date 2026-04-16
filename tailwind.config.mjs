/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Bridge CSS variables into Tailwind utilities
        bg:         'var(--bg)',
        'bg-card':  'var(--bg-card)',
        border:     'var(--border)',
        text:       'var(--text)',
        muted:      'var(--muted)',
        accent:     'var(--accent)',
      },
      fontFamily: {
        ui:   ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
