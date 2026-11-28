import React, { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { runProjectsGridReveal } from '@/animations/workWithMeAnimations';
import { studioProjects, type ProjectType } from '@/data/projects';
import { filterProjectsByType, projectTypeTabs } from '@/data/projectFilters';
import StudioProjectMosaic from './StudioProjectMosaic';
import './StudioProjects.css';

const CATEGORY_GAP = 14;

type ProjectsShowcaseProps = {
  navigationRef: RefObject<HTMLElement | null>;
  onAlignCategories: (position: number) => void;
};

export default function ProjectsShowcase({ navigationRef, onAlignCategories }: ProjectsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const categoryOffset = useRef(104);
  const realignAfterFilter = useRef(false);
  const [category, setCategory] = useState<ProjectType>('code');
  const reducedMotion = usePrefersReducedMotion();
  const projects = filterProjectsByType(studioProjects, category);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const navigation = navigationRef.current;
    if (!section || !navigation) return;
    const measure = () => {
      categoryOffset.current = Math.ceil(navigation.getBoundingClientRect().bottom + CATEGORY_GAP);
      section.style.setProperty('--studio-projects-sticky-top', `${categoryOffset.current}px`);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(navigation);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [navigationRef]);

  useGSAPContext(() => {
    if (!headingRef.current || !galleryRef.current) return;
    runProjectsGridReveal(headingRef.current, []);
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  useGSAPContext(() => {
    if (!galleryRef.current) return;
    const cards = Array.from(galleryRef.current.querySelectorAll<HTMLElement>('.studio-projects-card-frame'));
    runProjectsGridReveal(null, cards);
  }, { scope: galleryRef, dependencies: [category, reducedMotion], revertOnUpdate: true });

  useLayoutEffect(() => {
    if (!realignAfterFilter.current || !galleryRef.current) return;
    realignAfterFilter.current = false;
    const adjust = galleryRef.current.getBoundingClientRect().top - categoryOffset.current;
    if (adjust < 0) onAlignCategories(window.scrollY + adjust);
  }, [category, onAlignCategories]);

  const selectCategory = (next: ProjectType) => {
    if (next === category || !galleryRef.current) return;
    realignAfterFilter.current = galleryRef.current.getBoundingClientRect().top < categoryOffset.current;
    setCategory(next);
  };

  const keepLinkVisible = (event: React.FocusEvent<HTMLDivElement>) => {
    const link = event.target;
    const selector = categoriesRef.current;
    if (!link.matches('.studio-projects-arrow') || !selector) return;
    const anchor = link.getBoundingClientRect();
    const bounds = selector.getBoundingClientRect();
    if (anchor.top < bounds.bottom && anchor.bottom > bounds.top
      && anchor.left < bounds.right && anchor.right > bounds.left) {
      onAlignCategories(window.scrollY + anchor.top - bounds.bottom - 8);
    }
  };

  return (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-title" className="studio-projects bg-gateway">
      <h2 ref={headingRef} id="projects-title"
        className="home-display projects-title text-[clamp(38px,6.2vw,76px)] text-white leading-[1.04] tracking-[-0.04em] m-0">
        Built With{' '}
        <span>Intention</span>
      </h2>

      <div ref={galleryRef} className="studio-projects-gallery">
        <nav ref={categoriesRef} className="studio-projects-categories" aria-label="Project type">
          {projectTypeTabs.map(tab => (
            <button
              type="button"
              key={tab.type}
              aria-pressed={category === tab.type}
              aria-controls="studio-project-results"
              onClick={event => {
                event.currentTarget.focus({ preventScroll: true });
                selectCategory(tab.type);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div id="studio-project-results" onFocus={keepLinkVisible}>
          <span className="sr-only" role="status">
            {projectTypeTabs.find(tab => tab.type === category)?.label}: {projects.length ? `${projects.length} projects` : 'Coming Soon'}
          </span>
          {projects.length > 0
            ? <StudioProjectMosaic projects={projects} />
            : <p className="studio-projects-empty">Coming Soon</p>}
        </div>
      </div>
    </section>
  );
}
