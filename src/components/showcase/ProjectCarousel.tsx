import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectCarouselItem, ProjectType } from '@/data/projects';
import { filterProjectsByType, projectTypeTabs } from '@/data/projectFilters';
import DonorDirectoryAnimation from '@/components/showcase/DonorDirectoryAnimation';
import TemplatesManagerDemo from '@/components/showcase/TemplatesManagerDemo';
import TalentSearchWorkflowAnimation from '@/components/showcase/TalentSearchWorkflowAnimation';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { trackEvent } from '@/utils/analytics';
import './ProjectCarousel.css';

interface ProjectCarouselProps<T extends ProjectCarouselItem> {
  projects: T[];
  theme?: 'dark' | 'light';
  onActiveProjectChange?: (project: T) => void;
}

function ProjectCarousel<T extends ProjectCarouselItem>({
  projects,
  theme = 'dark',
  onActiveProjectChange,
}: ProjectCarouselProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef(0);
  const [activeType, setActiveType] = useState<ProjectType>('code');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isSettled, setIsSettled] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const filteredProjects = useMemo(
    () => filterProjectsByType(projects, activeType),
    [projects, activeType]
  );
  const isDark = theme === 'dark';

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(`[data-project-index="${index}"]`);
    if (!card) return;
    if (Math.abs(scroller.scrollLeft - card.offsetLeft) < 1) return;
    setIsSettled(false);
    scroller.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'auto' });
    setActiveIndex(0);
    setIsSettled(true);
    const firstProject = filteredProjects[0] ?? projects[0];
    if (firstProject) onActiveProjectChange?.(firstProject);
    return () => window.clearTimeout(settleTimer.current);
  }, [activeType, filteredProjects, onActiveProjectChange, projects, reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting && entry.intersectionRatio >= .25);
    }, { threshold: .25 });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const count = filteredProjects.length;
    if (!isInView || reducedMotion || isHovered || hasFocus || count <= 1 || filteredProjects[activeIndex]?.id === 'gravyty-template-manager') return;
    const timer = window.setTimeout(() => scrollToIndex((activeIndex + 1) % count), 5000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, filteredProjects, hasFocus, isHovered, isInView, reducedMotion, scrollToIndex]);

  const finishScroll = () => {
    window.clearTimeout(settleTimer.current);
    setIsSettled(true);
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || filteredProjects.length === 0) return;
    setIsSettled(false);
    // Some snap transitions finish without dispatching scrollend.
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(finishScroll, 140);
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>('[data-project-card]'));
    const activeCard = cards.reduce((closest, card) => {
      const currentDistance = Math.abs(card.offsetLeft - scroller.scrollLeft);
      const closestDistance = Math.abs(closest.offsetLeft - scroller.scrollLeft);
      return currentDistance < closestDistance ? card : closest;
    }, cards[0]);
    const idx = Number(activeCard.dataset.projectIndex) || 0;
    setActiveIndex(idx);
    const activeProject = filteredProjects[idx];
    if (activeProject) onActiveProjectChange?.(activeProject);
  };

  return (
    <div className={isDark ? 'text-white' : 'text-[#1A1A1A]'}>
      <nav
        aria-label="Project type"
        className={`projects-carousel-chrome mx-auto mb-16 flex w-fit items-center gap-1 rounded-full border p-1 will-change-[transform,opacity] ${
          isDark
            ? 'border-white/8 bg-white/3.5'
            : 'border-black/8 bg-black/3.5'
        }`}
      >
        {projectTypeTabs.map((tab) => {
          const active = tab.type === activeType;
          return (
            <button
              key={tab.type}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveType(tab.type)}
              className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-[background-color,color,box-shadow] duration-300 ${
                active
                  ? isDark
                    ? 'bg-white text-gateway shadow-[0_8px_24px_rgba(255,255,255,0.08)]'
                    : 'bg-[#1A1A1A] text-editorial shadow-[0_8px_24px_rgba(0,0,0,0.1)]'
                  : isDark
                    ? 'text-white/42 hover:text-white/78'
                    : 'text-black/42 hover:text-black/78'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div
        ref={viewportRef}
        className="relative mx-auto max-w-[900px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setHasFocus(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
        }}
      >
        {filteredProjects.length > 0 ? (
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            onScrollEnd={finishScroll}
            className="flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth pb-4 scrollbar-none motion-reduce:scroll-auto"
            aria-label={`${activeType} projects carousel`}
          >
            {filteredProjects.map((project, index) => {
              const { showcase } = project;
              const isTemplateManager = project.id === 'gravyty-template-manager';
              const isDonorDirectory = project.id === 'gravyty-donor-directory';
              const caseStudyPath = showcase?.caseStudyPath ?? (
                isTemplateManager ? '/case-studies/gravyty-template-manager'
                  : isDonorDirectory ? '/case-studies/donor-directory' : undefined
              );
              const captionClass = showcase
                ? 'project-carousel-feature-caption'
                : `absolute bottom-0 left-0 right-0 h-[42%] pointer-events-none [background:linear-gradient(to_bottom,transparent_0%,rgba(12,12,14,0.96)_100%)] flex flex-col justify-end px-5 pb-5 gap-1.5 ${isTemplateManager ? 'template-manager-card-caption' : ''}`;

              return (
                <article
                  key={project.id}
                  data-project-card
                  data-project-index={index}
                  className={`relative aspect-16/10 min-w-full snap-start overflow-hidden rounded-lg border ${showcase ? 'project-carousel-feature' : ''} ${isTemplateManager ? 'template-manager-carousel-card' : ''} ${
                    isDark ? 'border-white/7 bg-white/2.5' : 'border-black/8 bg-black/3.5'
                  }`}
                  aria-label={project.title}
                >
                  {showcase ? (
                    <div className="project-carousel-feature-preview">
                      <picture className="project-carousel-feature-desktop">
                        <source
                          media="(min-width: 640px)"
                          srcSet={showcase.desktop.mobile
                            ? `${showcase.desktop.mobile} 760w, ${showcase.desktop.src} ${showcase.desktop.width}w`
                            : showcase.desktop.src}
                          sizes="(min-width: 1024px) 680px, 62vw"
                        />
                        <img
                          alt={showcase.desktop.alt}
                          width={showcase.desktop.width}
                          height={showcase.desktop.height}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
                        />
                      </picture>
                      <img
                        className="project-carousel-feature-phone"
                        src={showcase.mobile.src}
                        alt={showcase.mobile.alt}
                        width={showcase.mobile.width}
                        height={showcase.mobile.height}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  ) : isTemplateManager ? (
                    <TemplatesManagerDemo variant="studio" isActive={activeIndex === index && isSettled} isTransitionComplete={isSettled} />
                  ) : isDonorDirectory ? (
                    <DonorDirectoryAnimation className="h-full w-full" />
                  ) : project.id === 'urge-talent' ? (
                    <TalentSearchWorkflowAnimation className="h-full w-full" />
                  ) : (
                    <img
                      src={project.image}
                      alt={`${project.title} project screen`}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className={captionClass}>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <p className={`m-0 font-mono text-[9px] uppercase tracking-[0.13em] ${showcase ? 'text-white/70' : 'text-white/50'}`}>
                        {project.category}
                      </p>
                      <h3 className="m-0 text-[clamp(15px,1.8vw,20px)] leading-[1.1] tracking-[-0.02em] text-white">
                        <Link
                          to={caseStudyPath ?? `/projects/${project.id}`}
                          aria-label={`View ${project.title} ${caseStudyPath ? 'case study' : 'project'}`}
                          onClick={() => trackEvent(caseStudyPath ? 'case_study_view' : 'project_view', { project_id: project.id })}
                          className="pointer-events-auto text-white no-underline transition-colors duration-200 hover:text-[#D7B9FA]"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <p className={`m-0 text-[clamp(11px,1.1vw,13px)] leading-[1.5] ${showcase ? 'text-white/70' : 'text-white/55 line-clamp-2'}`}>
                        {project.description}
                      </p>
                    </div>
                    {showcase?.liveUrl && (
                      <a
                        className="project-carousel-live-link"
                        href={showcase.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit live website for ${project.title} (opens in a new tab)`}
                      >
                        <span>Visit Live Website</span> <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={`mx-auto flex min-h-45 max-w-130 items-center justify-center rounded-lg border text-center font-mono text-[11px] tracking-[0.12em] ${
              isDark
                ? 'border-white/7 text-white/60'
                : 'border-black/8 text-black/62'
            }`}
          >
            Coming Soon
          </div>
        )}

        <div className="mt-6 flex justify-center items-center gap-2.5">
          {filteredProjects.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to project ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`cursor-pointer flex min-h-6 items-center rounded-sm py-2 transition-[width] duration-300 ease-out motion-reduce:transition-none group ${
                index === activeIndex ? 'w-8' : 'w-4'
              }`}
            >
              <div className={`h-0.75 w-full rounded-full transition-[background-color] duration-300 ${
                index === activeIndex
                  ? isDark ? 'bg-white' : 'bg-[#1A1A1A]'
                  : isDark
                    ? 'bg-white/22 group-hover:bg-white/45'
                    : 'bg-black/22 group-hover:bg-black/45'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
