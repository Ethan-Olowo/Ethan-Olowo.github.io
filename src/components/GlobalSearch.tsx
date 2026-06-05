/**
 * GlobalSearch.tsx
 *
 * Full-site search overlay. Triggered by:
 *   - Navbar search button  → dispatches 'global-search-open' on window
 *   - Keyboard shortcut ⌘F / Ctrl+F
 *   - Escape to dismiss
 *
 * The component manages its own open/close state internally and listens for
 * the custom DOM event fired by the Astro navbar button (which can't use
 * React props directly). This keeps the island self-contained.
 *
 * Data: fetches /search-index.json once on first open, caches in module
 * scope for the rest of the session. Fuse.js fuzzy-matches across title,
 * description, tags, and excerpt. Results are grouped by type
 * (Blog → Project → Page) with keyboard-navigable items.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Fuse, { type IFuseOptions, type FuseResultMatch, type FuseResult } from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────
export interface SearchEntry {
  id: string;
  type: 'blog' | 'project' | 'page' | 'certification';
  title: string;
  description: string;
  tags: string[];
  technologies?: string[];
  excerpt: string;
  url: string;
}

type GroupKey = 'blog' | 'project' | 'page' | 'certification';
type FilterType = 'all' | GroupKey;

const GROUP_LABELS: Record<GroupKey, string> = {
  blog:          'Blog',
  project:       'Projects',
  certification: 'Certifications',
  page:          'Pages',
};

const GROUP_ORDER: GroupKey[] = ['blog', 'project', 'certification', 'page'];

// ── Fuse config ────────────────────────────────────────────────────────────
const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  keys: [
    { name: 'title',        weight: 0.45 },
    { name: 'languages',    weight: 0.15 },
    { name: 'frameworks',   weight: 0.10 },
    { name: 'tools',        weight: 0.05 },
    { name: 'tags',         weight: 0.15 },
    { name: 'description',  weight: 0.05 },
    { name: 'excerpt',      weight: 0.05 },
  ],
  threshold:         0.35,
  includeScore:      true,
  includeMatches:    true,
  ignoreLocation:    true,
  minMatchCharLength: 2,
};

// ── Module-level cache (persists across re-renders) ────────────────────────
let cachedIndex: SearchEntry[] | null = null;
let cachedFuse:  Fuse<SearchEntry>  | null = null;

// ── Type icon SVGs ─────────────────────────────────────────────────────────
function TypeIcon({ type }: { type: GroupKey }) {
  const props = {
    width: '14', height: '14', viewBox: '0 0 16 16',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (type === 'blog') return (
    <svg {...props}>
      <path d="M2 3h12M2 6h8M2 9h10M2 12h6"/>
    </svg>
  );
  if (type === 'project') return (
    <svg {...props}>
      <path d="M5.5 5 2.5 8 5.5 11 M10.5 5 13.5 8 10.5 11 M9 4 7 12" />
    </svg>
  );
  if (type === 'certification') return (
    <svg {...props}>
      <circle cx="8" cy="6" r="3.5" />
      <path d="M6.5 9.2 5.5 14l2.5-1.7L10.5 14l-1-4.8" />
    </svg>
  );
  return (
    <svg {...props}>
      <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z"/>
    </svg>
  );
}

// ── Highlight helper ───────────────────────────────────────────────────────
function HighlightedText({
  text,
  matches,
  field,
}: {
  text: string;
  matches: readonly FuseResultMatch[] | undefined;
  field: string;
}) {
  if (!matches) return <>{text}</>;
  const match = matches.find(m => m.key === field);
  if (!match?.indices?.length) return <>{text}</>;

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
          fontWeight: 600,
        }}
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    cursor = end + 1;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

// ── Main component ─────────────────────────────────────────────────────────
// Self-contained: manages its own isOpen state.
// Opens via: custom 'global-search-open' DOM event OR ⌘F/Ctrl+F.
// Closes via: Escape, backdrop click, result click, ESC kbd button.
export default function GlobalSearch() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);
  const [results, setResults] = useState<Array<FuseResult<SearchEntry>>>([]);
  const [cursor,  setCursor]  = useState(-1);
  // Active filter tab: 'all', 'blog', 'project', or 'page'
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLUListElement>(null);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen  = useCallback(() => setIsOpen(true),  []);

  // ── Load & cache index on first open ──────────────────────────────────
  const loadIndex = useCallback(async () => {
    if (cachedFuse) return;                        // already loaded
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) throw new Error('Failed to fetch search index');
      const data: SearchEntry[] = await res.json();
      cachedIndex = data;
      cachedFuse  = new Fuse(data, FUSE_OPTIONS);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Listen for custom DOM event from Astro navbar ─────────────────────
  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener('global-search-open', handler);
    return () => window.removeEventListener('global-search-open', handler);
  }, [onOpen]);

  // ── Open / close side effects ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      loadIndex();
      setQuery('');
      setResults([]);
      setCursor(-1);
      setActiveFilter("all");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, loadIndex]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        isOpen ? onClose() : onOpen();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onOpen, onClose]);

  // ── Run search whenever query changes ──────────────────────────────────
  useEffect(() => {
    if (!cachedFuse || query.trim().length < 2) {
      setResults(cachedFuse && query.trim().length === 0
        ? cachedIndex!.slice(0, 8).map(item => ({ item, refIndex: 0, score: 1 }))
        : []);
      setCursor(-1);
      return;
    }
    const r = cachedFuse.search(query.trim(), { limit: 20 });
    setResults(r);
    setCursor(-1);
  }, [query]);

  // Also show recent items when overlay opens with empty query
  useEffect(() => {
    if (isOpen && query === '' && cachedIndex) {
      setResults(cachedIndex.slice(0, 8).map(item => ({ item, refIndex: 0, score: 1 })));
    }
  }, [isOpen, query]);

  // ── Filter and Normalization Logic ──────────────────────

  // 1. Filter raw results by the active tab
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    return results.filter((r) => r.item.type === activeFilter);
  }, [results, activeFilter]);

  // 2. Normalize results into the visual order (Blog > Project > Page)
  // This array is what keyboard navigation will actually traverse.
  const visualResults = useMemo(() => {
    const ordered: Array<{
      result: FuseResult<SearchEntry>;
      visualIndex: number;
    }> = [];
    let counter = 0;

    GROUP_ORDER.forEach((groupKey) => {
      filteredResults.forEach((res) => {
        if (res.item.type === groupKey) {
          ordered.push({ result: res, visualIndex: counter++ });
        }
      });
    });
    return ordered;
  }, [filteredResults]);

  // 3. Re-group for rendering, using the visualIndex we calculated
  const grouped = useMemo(() => {
    const g: Partial<Record<GroupKey, typeof visualResults>> = {};
    visualResults.forEach((item) => {
      const key = item.result.item.type as GroupKey;
      if (!g[key]) g[key] = [];
      g[key]!.push(item);
    });
    return g;
  }, [visualResults]);

  // ── Improved Keyboard Navigation ────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Ensure we can't go past the end of the current filtered list
      setCursor((c) => Math.min(c + 1, visualResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Restore Focus to Input: If at 0, go to -1
      setCursor((c) => {
        const next = c - 1;
        if (next === -1) inputRef.current?.focus();
        return Math.max(next, -1);
      });
    } else if (e.key === 'Enter' && cursor >= 0) {
      e.preventDefault();
      const target = visualResults[cursor]?.result.item;
      if (target) {
        window.location.href = target.url;
        onClose();
      }
    }
  };

  // Stable scroll handling
  useEffect(() => {
    if (cursor < 0) {
      // Fix: If cursor is -1 (input), ensure container stays at top
      listRef.current?.parentElement?.scrollTo({ top: 0 });
      return;
    }
    if (!listRef.current) return;

    // Find item by visual index
    const items = listRef.current.querySelectorAll("[data-result-item]");
    const item = items[cursor] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const hasResults = visualResults.length > 0;
  const showEmpty  = !loading && !error && query.trim().length >= 2 && !hasResults;

  // ── Result item renderer ───────────────────────────────────────────────
  const ResultItem = ({
    result,
    visualIndex,
  }: {
    result: FuseResult<SearchEntry>;
    visualIndex: number;
  }) => {
    const { item, matches } = result;
    const isFocused = cursor === visualIndex;

    return (
      <li data-result-item>
        <a
          href={item.url}
          onClick={() => { onClose(); }}
          aria-selected={isFocused}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.625rem 0.875rem',
            borderRadius: '8px',
            textDecoration: 'none',
            background: isFocused ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${isFocused ? 'var(--accent)' : 'transparent'}`,
            transition: 'background 0.12s, border-color 0.12s',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setCursor(visualIndex)}>
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: isFocused ? 'var(--accent)' : 'var(--bg)',
              border: '1px solid var(--border)',
              color: isFocused ? 'var(--bg)' : 'var(--muted)',
              flexShrink: 0,
              marginTop: '1px',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            <TypeIcon type={item.type} />
          </span>

          {/* Text */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isFocused ? 'var(--accent)' : 'var(--text)',
                marginBottom: '0.2rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.12s',
              }}
            >
              <HighlightedText text={item.title} matches={matches} field="title" />
            </p>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--muted)',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              <HighlightedText text={item.description} matches={matches} field="description" />
            </p>
            {/* Tags & Tech */}
            {(item.tags.length > 0 || (item.technologies && item.technologies.length > 0)) && (
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                {item.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--muted)',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {item.technologies?.slice(0, 3).map((tech: string) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--accent)',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '3px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </a>
      </li>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{ opacity: 0,    y: -8,  scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '10%',
              transform: 'translateX(-50%)',
              width: 'min(640px, calc(100vw - 2rem))',
              maxWidth: '80%',
              maxHeight: 'calc(100vh - 120px)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 201,
            }}
          >
            {/* Input row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {/* Search icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                aria-hidden="true" style={{ color: 'var(--muted)', flexShrink: 0 }}>
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>

              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search everything…"
                aria-label="Search the site"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '1rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              />

              {/* Kbd hint */}
              <kbd
                aria-label="Press Escape to close"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '0.15rem 0.4rem',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
                onClick={onClose}
              >
                ESC
              </kbd>
            </div>

            {/* Filter Tabs UI */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-card-alt)",
              }}>
              {(["all", ...GROUP_ORDER] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    setCursor(-1);
                  }}
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    border: "1px solid",
                    transition: "all 0.1s",
                    borderColor:
                      activeFilter === f ? "var(--accent)" : "transparent",
                    background:
                      activeFilter === f ? "var(--accent-dim)" : "transparent",
                    color:
                      activeFilter === f ? "var(--accent)" : "var(--muted)",
                    textTransform: "capitalize",
                  }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Results area */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loading && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" aria-hidden="true"
                    style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    Loading index…
                  </p>
                </div>
              )}

              {error && (
                <p style={{
                  padding: '2rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#f87171',
                  }}>
                  Failed to load search index. Check your network connection.
                </p>
              )}

              {!loading && !error && !hasResults && query.trim().length < 2 && (
                <p style={{
                  padding: '1.5rem 1.25rem 0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  }}>
                  {query ? 'Keep typing…' : 'Browse all content'}
                </p>
              )}

              {showEmpty && (
                <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--muted)' }}>
                    No results for "<strong style={{ color: 'var(--text)' }}>{query}</strong>"
                  </p>
                </div>
              )}

              {/* Grouped results */}
              {!loading && !error && hasResults && (
                <ul
                  ref={listRef}
                  role="listbox"
                  aria-label="Search results"
                  style={{ listStyle: 'none', padding: '0.5rem' }}
                >
                  {GROUP_ORDER.map((groupKey) => {
                    const groupItems = grouped[groupKey];
                    if (!groupItems?.length) return null;
                    return (
                      <li key={groupKey}>
                        {/* Group header */}
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            padding: '0.5rem 0.875rem 0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                          }}>
                          <TypeIcon type={groupKey} /> {GROUP_LABELS[groupKey]}
                        </p>
                        <ul style={{ listStyle: 'none' }}>
                          {groupItems.map(({ result, visualIndex }) => (
                            <ResultItem
                              key={result.item.id}
                              result={result}
                              visualIndex={visualIndex}
                            />
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              }}>
              {[
                { key: '↑↓', desc: 'navigate' },
                { key: '↵', desc: 'open' },
                { key: 'Esc', desc: 'close' },
              ].map(({ key, desc }) => (
                <span
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--muted)',
                  }}
                >
                  <kbd style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '0.1rem 0.35rem',
                    fontSize: '0.65rem',
                    }}>
                    {key}
                  </kbd>
                  {desc}
                </span>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--border)' }}>
                powered by Fuse.js
              </span>
            </div>
          </motion.div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
}
