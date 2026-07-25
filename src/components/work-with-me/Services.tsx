import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import {
  runServicesIntroReveal,
  runServicesStagger,
} from '@/animations/workWithMeAnimations';

const SERVICES = [
  {
    icon: 'solar:rocket-2-bold',
    name: 'Landing Pages',
    description: 'Focused pages that connect a clear offer to a clear next step.',
  },
  {
    icon: 'solar:buildings-bold',
    name: 'Business Websites',
    description: 'Credible, high-performing sites shaped around your audience and goals.',
  },
  {
    icon: 'solar:refresh-circle-bold',
    name: 'Website Redesigns',
    description: 'Sharper experiences that remove friction and strengthen your digital presence.',
  },
  {
    icon: 'solar:cart-large-bold',
    name: 'E-Commerce',
    description: 'Mobile-first shopping and checkout journeys designed to support conversion.',
  },
  {
    icon: 'solar:code-bold',
    name: 'Web Apps',
    description: 'Custom web applications and interactive tools built for real user workflows.',
  },
  {
    icon: 'solar:settings-bold',
    name: 'Ongoing Support',
    description: 'Maintenance, improvements, and new features as your business evolves.',
  },
  {
    icon: 'solar:videocamera-record-bold',
    name: 'Video & Motion Design',
    description: 'Brand reels, animated graphics, and motion assets that give your story momentum.',
  },
  {
    icon: 'solar:palette-bold',
    name: 'Graphic & Product Design',
    description: 'Brand identity, UI/UX, and design systems from first sketch to pixel-perfect delivery.',
  },
];

type ServicesProps = {
  revealIntroOnScroll?: boolean;
};

const Services: React.FC<ServicesProps> = ({ revealIntroOnScroll = true }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const intro = sectionRef.current.querySelector<HTMLElement>('.services-intro');
      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.services-card')
      );

      if (intro && revealIntroOnScroll) runServicesIntroReveal(intro);
      runServicesStagger(cards);
    },
    { scope: sectionRef, dependencies: [revealIntroOnScroll] }
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-title"
      className="pt-[clamp(56px,9vw,104px)] pb-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway relative"
    >
      {/* Atmospheric top glow */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0 [background:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(176,110,243,0.06)_0%,transparent_65%),radial-gradient(ellipse_60%_30%_at_50%_-5%,rgba(255,140,60,0.03)_0%,transparent_55%)]" />

      {/* Section intro */}
      <div
        className="services-intro relative z-1 mx-auto mb-[clamp(64px,8vw,104px)] max-w-[980px] text-center will-change-[transform,opacity]"
      >
        <h2 id="services-title" className="home-display services-title text-[clamp(38px,6.2vw,76px)] text-white leading-[1.04] tracking-[-0.04em] m-0 will-change-[transform,opacity]">
          Services with{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C9B8E8 0%, #AC5D64 55%, #E1DEE3 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 24px rgba(201, 184, 232, 0.22), 0 0 48px rgba(172, 93, 100, 0.14)',
            }}
          >
            Deliberate
          </span>{' '}
          Craft
        </h2>
        <p className="services-copy mx-auto mt-6 max-w-[760px] font-body text-[clamp(15px,1.55vw,19px)] leading-[1.75] text-white/58 font-light will-change-[transform,opacity]">
          We bring strategy, design, development, and creative production together to turn a
          clear direction into thoughtful, effective execution.
        </p>
      </div>

      {/* Grid — gap:1px + bg creates hairline dividers between cells */}
      <div className="services-grid grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-px bg-white/5 rounded-[20px] overflow-hidden border border-white/5 relative z-1">
        {SERVICES.map((s) => (
          <div
            key={s.name}
            className="service-card services-card bg-white/3 p-[32px_26px] flex flex-col gap-3.5"
          >
            <div className="w-[38px] h-[38px] rounded-[10px] bg-white/6 flex items-center justify-center shrink-0">
              <Icon icon={s.icon} style={{ width: 19, height: 19, color: 'rgba(255,255,255,0.75)' }} />
            </div>
            <div>
              <h3 className="font-disp font-bold text-base text-white/88 mb-1.5">
                {s.name}
              </h3>
              <p className="m-0 font-body text-[13px] text-white/52 leading-[1.65] font-light">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
