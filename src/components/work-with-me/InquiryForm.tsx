import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type ProjectType = 'Landing Page' | 'Business Website' | 'Website Redesign' | 'E-Commerce' | 'Booking Experience' | 'Not Sure Yet';
type Budget = 'Under $2k' | '$2k–$5k' | '$5k–$10k' | '$10k+' | 'Not sure yet';
type Timeline = 'ASAP' | '2–4 Weeks' | '1–2 Months' | 'Flexible';

interface FormData {
  name: string;
  email: string;
  businessName: string;
  website: string;
  projectType: ProjectType | '';
  budget: Budget | '';
  timeline: Timeline | '';
  details: string;
}

const PROJECT_TYPES: ProjectType[] = ['Landing Page', 'Business Website', 'Website Redesign', 'E-Commerce', 'Booking Experience', 'Not Sure Yet'];
const BUDGETS: Budget[] = ['Under $2k', '$2k–$5k', '$5k–$10k', '$10k+', 'Not sure yet'];
const TIMELINES: Timeline[] = ['ASAP', '2–4 Weeks', '1–2 Months', 'Flexible'];

const TOTAL_STEPS = 5;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '13px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'rgba(255,255,255,0.88)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)',
  display: 'block',
  marginBottom: '8px',
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const InquiryForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', businessName: '', website: '',
    projectType: '', budget: '', timeline: '', details: '',
  });

  const set = (field: keyof FormData) => (val: string) =>
    setFormData(prev => ({ ...prev, [field]: val }));

  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canAdvance = () => {
    if (step === 1) return formData.name.trim() !== '' && formData.email.trim() !== '';
    if (step === 2) return formData.projectType !== '';
    if (step === 3) return formData.budget !== '';
    if (step === 4) return formData.timeline !== '';
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
      if (!publicKey) throw new Error('EmailJS not configured');

      emailjs.init(publicKey);
      await emailjs.send('portfolio-gmail', 'template_mzi5nzb', {
        to_email: 'jonathanferreiradev@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: `[Work With Me] ${formData.projectType || 'Inquiry'} — ${formData.businessName || formData.name}`,
        message: [
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Business: ${formData.businessName || '—'}`,
          `Website/Social: ${formData.website || '—'}`,
          `Project type: ${formData.projectType}`,
          `Budget: ${formData.budget}`,
          `Timeline: ${formData.timeline}`,
          `\nDetails:\n${formData.details || '(no details provided)'}`,
        ].join('\n'),
        name: formData.name,
        email: formData.email,
      });
    } catch (err) {
      console.error('InquiryForm submit error:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const PillButton = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        fontWeight: selected ? 500 : 300,
        padding: '12px 20px',
        borderRadius: '100px',
        border: selected ? '1.5px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.12)',
        background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: selected ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Let's start with you.
            </h3>
            <div>
              <label style={labelStyle}>Name *</label>
              <input style={inputStyle} value={formData.name} onChange={e => set('name')(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" value={formData.email} onChange={e => set('email')(e.target.value)} placeholder="your@email.com" />
            </div>
            <div>
              <label style={labelStyle}>Business name (optional)</label>
              <input style={inputStyle} value={formData.businessName} onChange={e => set('businessName')(e.target.value)} placeholder="Your business" />
            </div>
            <div>
              <label style={labelStyle}>Current website or Instagram (optional)</label>
              <input style={inputStyle} value={formData.website} onChange={e => set('website')(e.target.value)} placeholder="yoursite.com or @handle" />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
              What are you looking to build?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {PROJECT_TYPES.map(pt => (
                <PillButton key={pt} label={pt} selected={formData.projectType === pt} onClick={() => set('projectType')(pt)} />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
              Do you have a budget range in mind?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {BUDGETS.map(b => (
                <PillButton key={b} label={b} selected={formData.budget === b} onClick={() => set('budget')(b)} />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
              When are you looking to get started?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {TIMELINES.map(t => (
                <PillButton key={t} label={t} selected={formData.timeline === t} onClick={() => set('timeline')(t)} />
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Tell me about your project.
            </h3>
            <div>
              <label style={labelStyle}>Project details — A few sentences are helpful.</label>
              <textarea
                value={formData.details}
                onChange={e => set('details')(e.target.value)}
                rows={5}
                placeholder="What does your business do? What's not working about your current online presence? What would a win look like?"
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <section
        id="inquiry"
        style={{
          padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
          background: '#0C0C0E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50dvh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: 'center', maxWidth: '480px' }}
        >
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '28px', marginBottom: '28px', color: 'var(--accent-active)' }}
          >
            ✦
          </motion.div>
          <h3
            style={{
              fontFamily: 'var(--font-disp)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 38px)',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
            }}
          >
            You're all set.
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            I'll review your project details and reach out soon with next steps.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id="inquiry"
      style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 8vw, 88px)',
        background: '#0C0C0E',
      }}
    >
      <div style={{ marginBottom: '56px', maxWidth: '560px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '12px',
          }}
        >
          Start a Project
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-disp)',
            fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 14px',
          }}
        >
          Let's start something.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '15px',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Tell me about your project and I'll reach out with next steps.
        </p>
      </div>

      <div style={{ maxWidth: '560px' }}>
        {/* Step indicator dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '40px' }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i + 1 === step ? 28 : 8,
                background: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.12)',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ height: '4px', borderRadius: '2px' }}
            />
          ))}
        </div>

        {/* Step content */}
        <div style={{ position: 'relative', minHeight: '240px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px' }}>
          {step > 1 ? (
            <button
              onClick={goBack}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: canAdvance() ? '#fff' : 'rgba(255,255,255,0.08)',
                color: canAdvance() ? '#0C0C0E' : 'rgba(255,255,255,0.25)',
                border: 'none',
                borderRadius: '100px',
                padding: '13px 28px',
                cursor: canAdvance() ? 'pointer' : 'default',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: '#fff',
                color: '#0C0C0E',
                border: 'none',
                borderRadius: '100px',
                padding: '13px 28px',
                cursor: 'pointer',
                opacity: submitting ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {submitting ? 'Sending…' : 'Start the Conversation →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
