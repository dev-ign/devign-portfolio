import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Icon } from '@iconify/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import TemplatesManagerDemo from '@/components/showcase/TemplatesManagerDemo';

export type SelectedWorkProjectData = {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  previewLayers?: { desktopSmall: string; phone: string };
  highlights: { title: string; description: string }[];
  technologies: string[];
  caseStudyUrl?: string;
};

type Props = { project: SelectedWorkProjectData; isActive?: boolean };

const SelectedWorkProject: React.FC<Props> = ({ project, isActive = false }) => {
  const chapterRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [presentationReady, setPresentationReady] = useState(false);
  const active = useRef(isActive);
  const syncEntrance = useRef<(() => void) | null>(null);
  const playedPreview = useRef(false);
  const { previewLayers } = project;
  const hasPreviewLayers = Boolean(previewLayers);

  useLayoutEffect(() => {
    active.current = isActive;
    syncEntrance.current?.();
  }, [isActive]);

  const preserveReturnChapter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, '', `${pathname}${search}#${project.sectionId}`);
  };

  useGSAPContext(() => {
    const chapter = chapterRef.current;
    if (!chapter || typeof IntersectionObserver === 'undefined') return;
    if (reducedMotion) {
      if (hasPreviewLayers) playedPreview.current = true;
      return;
    }
    if (hasPreviewLayers && playedPreview.current) return;

    const find = (selector: string) => Array.from(chapter.querySelectorAll<HTMLElement>(selector));
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        if (hasPreviewLayers) observer.disconnect();
        else setPresentationReady(true);
      },
    });

    timeline.from(find('.selected-work-decorative-heading'), { autoAlpha: 0, y: 12, duration: 0.5 });
    if (hasPreviewLayers) {
      // Prepare delayed layers and copy before paint, just as for a single preview.
      timeline
        .addLabel('preview', 0.2)
        .from(find('.selected-work-preview'), { autoAlpha: 0, y: 16, duration: 0.48 }, 'preview')
        .from(find('.selected-work-preview__desktop'), { opacity: 0, y: 12, scale: 0.985, duration: 0.55, clearProps: 'opacity,transform' }, 'preview')
        .from(find('.selected-work-preview__phone'), { opacity: 0, y: 16, scale: 0.98, duration: 0.54, clearProps: 'opacity,transform' }, 'preview+=0.11');
    } else {
      timeline.from(find('.selected-work-preview'), { autoAlpha: 0, y: 24, duration: 0.65 }, '-=0.3');
    }
    timeline
      .from(find('.selected-work-category, .selected-work-details h2'), { autoAlpha: 0, y: 16, duration: 0.48 }, '-=0.42')
      .from(find('.selected-work-summary'), { autoAlpha: 0, y: 12, duration: 0.46 }, '-=0.3')
      .from(find('.selected-work-highlights-label'), { autoAlpha: 0, y: 9, duration: 0.38 }, '-=0.25')
      .from(find('.selected-work-highlight'), { autoAlpha: 0, y: 12, duration: 0.46, stagger: 0.1 }, '-=0.19')
      .from(find('.selected-work-technology'), { autoAlpha: 0, y: 8, duration: 0.34, stagger: 0.055 }, '-=0.12');

    if (project.caseStudyUrl) {
      timeline.from(find('.selected-work-case-study'), { autoAlpha: 0, y: 8, duration: 0.4 }, '-=0.08');
    }

    let visible = false;
    let started = false;
    const enter = () => {
      const canPlay = visible && (!hasPreviewLayers || (active.current && !document.hidden));
      if (started) {
        if (!hasPreviewLayers || timeline.progress() === 1) return;
        if (!active.current || (!visible && !document.hidden)) timeline.progress(1);
        else if (!canPlay) timeline.pause();
        else if (timeline.paused()) timeline.resume();
        return;
      }
      if (!canPlay) return;
      started = true;
      if (hasPreviewLayers) playedPreview.current = true;
      else observer.disconnect();
      timeline.play();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && (!hasPreviewLayers || entry.intersectionRatio >= 0.12);
      enter();
    }, { threshold: 0.12 });
    if (hasPreviewLayers) {
      syncEntrance.current = enter;
      document.addEventListener('visibilitychange', enter);
    }
    observer.observe(chapter);

    return () => {
      observer.disconnect();
      if (hasPreviewLayers) document.removeEventListener('visibilitychange', enter);
      syncEntrance.current = null;
    };
  }, { scope: chapterRef, dependencies: [reducedMotion, hasPreviewLayers], revertOnUpdate: true });

  return (
    <section id={project.sectionId} ref={chapterRef} className="selected-work-chapter" aria-labelledby={`${project.id}-title`} tabIndex={-1}>
      <div className="selected-work-decorative-heading" aria-hidden="true">{project.title}</div>
      <div className="selected-work-grid">
        <div className={`selected-work-preview${project.id === 'templates-manager' ? ' selected-work-preview--templates' : ''}`}>
          {project.id === 'templates-manager' ? (
            <TemplatesManagerDemo variant="portfolio" isActive={isActive} isTransitionComplete={reducedMotion || presentationReady} />
          ) : previewLayers ? (
            <div className="selected-work-preview__layer-frame" role="img" aria-label={project.imageAlt}>
              <div className="selected-work-preview__art">
                <img
                  className="selected-work-preview__desktop"
                  src={project.image}
                  srcSet={`${previewLayers.desktopSmall} 760w, ${project.image} 1440w`}
                  sizes="(max-width: 839px) 80vw, 60vw"
                  width={1440}
                  height={900}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <img className="selected-work-preview__phone" src={previewLayers.phone} width={390} height={844} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          ) : (
            <img src={project.image} alt={project.imageAlt} loading="lazy" />
          )}
        </div>
        <div className="selected-work-details">
          <div className="selected-work-copy">
            <p className="selected-work-category">{project.category}</p>
            <h2 id={`${project.id}-title`}>{project.title}</h2>
            <p className="selected-work-summary">{project.summary}</p>

            <div className="selected-work-highlights">
              <p className="selected-work-highlights-label">Key Highlights</p>
              {project.highlights.map(highlight => (
                <div className="selected-work-highlight" key={highlight.title}>
                  <span className="selected-work-highlight-dot" aria-hidden="true" />
                  <div>
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="selected-work-footer">
            <ul className="selected-work-technologies" aria-label="Project tools and disciplines">
              {project.technologies.map(technology => (
                <li className="selected-work-technology" key={technology}>{technology}</li>
              ))}
            </ul>
            {project.caseStudyUrl && (
              <Link to={project.caseStudyUrl} onClick={preserveReturnChapter} className="selected-work-case-study">
                Explore Case Study
                <Icon icon="lucide:arrow-up-right" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkProject;
