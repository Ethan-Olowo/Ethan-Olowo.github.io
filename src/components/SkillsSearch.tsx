import { useState, useEffect, useMemo } from 'react';
import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { SearchEntry } from './GlobalSearch';

// ── Type icon SVGs (Shared style with GlobalSearch) ─────────────────────────
function TypeIcon({ type }: { type: SearchEntry['type'] }) {
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
  if (type === 'experience') return (
    <svg {...props}>
      <path d="M2 14V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10M2 14h12M6 14v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
    </svg>
  );
  return (
    <svg {...props}>
      <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z"/>
    </svg>
  );
}

// ── Highlight helper (Shared style with GlobalSearch) ───────────────────────
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

export default function SkillsSearch() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read initial query from URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQuery(q);

    fetch('/search-index.json')
      .then(res => res.json())
      .then(data => {
        setIndex(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load search index:', err);
        setLoading(false);
      });
  }, []);

  // Update URL when query changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }, [query]);

  const fuse = useMemo(() => {
    return new Fuse(index, {
      keys: [
        { name: 'languages', weight: 0.5 },
        { name: 'frameworks', weight: 0.3 },
        { name: 'tools', weight: 0.2 }
      ],
      threshold: 0.2,
      includeMatches: true
    });
  }, [index]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query);
  }, [fuse, query]);

  const handleTagClick = (e: React.MouseEvent, skill: string) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery(skill);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Search Input Container */}
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Filter by skill (e.g. Python, React, AWS)..."
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '1.125rem',
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
          }}
          autoFocus
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            style={{ 
              background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--muted)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading && <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading skills database...</p>}
        {!loading && query && results.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
            No projects or experiences found for "{query}"
          </p>
        )}
        
        {!loading && results.map(({ item, matches }) => (
          <a 
            href={item.url} 
            key={item.id} 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Icon */}
            <div 
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              <TypeIcon type={item.type} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text)' }}>
                  <HighlightedText text={item.title} matches={matches} field="title" />
                </h3>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', fontWeight: 600 }}>
                  {item.type}
                </span>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                <HighlightedText text={item.description} matches={matches} field="description" />
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[...(item.languages || []), ...(item.frameworks || []), ...(item.tools || [])].map(skill => {
                  const isMatch = query && skill.toLowerCase().includes(query.toLowerCase());
                  return (
                    <button 
                      key={skill} 
                      onClick={(e) => handleTagClick(e, skill)}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        padding: '0.2rem 0.6rem',
                        background: isMatch ? 'var(--accent-dim)' : 'var(--bg)',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: isMatch ? 'var(--accent)' : 'var(--border)',
                        color: isMatch ? 'var(--accent)' : 'var(--muted)',
                        fontWeight: isMatch ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMatch) {
                          e.currentTarget.style.borderColor = 'var(--muted)';
                          e.currentTarget.style.color = 'var(--text)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMatch) {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.color = 'var(--muted)';
                        }
                      }}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </a>
        ))}

        {!loading && !query && (
          <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-ui)' }}>
              Type a technology, language, or tool to explore my work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
