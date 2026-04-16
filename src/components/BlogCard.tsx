import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  slug: string;
  readingTime?: number;
  coverImage?: string;
  index?: number;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogCard({
  title,
  description,
  date,
  tags,
  slug,
  readingTime,
  index = 0,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <a
        href={`/blog/${slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
        aria-label={`Read: ${title}`}
      >
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}
          onHoverStart={(_, info) => {
            const el = (info.target as HTMLElement).closest('div') as HTMLElement;
            if (el) {
              el.style.borderColor = "var(--accent-glow)";
              el.style.boxShadow =
                "0 0 28px var(--orb-color), 0 8px 28px rgba(0,0,0,0.25)";
            }
          }}
          onHoverEnd={(_, info) => {
            const el = (info.target as HTMLElement).closest('div') as HTMLElement;
            if (el) {
              el.style.borderColor = 'var(--border)';
              el.style.boxShadow = 'none';
            }
          }}
        >
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <time
              dateTime={date.toISOString()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--muted)',
                letterSpacing: '0.04em',
              }}
            >
              {formatDate(date)}
            </time>
            {readingTime && (
              <>
                <span style={{ color: 'var(--border)', fontSize: '0.75rem' }}>·</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                  }}
                >
                  {readingTime} min read
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.65,
              color: 'var(--muted)',
              flexGrow: 1,
            }}
          >
            {description}
          </p>

          {/* Tags + Read link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }} role="list" aria-label="Tags">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  role="listitem"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--muted)',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    padding: '0.175rem 0.475rem',
                    borderRadius: '4px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              Read →
            </span>
          </div>
        </motion.div>
      </a>
    </motion.article>
  );
}
