import React from 'react';
import { motion } from 'motion/react';

const OUTCOMES = [
  { label: 'More trust', description: 'A sharper first impression for new customers.' },
  { label: 'More leads', description: 'Clearer paths to contact, book, buy, or inquire.' },
  { label: 'Less friction', description: 'Fast, mobile-first experiences that feel easy to use.' },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const BusinessOutcomes: React.FC = () => (
  <section
    style={{
      padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
      background: '#0C0C0E',
    }}
  >
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, ease }}
      style={{
        fontFamily: 'var(--font-disp)',
        fontWeight: 700,
        fontSize: 'clamp(22px, 3.5vw, 38px)',
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: '-0.025em',
        lineHeight: 1.25,
        margin: '0 0 clamp(48px, 7vw, 80px)',
      }}
    >
      Built for businesses that need more than "just a website."
    </motion.p>

    <div>
      {OUTCOMES.map((o, i) => (
        <motion.div
          key={o.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease, delay: i * 0.08 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: 'clamp(20px, 2.8vw, 28px) 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {o.label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6,
            }}
          >
            {o.description}
          </span>
        </motion.div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
    </div>
  </section>
);

export default BusinessOutcomes;
