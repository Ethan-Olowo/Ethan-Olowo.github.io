import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Content collection slug — if provided, the card title links to the detail page */
  slug?: string;
  index?: number;
}

const GitHubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true">
    <path
      d="M2 12L12 2M12 2H6M12 2v6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProjectCard({
  title,
  description,
  tags,
  githubUrl,
  liveUrl,
  slug,
  index = 0,
}: ProjectCardProps) {
  // Handler to prevent card navigation when clicking external links
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const cardContent = (
    <>
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.2 }}
        style={{
          position: "absolute",
          top: 0,
          left: "1.5rem",
          right: "1.5rem",
          height: "2px",
          background: "linear-gradient(90deg, var(--accent), transparent)",
          transformOrigin: "left",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}>
        <h3
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}>
          {title}
        </h3>

        {/* Links */}
        <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} on GitHub`}
              style={{
                display: "grid",
                placeItems: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const a = e.currentTarget;
                a.style.color = "var(--accent)";
                a.style.borderColor = "var(--badge-border)";
                a.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                const a = e.currentTarget;
                a.style.color = "var(--muted)";
                a.style.borderColor = "var(--border)";
                a.style.background = "transparent";
              }}
              onClick={stopPropagation}>
              <GitHubIcon />
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo of ${title}`}
              style={{
                display: "grid",
                placeItems: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const a = e.currentTarget;
                a.style.color = "var(--accent)";
                a.style.borderColor = "var(--badge-border)";
                a.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                const a = e.currentTarget;
                a.style.color = "var(--muted)";
                a.style.borderColor = "var(--border)";
                a.style.background = "transparent";
              }}
              onClick={stopPropagation}>
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "var(--muted)",
          flexGrow: 1,
        }}>
        {description}
      </p>

      {/* Tags */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
        role="list"
        aria-label="Technologies used">
        {tags.map((tag) => (
          <span
            key={tag}
            role="listitem"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 400,
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-glow)",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              letterSpacing: "0.03em",
            }}>
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  // If slug is present, wrap the card in a link
  const cardHref = slug ? `/projects/${slug}` : undefined;

  const cardProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: {
      duration: 0.45,
      delay: index * 0.08,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
    whileHover: { y: -4, scale: 1.015 },
    style: {
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      cursor: slug ? "pointer" : "default",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.25s, box-shadow 0.25s",
    },
    onHoverStart: (e: any) => {
      const el = e.target as HTMLElement;
      const card = el.closest("article") as HTMLElement;
      if (card) {
        card.style.borderColor = "var(--badge-border)";
        card.style.boxShadow = "var(--shadow-glow), 0 8px 32px rgba(0,0,0,0.3)";
      }
    },
    onHoverEnd: (e: any) => {
      const el = e.target as HTMLElement;
      const card = el.closest("article") as HTMLElement;
      if (card) {
        card.style.borderColor = "var(--border)";
        card.style.boxShadow = "none";
      }
    },
  };

  if (cardHref) {
    return (
      <a
        href={cardHref}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
        tabIndex={0}
        aria-label={`View details for ${title}`}>
        <motion.article {...cardProps}>{cardContent}</motion.article>
      </a>
    );
  }

  return <motion.article {...cardProps}>{cardContent}</motion.article>;
}
