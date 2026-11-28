import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import {
  runServicesIntroReveal,
  runServicesStagger,
} from '@/animations/workWithMeAnimations';
import ServiceIllustration, { type ServiceIllustrationId } from './ServiceIllustration';
import './StudioServices.css';

const SERVICES: ReadonlyArray<{ art: ServiceIllustrationId; name: string; description: string }> = [
  {
    art: 'landing-page',
    name: 'Landing Pages',
    description: 'Focused pages that connect a clear offer to a clear next step.',
  },
  {
    art: 'business-website',
    name: 'Business Websites',
    description: 'Credible, high-performing sites shaped around your audience and goals.',
  },
  {
    art: 'website-redesign',
    name: 'Website Redesigns',
    description: 'Sharper experiences that remove friction and strengthen your digital presence.',
  },
  {
    art: 'ecommerce',
    name: 'E-Commerce',
    description: 'Mobile-first shopping and checkout journeys designed to support conversion.',
  },
  {
    art: 'web-app',
    name: 'Web Apps',
    description: 'Custom web applications and interactive tools built for real user workflows.',
  },
  {
    art: 'ongoing-support',
    name: 'Ongoing Support',
    description: 'Maintenance, improvements, and new features as your business evolves.',
  },
  {
    art: 'video-motion',
    name: 'Video & Motion Design',
    description: 'Brand reels, animated graphics, and motion assets that give your story momentum.',
  },
  {
    art: 'graphic-product-design',
    name: 'Graphic & Product Design',
    description: 'Brand identity, UI/UX, and design systems from first sketch to pixel-perfect delivery.',
  },
];

type ServicesProps = {
  revealIntroOnScroll?: boolean;
};

const Services: React.FC<ServicesProps> = ({ revealIntroOnScroll = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAPContext(
    () => {
      if (!sectionRef.current || reducedMotion) return;
      const intro = sectionRef.current.querySelector<HTMLElement>('.services-intro');
      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.services-card')
      );

      if (intro && revealIntroOnScroll) runServicesIntroReveal(intro);
      runServicesStagger(cards);
    },
    { scope: sectionRef, dependencies: [revealIntroOnScroll, reducedMotion], revertOnUpdate: true }
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
        className="services-intro relative z-1 mx-auto mb-[clamp(38px,5.5vw,72px)] max-w-[980px] text-center will-change-[transform,opacity]"
      >
        <h2 id="services-title" className="home-display services-title text-[clamp(38px,6.2vw,76px)] text-white leading-[1.04] tracking-[-0.04em] m-0 will-change-[transform,opacity]">
          Services with{' '}
          <span
            style={{
              background: 'var(--studio-deliberate-gradient)',
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

      <ul className="studio-service-grid relative z-1">
        {SERVICES.map(service => (
          <li key={service.art} className="services-card studio-service-card">
            <div className="studio-service-surface">
              <ServiceIllustration id={service.art} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Services;
