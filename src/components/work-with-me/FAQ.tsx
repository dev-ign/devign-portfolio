import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';

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
    q: 'Do you work with businesses worldwide?',
    a: 'Yes. DevignUX works remotely with businesses worldwide. Communication, design reviews, and handoffs happen through video calls, Figma, and thoughtful async collaboration.',
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
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const targets = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.faq-reveal')
      );
      initScrollEnterExit(targets, {
        trigger: targets[0] ?? sectionRef.current,
        stagger: 0.08,
        duration: 1.22,
        y: 44,
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-title"
      className="py-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway"
    >
      <div className="faq-reveal mb-[52px]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
          FAQ
        </div>
        <h2 id="faq-title" className="home-display text-[clamp(30px,5vw,52px)] text-white/88 tracking-[-0.03em] leading-[1.1] m-0">
          Common questions.
        </h2>
      </div>

      <div className="">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`faq-reveal border-b border-white/7${i === 0 ? ' border-t' : ''}`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
              className="w-full text-left bg-transparent border-none py-[clamp(18px,2.5vw,24px)] cursor-pointer flex justify-between items-center gap-4"
            >
              <span className="font-disp font-semibold text-[clamp(15px,1.8vw,18px)] text-white/88 leading-[1.3]">
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="font-mono text-[20px] text-white/35 shrink-0 inline-block leading-none"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  id={`faq-answer-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                  className="overflow-hidden"
                >
                  <p className="font-body font-light text-[clamp(13px,1.5vw,15px)] text-white/48 leading-[1.75] pb-5 m-0">
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
