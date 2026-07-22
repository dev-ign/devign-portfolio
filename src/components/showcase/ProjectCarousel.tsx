import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectType } from '@/data/projects';
import { filterProjectsByType, projectTypeTabs } from '@/data/projectFilters';
import DonorDirectoryAnimation from '@/components/showcase/DonorDirectoryAnimation';
import TemplateManagerAnimation from '@/components/showcase/TemplateManagerAnimation';
import TalentSearchWorkflowAnimation from '@/components/showcase/TalentSearchWorkflowAnimation';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { trackEvent } from '@/utils/analytics';

interface ProjectCarouselProps {
  projects: Project[];
  theme?: 'dark' | 'light';
  onActiveProjectChange?: (project: Project) => void;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  theme = 'dark',
  onActiveProjectChange,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<ProjectType>('code');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    scroller.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  const scrollToProject = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller || filteredProjects.length === 0) return;

    const card = scroller.querySelector<HTMLElement>('[data-project-card]');
    const cardStep = card ? card.offsetWidth : scroller.clientWidth;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth - 8;
    const nextLeft = scroller.scrollLeft + cardStep * direction;

    if (direction === 1 && nextLeft >= maxScroll) {
      scroller.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }

    if (direction === -1 && nextLeft <= 0) {
      scroller.scrollTo({ left: scroller.scrollWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }

    scroller.scrollBy({ left: cardStep * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [filteredProjects.length, reducedMotion]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActiveIndex(0);
    onActiveProjectChange?.(filteredProjects[0] || projects[0]);
  }, [activeType, filteredProjects, onActiveProjectChange, projects, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isPaused || filteredProjects.length <= 1) return;
    const timer = window.setInterval(() => scrollToProject(1), 5000);
    return () => window.clearInterval(timer);
  }, [filteredProjects.length, isPaused, reducedMotion, scrollToProject]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || filteredProjects.length === 0) return;
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

      <div className="relative mx-auto max-w-[900px]">
        {filteredProjects.length > 0 ? (
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth pb-4 scrollbar-none"
            aria-label={`${activeType} projects carousel`}
          >
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                data-project-card
                data-project-index={index}
                className={`relative aspect-16/10 min-w-full snap-start overflow-hidden rounded-lg border ${
                  isDark
                    ? 'border-white/7 bg-white/2.5'
                    : 'border-black/8 bg-black/3.5'
                }`}
                aria-label={project.title}
              >
                {project.id === 'gravyty-template-manager' ? (
                  <TemplateManagerAnimation className="h-full w-full" />
                ) : project.id === 'gravyty-donor-directory' ? (
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

                {/* Bottom feather overlay — always visible */}
                <div className="absolute bottom-0 left-0 right-0 h-[42%] pointer-events-none [background:linear-gradient(to_bottom,transparent_0%,rgba(12,12,14,0.96)_100%)] flex flex-col justify-end px-5 pb-5 gap-1.5">
                  <p className="m-0 font-mono text-[9px] uppercase tracking-[0.13em] text-white/50">
                    {project.category}
                  </p>
                  <h3 className="m-0 text-[clamp(15px,1.8vw,20px)] leading-[1.1] tracking-[-0.02em] text-white">
                    <Link
                      to={
                        project.id === 'gravyty-template-manager'
                          ? `/case-studies/${project.id}`
                          : project.id === 'gravyty-donor-directory'
                            ? '/case-studies/donor-directory'
                            : `/projects/${project.id}`
                      }
                      aria-label={`View ${project.title} ${['gravyty-template-manager', 'gravyty-donor-directory'].includes(project.id) ? 'case study' : 'project'}`}
                      onClick={() => trackEvent(
                        ['gravyty-template-manager', 'gravyty-donor-directory'].includes(project.id) ? 'case_study_view' : 'project_view',
                        { project_id: project.id }
                      )}
                      className="text-white no-underline transition-colors duration-200 hover:text-[#D7B9FA]"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="m-0 text-[clamp(11px,1.1vw,13px)] leading-[1.5] text-white/55 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className={`mx-auto flex min-h-45 max-w-130 items-center justify-center rounded-lg border text-center font-mono text-[11px] uppercase tracking-[0.12em] ${
              isDark
                ? 'border-white/7 text-white/34'
                : 'border-black/8 text-black/36'
            }`}
          >
            No {projectTypeTabs.find((tab) => tab.type === activeType)?.label} projects yet
          </div>
        )}

        <div className="mt-6 flex justify-center items-center gap-2.5">
          {filteredProjects.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to project ${index + 1}`}
              className={`cursor-pointer flex items-center py-2 focus:outline-none transition-[width] duration-300 ease-out group ${
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
};

export default ProjectCarousel;
