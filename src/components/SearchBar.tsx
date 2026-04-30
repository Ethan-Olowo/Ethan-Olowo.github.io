/**
 * SearchBar.tsx
 *
 * Local search + tag filter widget for /blog and /projects listing pages.
 * Receives all items as props (already on the page), so no network fetch is
 * needed. Uses Fuse.js for fuzzy matching across title, description, tags,
 * and excerpt. Tag pills narrow the results further after the text search.
 *
 * Props:
 *   items        — serialized content items (blog posts or projects)
 *   type         — 'blog' | 'project' — determines which card renderer to use
 *   emptyMessage — string shown when no results match
 */

import { useState, useMemo, useCallback, useRef, useId } from 'react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import ProjectCard from './ProjectCard';

// ── Types ──────────────────────────────────────────────────────────────────
export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  excerpt?: string;
  // blog-only
  date?: string;
  readingTime?: number | null;
  coverImage?: string | null;
  // project-only
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

interface SearchBarProps {
  items: SearchItem[];
  type: 'blog' | 'project';
  emptyMessage?: string;
}

// ── Fuse config ────────────────────────────────────────────────────────────
const FUSE_OPTIONS: Fuse.IFuseOptions<SearchItem> = {
  keys: [
    { name: 'title',       weight: 0.45 },
    { name: 'tags',        weight: 0.30 },
    { name: 'description', weight: 0.20 },
    { name: 'excerpt',     weight: 0.05 },
  ],
  threshold:        0.35,   // 0 = exact, 1 = match anything
  includeScore:     true,
  includeMatches:   true,
  ignoreLocation:   true,   // don't penalise matches far from string start
  useExtendedSearch: false,
  minMatchCharLength: 2,
};

// ── Highlight helper ───────────────────────────────────────────────────────
/** Wraps matched character ranges in <mark> for the title display. */
function highlightText(
  text: string,
  matches: readonly Fuse.FuseResultMatch[] | undefined,
  key: string,
): React.ReactNode {
  if (!matches) return text;
  const match = matches.find(m => m.key === key);
  if (!match?.indices?.length) return text;

  const indices = [...match.indices].sort((a, b) => a[0] - b[0]);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const [start, end] of indices) {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark
        key={`${start}-${end}`}
        style={{
          background: 'var(--accent-dim)',
          color: 'var(--accent)',
          borderRadius: '2px',
          padding: '0 1px',
        }}
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    cursor = end + 1;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function SearchBar({
  items,
  type,
  emptyMessage = 'No results found.',
}: SearchBarProps) {
  const [query, setQuery]       = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const searchId                = useId();

  // Build Fuse index once (memoised — only rebuilds if items reference changes)
  const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

  // All unique tags, sorted by frequency
  const allTags = useMemo(() => {
    const freq: Record<string, number> = {};
    items.forEach(item => item.tags.forEach(t => { freq[t] = (freq[t] ?? 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [items]);

  // Fuzzy search + tag gate
  const { results, fuseMatches } = useMemo(() => {
    let pool = items;
    let matches: Map<string, Fuse.FuseResultMatch[]> = new Map();

    if (query.trim().length >= 2) {
      const raw = fuse.search(query.trim());
      pool = raw.map(r => r.item);
      raw.forEach(r => {
        if (r.matches) matches.set(r.item.slug, r.matches as Fuse.FuseResultMatch[]);
      });
    }

    if (activeTag) {
      pool = pool.filter(item => item.tags.includes(activeTag));
    }

    return { results: pool, fuseMatches: matches };
  }, [query, activeTag, fuse, items]);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag(prev => (prev === tag ? null : tag));
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      {/* ── Search input ──────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          marginBottom: '1.25rem',
        }}
      >
        {/* Search icon */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        >
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        <input
          ref={inputRef}
          id={searchId}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={type === 'blog' ? 'Search posts…' : 'Search projects…'}
          aria-label={type === 'blog' ? 'Search blog posts' : 'Search projects'}
          autoComplete="off"
          spellCheck={false}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9375rem',
            padding: '0.7rem 2.75rem 0.7rem 2.625rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Clear button */}
        <AnimatePresence>
          {hasQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={clearSearch}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'grid',
                placeItems: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--border)',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tag pills ─────────────────────────────────────────── */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}
        role="group"
        aria-label="Filter by tag"
      >
        <button
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.71rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            padding: '0.28rem 0.75rem',
            borderRadius: '100px',
            border: `1px solid ${activeTag === null ? 'var(--accent)' : 'var(--border)'}`,
            background: activeTag === null ? 'var(--accent-dim)' : 'transparent',
            color: activeTag === null ? 'var(--accent)' : 'var(--muted)',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            aria-pressed={activeTag === tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.71rem',
              fontWeight: 400,
              letterSpacing: '0.03em',
              padding: '0.28rem 0.75rem',
              borderRadius: '100px',
              border: `1px solid ${activeTag === tag ? 'rgba(var(--accent-rgb, 0,245,212), 0.4)' : 'var(--border)'}`,
              background: activeTag === tag ? 'var(--accent-dim)' : 'transparent',
              color: activeTag === tag ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Results meta ──────────────────────────────────────── */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{results.length} {results.length === 1 ? 'result' : 'results'}</span>
        {hasQuery && <span style={{ color: 'var(--border)' }}>·</span>}
        {hasQuery && (
          <span style={{ color: 'var(--accent)', textTransform: 'none', letterSpacing: 0 }}>
            "{query.trim()}"
          </span>
        )}
        {activeTag && <span style={{ color: 'var(--border)' }}>·</span>}
        {activeTag && <span>{activeTag}</span>}
      </p>

      {/* ── Results grid ──────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '3rem 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"
              style={{ color: 'var(--border)' }}>
              <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M22 22L29 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14h8M14 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--muted)' }}>
              {emptyMessage}
            </p>
            {(hasQuery || activeTag) && (
              <button
                onClick={() => { setQuery(''); setActiveTag(null); }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {results.map((item, i) => {
              const matches = fuseMatches.get(item.slug);
              const highlightedTitle = highlightText(item.title, matches, 'title');

              return (
                <motion.div
                  key={item.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {type === 'blog' ? (
                    <BlogCard
                      title={item.title}
                      description={item.description}
                      date={new Date(item.date!)}
                      tags={item.tags}
                      slug={item.slug}
                      readingTime={item.readingTime ?? undefined}
                      index={i}
                      highlightedTitle={highlightedTitle}
                    />
                  ) : (
                    <ProjectCard
                      title={item.title}
                      description={item.description}
                      tags={item.tags}
                      githubUrl={item.githubUrl}
                      liveUrl={item.liveUrl}
                      slug={item.slug}
                      index={i}
                      highlightedTitle={highlightedTitle}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
