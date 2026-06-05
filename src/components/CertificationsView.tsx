import { useState, useMemo, useCallback, useRef, useId, useEffect } from 'react';
import Fuse, { type IFuseOptions, type FuseResultMatch } from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import CertificationCard from './CertificationCard';

export interface CertificationItem {
  slug: string;
  title: string;
  issuer: string;
  dateCompleted: string;
  tags: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  badgeImage?: string;
  credentialUrl?: string;
}

interface CertificationsViewProps {
  items: CertificationItem[];
}

const FUSE_OPTIONS: IFuseOptions<CertificationItem> = {
  keys: [
    { name: 'title',       weight: 0.60 },
    { name: 'issuer',      weight: 0.30 },
    { name: 'tags',        weight: 0.10 },
  ],
  threshold: 0.35,
  includeMatches: true,
  ignoreLocation: true,
};

export default function CertificationsView({ items }: CertificationsViewProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  // ── Deep linking: Load query from URL ──────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      // Optional: Clear the URL param to keep it clean
      // window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

  const allFilterOptions = useMemo(() => {
    const freq: Record<string, number> = {};
    items.forEach(item => {
      item.tags.forEach(t => {
        freq[t] = (freq[t] ?? 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)
      .slice(0, 15); // Top 15 tags to keep it clean
  }, [items]);

  const results = useMemo(() => {
    let pool = items;

    if (query.trim().length >= 2) {
      pool = fuse.search(query.trim()).map(r => r.item);
    }

    if (activeFilter) {
      pool = pool.filter(item => 
        item.tags.includes(activeFilter)
      );
    }

    return pool;
  }, [query, activeFilter, fuse, items]);

  const handleFilterClick = useCallback((filter: string) => {
    setActiveFilter(prev => (prev === filter ? null : filter));
  }, []);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="certs-view">
      {/* ── Search input ──────────────────────────────────────── */}
      <div className="certs-search-container">
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
          className="certs-search-icon"
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
          placeholder="Search certifications, issuers, or tools..."
          className="certs-search-input"
          autoComplete="off"
        />

        {hasQuery && (
          <button
            onClick={() => setQuery('')}
            className="certs-search-clear"
            aria-label="Clear search"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Filter pills ─────────────────────────────────────────── */}
      <div className="certs-filters" role="group" aria-label="Filter by tag or tool">
        <button
          onClick={() => setActiveFilter(null)}
          className={`certs-filter-pill ${activeFilter === null ? 'active' : ''}`}
        >
          All
        </button>
        {allFilterOptions.map(filter => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`certs-filter-pill ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Results meta ──────────────────────────────────────── */}
      <div className="certs-meta">
        <span>{results.length} {results.length === 1 ? 'certification' : 'certifications'}</span>
        {hasQuery && <span className="certs-meta-sep">·</span>}
        {hasQuery && <span className="certs-meta-query">"{query}"</span>}
      </div>

      {/* ── Results List ──────────────────────────────────────── */}
      <div className="certs-list">
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="certs-empty"
            >
              <p>No certifications found matching your criteria.</p>
              <button onClick={() => { setQuery(''); setActiveFilter(null); }}>Clear all filters</button>
            </motion.div>
          ) : (
            results.map((item, i) => (
              <CertificationCard
                key={item.slug}
                {...item}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .certs-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .certs-search-container {
          position: relative;
        }

        .certs-search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
        }

        .certs-search-input {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: var(--font-ui);
          font-size: 0.9375rem;
          padding: 0.75rem 2.75rem 0.75rem 2.625rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .certs-search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .certs-search-clear {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--border);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          cursor: pointer;
        }

        .certs-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .certs-filter-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .certs-filter-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .certs-filter-pill.active {
          background: var(--accent-dim);
          border-color: var(--accent);
          color: var(--accent);
        }

        .certs-meta {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .certs-meta-sep {
          opacity: 0.5;
        }

        .certs-meta-query {
          color: var(--accent);
          text-transform: none;
        }

        .certs-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .certs-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .certs-empty button {
          background: none;
          border: none;
          color: var(--accent);
          text-decoration: underline;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
