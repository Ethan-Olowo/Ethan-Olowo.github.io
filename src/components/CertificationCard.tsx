import { motion } from "framer-motion";

interface CertificationCardProps {
  title: string;
  issuer: string;
  dateCompleted: string;
  tags: string[];
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  badgeImage?: string;
  credentialUrl?: string;
  index?: number;
}

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

export default function CertificationCard({
  title,
  issuer,
  dateCompleted,
  tags,
  languages = [],
  frameworks = [],
  tools = [],
  badgeImage,
  credentialUrl,
  index = 0,
}: CertificationCardProps) {
  const combinedTech = Array.from(new Set([...languages, ...frameworks, ...tools]));

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
    className: "cert-card",
    style: {
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      position: "relative" as const,
      overflow: "hidden",
      transition: "border-color 0.25s, box-shadow 0.25s",
      width: "100%",
      cursor: credentialUrl ? "pointer" : "default",
    } as any,
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

      <div className="cert-card-inner">
        {/* Badge Image on the left */}
        <div className="cert-badge-container">
          {badgeImage ? (
            <img src={badgeImage} alt={`${title} badge`} className="cert-badge-img" />
          ) : (
            <div className="cert-badge-placeholder">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l2 2l2-2l-2-5z"></path>
                <path d="M8 13l-2 5l2 2l2-2l-2-5z"></path>
                <path d="M16 13l-2 5l2 2l2-2l-2-5z"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>

        {/* Content on the right */}
        <div className="cert-content">
          <div className="cert-header">
            <div className="cert-title-group">
              <h3 className="cert-title">{title}</h3>
              <p className="cert-meta">
                <span className="cert-issuer">{issuer}</span>
                <span className="cert-separator">•</span>
                <span className="cert-date">{dateCompleted}</span>
              </p>
            </div>

            {credentialUrl && (
              <a
                href={credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-link"
                aria-label={`Verify ${title} credential`}
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
              >
                <ExternalIcon />
                <span>Verify</span>
              </a>
            )}
          </div>

          <div className="cert-footer">
            {/* Concept Tags */}
            <div className="cert-tags">
              {tags.map((tag) => (
                <span key={tag} className="cert-tag-pill">{tag}</span>
              ))}
            </div>

            {/* Technologies */}
            <div className="cert-tech">
              {combinedTech.map((tech) => (
                <span key={tech} className="cert-tech-pill">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {credentialUrl ? (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
          tabIndex={0}
          aria-label={`View credential for ${title}`}>
          <motion.article {...cardProps}>{cardContent}</motion.article>
        </a>
      ) : (
        <motion.article {...cardProps}>{cardContent}</motion.article>
      )}
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .cert-card-inner {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: 640px) {
    .cert-card-inner {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .cert-badge-container {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .cert-badge-container {
      width: 120px;
      height: 120px;
    }
  }

  .cert-badge-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.5rem;
  }

  .cert-badge-placeholder {
    color: var(--muted);
    opacity: 0.5;
  }

  .cert-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .cert-title {
    font-family: var(--font-ui);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
    letter-spacing: -0.01em;
    margin: 0;
  }

  .cert-meta {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted);
    margin: 0.25rem 0 0 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .cert-issuer {
    color: var(--accent);
    font-weight: 500;
  }

  .cert-separator {
    opacity: 0.5;
  }

  .cert-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .cert-description {
    display: none;
  }

  .cert-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .cert-tags, .cert-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .cert-tag-pill {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
  }

  .cert-tech-pill {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid var(--accent-glow);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    letter-spacing: 0.03em;
  }
`;
