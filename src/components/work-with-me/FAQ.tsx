import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    q: 'How long does a project take?',
    a: "Landing pages typically take 2–3 weeks. Multi-page business websites range from 4–8 weeks depending on scope. We'll establish a clear timeline in our first conversation.",
  },
  {
    q: 'Can I edit the website after launch?',
    a: "Yes. I can build with a CMS (like Sanity or Contentful) so you can update text, images, and content without touching code. We'll discuss what level of control you need upfront.",
  },
  {
    q: 'Do you offer hosting or maintenance?',
    a: 'I can recommend and set up hosting (Vercel, Netlify, or traditional). Monthly maintenance packages are available for content updates, security patches, and feature additions.',
  },
  {
    q: 'Do you work with businesses outside Tampa?',
    a: 'Absolutely. I work remotely with businesses across the US. All communication, design reviews, and handoffs happen over video calls, Figma, and async tools.',
  },
  {
    q: 'What do I need to provide to get started?',
    a: "A brief description of your business, what you're looking to build, your timeline, and any branding you already have (logo, colors, fonts). I'll handle the rest.",
  },
  {
    q: 'Do you offer SEO?',
    a: 'Every site I build is SEO-conscious: semantic HTML, fast load times, proper meta tags, and accessible structure. Dedicated SEO campaigns and ongoing content strategy are available as add-ons.',
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#E8E7E1',
      }}
    >
      <div style={{ marginBottom: '52px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.35)',
            marginBottom: '12px',
          }}
        >
          FAQ
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: '#0C0C0E',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Common questions.
        </h2>
      </div>

      <div style={{ maxWidth: '720px' }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              borderTop: i === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined,
              borderBottom: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 'clamp(18px, 2.5vw, 24px) 0',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontWeight: 600,
                  fontSize: 'clamp(15px, 1.8vw, 18px)',
                  color: '#0C0C0E',
                  lineHeight: 1.3,
                }}
              >
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '20px',
                  color: 'rgba(0,0,0,0.35)',
                  flexShrink: 0,
                  display: 'inline-block',
                  lineHeight: 1,
                }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      color: 'rgba(0,0,0,0.55)',
                      lineHeight: 1.75,
                      paddingBottom: '20px',
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
