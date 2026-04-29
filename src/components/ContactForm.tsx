import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  placeholder: string;
  required?: boolean;
  options?: string[];
  rows?: number;
}

const FIELDS: Field[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your name',
    required: true,
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    id: 'subject',
    label: 'Subject',
    type: 'select',
    placeholder: 'What is this about?',
    required: true,
    options: [
      'Job opportunity',
      'Freelance / contract work',
      'Project collaboration',
      'Open source',
      'Just saying hello',
      'Other',
    ],
  },
  {
    id: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell me what you have in mind...',
    required: true,
    rows: 6,
  },
];

// Sign up at https://formspree.io → create a form → copy the endpoint URL
// e.g. 'https://formspree.io/f/xabcdefg'
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjgjndzz";

// ── Shared input styles ────────────────────────────────────────
const baseInput: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text)',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.9375rem',
  padding: '0.65rem 0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
};

function focusStyle(el: HTMLElement | null) {
  if (!el) return;
  el.style.borderColor = 'var(--accent)';
  el.style.boxShadow = '0 0 0 3px var(--accent-dim)';
}

function blurStyle(el: HTMLElement | null) {
  if (!el) return;
  el.style.borderColor = 'var(--border)';
  el.style.boxShadow = 'none';
}

// ── Success state ──────────────────────────────────────────────
function SuccessPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '3rem 2rem',
        textAlign: 'center',
        minHeight: '320px',
      }}
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--accent)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 11.5l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Message sent
        </p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.625rem' }}>
          Thanks for reaching out
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: '320px' }}>
          I'll get back to you as soon as I can — usually within a couple of days.
        </p>
      </div>

      <a
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          color: 'var(--muted)',
          textDecoration: 'none',
          marginTop: '0.5rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)'; }}
      >
        ← Back to home
      </a>
    </motion.div>
  );
}

// ── Main form ──────────────────────────────────────────────────
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const uid = useId();

  function validate(data: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    FIELDS.filter(f => f.required).forEach(f => {
      const val = String(data.get(f.id) ?? '').trim();
      if (!val || val === '') errs[f.id] = `${f.label} is required.`;
      if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errs[f.id] = 'Please enter a valid email address.';
      }
    });
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Focus the first errored field
      const firstKey = Object.keys(errs)[0];
      (form.elements.namedItem(firstKey) as HTMLElement)?.focus();
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return <SuccessPanel />;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {FIELDS.map((field) => {
        const fieldId = `${uid}-${field.id}`;
        const errId   = `${uid}-${field.id}-err`;
        const hasErr  = Boolean(errors[field.id]);

        return (
          <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* Label */}
            <label
              htmlFor={fieldId}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: hasErr ? '#f87171' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }} aria-hidden="true">*</span>
              )}
            </label>

            {/* Input / Textarea / Select */}
            {field.type === 'textarea' ? (
              <textarea
                id={fieldId}
                name={field.id}
                placeholder={field.placeholder}
                rows={field.rows ?? 5}
                required={field.required}
                aria-describedby={hasErr ? errId : undefined}
                aria-invalid={hasErr}
                style={{
                  ...baseInput,
                  resize: 'vertical',
                  minHeight: '120px',
                  lineHeight: 1.6,
                  borderColor: hasErr ? '#f87171' : 'var(--border)',
                }}
                onFocus={e => focusStyle(e.currentTarget)}
                onBlur={e => blurStyle(e.currentTarget)}
              />
            ) : field.type === 'select' ? (
              <div style={{ position: 'relative' }}>
                <select
                  id={fieldId}
                  name={field.id}
                  required={field.required}
                  defaultValue=""
                  aria-describedby={hasErr ? errId : undefined}
                  aria-invalid={hasErr}
                  style={{
                    ...baseInput,
                    cursor: 'pointer',
                    paddingRight: '2.5rem',
                    borderColor: hasErr ? '#f87171' : 'var(--border)',
                  }}
                  onFocus={e => focusStyle(e.currentTarget)}
                  onBlur={e => blurStyle(e.currentTarget)}
                >
                  <option value="" disabled style={{ color: 'var(--muted)' }}>
                    {field.placeholder}
                  </option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt} style={{ background: 'var(--bg-card)', color: 'var(--text)' }}>
                      {opt}
                    </option>
                  ))}
                </select>
                {/* Custom chevron */}
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}
                  aria-hidden="true"
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <input
                id={fieldId}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                aria-describedby={hasErr ? errId : undefined}
                aria-invalid={hasErr}
                style={{
                  ...baseInput,
                  borderColor: hasErr ? '#f87171' : 'var(--border)',
                }}
                onFocus={e => focusStyle(e.currentTarget)}
                onBlur={e => blurStyle(e.currentTarget)}
              />
            )}

            {/* Inline error */}
            <AnimatePresence>
              {hasErr && (
                <motion.p
                  id={errId}
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: '#f87171',
                    letterSpacing: '0.03em',
                  }}
                >
                  {errors[field.id]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Network error banner */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(248, 113, 113, 0.08)',
              border: '1px solid rgba(248, 113, 113, 0.25)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#f87171',
              letterSpacing: '0.02em',
            }}
          >
            Something went wrong — please try again or email me directly.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={status === 'submitting'}
        whileHover={status !== 'submitting' ? { y: -1 } : {}}
        whileTap={status !== 'submitting' ? { scale: 0.985 } : {}}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.75rem 1.5rem',
          background: status === 'submitting' ? 'var(--accent-dim)' : 'var(--accent)',
          color: status === 'submitting' ? 'var(--accent)' : 'var(--bg)',
          border: `1px solid ${status === 'submitting' ? 'var(--accent)' : 'transparent'}`,
          borderRadius: '8px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          marginTop: '0.25rem',
          transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
          boxShadow: status === 'submitting' ? 'none' : '0 0 0 0 var(--accent-glow)',
        }}
        onMouseEnter={e => {
          if (status === 'submitting') return;
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px var(--accent-glow)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        {status === 'submitting' ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              style={{ animation: 'spin 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </motion.button>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'center', letterSpacing: '0.02em', opacity: 0.7 }}>
        * Required fields. Your data is only used to respond to your message.
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #111722; color: #E6EDF3; }
      `}</style>
    </form>
  );
}
