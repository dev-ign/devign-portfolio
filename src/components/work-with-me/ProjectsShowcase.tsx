import React, { useRef } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';
import { projects } from '@/data/projects';
import ProjectCarousel from '@/components/showcase/ProjectCarousel';

const ProjectsShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const eyebrow = sectionRef.current.querySelector<HTMLElement>('.projects-eyebrow');
      const title = sectionRef.current.querySelector<HTMLElement>('.projects-title');
      const copy = sectionRef.current.querySelector<HTMLElement>('.projects-copy');
      const chrome = sectionRef.current.querySelector<HTMLElement>('.projects-carousel-chrome');
      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('[data-project-card]')
      );

      if (eyebrow) {
        initScrollEnterExit([eyebrow], {
          trigger: eyebrow,
          start: 'top 20%',
          end: 'top 85%',
          duration: 2,
          y: 32,
        });
      }

      if (title) {
        initScrollEnterExit([title], {
          trigger: title,
          start: 'top 20%',
          end: 'top 85%',
          duration: 2,
          y: 48,
        });
      }

      if (copy) {
        initScrollEnterExit([copy], {
          trigger: copy,
          start: 'top 22%',
          end: 'top top',
          duration: 2,
          y: 38,
        });
      }

      if (chrome) {
        initScrollEnterExit([chrome], {
          trigger: chrome,
          start: 'top 62%',
          end: 'top top',
          duration: 1.18,
          y: 36,
        });
      }

      cards.forEach((card, index) => {
        initScrollEnterExit([card], {
          trigger: card,
          start: 'top 30%',
          end: 'top top',
          duration: 1.25,
          delay: index * 0.08,
          stagger: 0,
          y: 42,
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-[clamp(84px,11vw,140px)] px-[clamp(16px,6vw,88px)] bg-gateway relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/6" />
      <div className="absolute top-0 left-0 right-0 h-[520px] pointer-events-none z-0 [background:radial-gradient(ellipse_70%_42%_at_50%_0%,rgba(201,184,232,0.055)_0%,transparent_66%)]" />

      <div className="relative z-1 mx-auto mb-[clamp(56px,7vw,88px)] max-w-[980px] text-center">
        <div className="projects-eyebrow font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-4 will-change-[transform,opacity]">
          PROJECTS
        </div>
        <h2 className="projects-title text-[clamp(38px,6.2vw,76px)] text-white leading-[1.04] tracking-[-0.04em] m-0 will-change-[transform,opacity]">
          Built With{' '}
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
            Intention
          </span>
        </h2>
        <p className="projects-copy mx-auto mt-6 max-w-[680px] font-body text-[clamp(14px,1.45vw,18px)] leading-[1.72] text-white/52 font-light will-change-[transform,opacity]">
          A mix of web apps, marketing sites, design systems, brand assets, and video work.
        </p>
      </div>

      <div className="project-showcase-card relative z-1">
        <ProjectCarousel projects={projects} theme="dark" />
      </div>
    </section>
  );
};

export default ProjectsShowcase;
