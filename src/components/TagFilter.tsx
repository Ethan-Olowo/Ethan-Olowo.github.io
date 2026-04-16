import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  slug: string;
  title: string;
  tags: string[];
  [key: string]: unknown;
}

import ProjectCardRenderer from "./ProjectCardRenderer";

interface TagFilterProps {
  items: Item[];
  emptyMessage?: string;
}

export default function TagFilter({
  items,
  emptyMessage = "No items found.",
}: TagFilterProps) {
  const [active, setActive] = useState<string | null>(null);

  // Collect all unique tags sorted by frequency
  const allTags = useMemo(() => {
    const freq: Record<string, number> = {};
    items.forEach((item) =>
      item.tags.forEach((t) => {
        freq[t] = (freq[t] ?? 0) + 1;
      }),
    );
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [items]);

  const filtered = active
    ? items.filter((item) => item.tags.includes(active))
    : items;

  return (
    <div>
      {/* Tag pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2.5rem",
        }}
        role="group"
        aria-label="Filter by tag">
        <button
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            padding: "0.35rem 0.875rem",
            borderRadius: "100px",
            border: `1px solid ${active === null ? "var(--accent)" : "var(--border)"}`,
            background: active === null ? "var(--accent-dim)" : "transparent",
            color: active === null ? "var(--accent)" : "var(--muted)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
          All
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            aria-pressed={active === tag}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 400,
              letterSpacing: "0.03em",
              padding: "0.35rem 0.875rem",
              borderRadius: "100px",
              border: `1px solid ${active === tag ? "rgba(0,245,212,0.4)" : "var(--border)"}`,
              background: active === tag ? "var(--accent-dim)" : "transparent",
              color: active === tag ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
            {tag}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}
        aria-live="polite"
        aria-atomic="true">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
        {active ? ` · ${active}` : ""}
      </p>

      {/* Items grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
            }}>
            {emptyMessage}
          </motion.p>
        ) : (
          <motion.div
            key="grid"
            layout
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "1.25rem",
            }}>
            {filtered.map((item, i) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}>
                <ProjectCardRenderer
                  item={item}
                  index={i}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
