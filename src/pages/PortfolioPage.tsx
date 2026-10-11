import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import SelectedWorkProject, { type SelectedWorkProjectData } from '@/components/portfolio/SelectedWorkProject';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { CONTACT_EMAIL_URL, RESUME_FILE_NAME, RESUME_URL } from '@/config/site';
import founderPortrait from '@/assets/portfolio/founder-figma.png';
import downloadIcon from '@/assets/portfolio/download-icon.svg';
import donorDirectoryImage from '@/assets/case-studies/donor-directory/donor-directory-hero.webp';
import urgeTalentImage from '@/assets/urge-project.png';
import './PortfolioPage.css';

const biography = [
  "Hey, I'm Jona! I'm a product designer and UX engineer.",
  'My career started in software development, but I quickly realized I was just as interested in why we were building something as I was in figuring out how to build it. That curiosity naturally pulled me into design, user experience, and eventually the bigger picture of building products.',
  'In 2017, I joined Gravyty as its seventh employee. Back then, we were a small startup where everyone wore multiple hats, and I loved that. Over nearly eight years, I got to grow alongside the company, taking on everything from frontend development and product design to building design systems, collaborating with product managers, and mentoring teammates as we grew into a much larger organization.',
  "That experience shaped how I approach my work today. I've learned to look beyond individual screens and think about the entire experience — the people using it, the problems we're solving, and what it takes to bring an idea to life.",
  'I enjoy being part of the whole journey, from an early conversation or rough sketch to a polished product people actually use. For me, the best part has always been connecting the dots between people, design, and technology.',
];

const templatesManager: SelectedWorkProjectData = {
  id: 'templates-manager',
  sectionId: 'selected-work',
  title: 'Templates Manager',
  category: 'Enterprise SaaS',
  summary: 'A manager shares a donor message; a fundraiser makes a personal copy to tailor the outreach. One workspace makes ownership clear at each step.',
  image: '',
  imageAlt: 'Templates Manager application workspace',
  highlights: [
    {
      title: 'Manager to Fundraiser',
      description: 'Mapped assignment, read-only access, and personal duplication into one understandable journey.',
    },
    {
      title: 'One Discoverable Library',
      description: 'Used categories, search, and ownership cues to help teams locate reusable content.',
    },
    {
      title: 'Design-to-Development Ownership',
      description: 'Carried UX flows and interaction states into the React implementation and Django API integration.',
    },
  ],
  technologies: ['Figma', 'React', 'MUI', 'TinyMCE', 'Django REST Framework'],
  caseStudyUrl: '/case-studies/gravyty-template-manager',
};

const donorDirectory: SelectedWorkProjectData = {
  id: 'donor-directory',
  sectionId: 'donor-directory',
  title: 'Donor Directory',
  category: 'Enterprise SaaS',
  summary: 'A donor workspace that helps fundraisers search large datasets and review relationship context without losing their place.',
  image: donorDirectoryImage,
  imageAlt: 'Reconstructed Donor Directory screen showing search, filters, donor records, engagement, giving, and status',
  highlights: [
    {
      title: 'Large-Scale Data Experiences',
      description: 'Designed search, filtering, sorting, and pagination for donor datasets with 10,000+ records.',
    },
    {
      title: 'Streamlined Fundraising Workflows',
      description: 'Used a contextual drawer so fundraisers could review donors without losing search or filter context.',
    },
    {
      title: 'Design-to-Development Ownership',
      description: 'Carried UX decisions into React, MUI DataGrid, and Django REST API workflows.',
    },
  ],
  technologies: ['Figma', 'React', 'TypeScript', 'MUI', 'Django REST Framework'],
  caseStudyUrl: '/case-studies/donor-directory',
};

const urgeTalent: SelectedWorkProjectData = {
  id: 'urge-talent',
  sectionId: 'urge-talent',
  title: 'Urge Talent',
  category: 'Talent Discovery Platform',
  summary: 'A talent agency dashboard for discovering talent, reviewing profiles, and curating packages in one workspace.',
  image: urgeTalentImage,
  imageAlt: 'Urge Talent dashboard showing a searchable talent grid and an open profile drawer with details and photos',
  highlights: [
    {
      title: 'Talent Discovery & Search',
      description: 'Designed searchable grid and filter patterns for browsing a large talent roster.',
    },
    {
      title: 'Contextual Profile Views',
      description: 'Brought key details and imagery into a side drawer so agents can evaluate talent in context.',
    },
    {
      title: 'Flexible Talent Curation',
      description: 'Designed selection and package-building workflows to support agency shortlists.',
    },
  ],
  technologies: ['Figma', 'UX/UI Design', 'Interaction Design', 'React', 'TypeScript'],
};

const selectedWorkProjects = [templatesManager, donorDirectory, urgeTalent];
type PortfolioChapter = 'meet-the-founder' | typeof selectedWorkProjects[number]['sectionId'];
const projectNavigation = selectedWorkProjects.map(({ sectionId, title }) => ({ sectionId, title }));
const chapterIds = ['meet-the-founder', ...selectedWorkProjects.map(project => project.sectionId)];

const PortfolioPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const biographyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [biographyScrollable, setBiographyScrollable] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<PortfolioChapter>(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    return chapterIds.includes(hash) ? hash : 'meet-the-founder';
  });

  useLayoutEffect(() => {
    document.body.setAttribute('data-page', 'portfolio');
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    const target = selectedWorkProjects.some(project => project.sectionId === hashId)
      ? document.getElementById(hashId)
      : null;
    const scroller = rootRef.current;
    const originalScrollerBehavior = scroller?.style.scrollBehavior;
    const originalDocumentBehavior = document.documentElement.style.scrollBehavior;
    if (scroller) scroller.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';

    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      setActiveChapter(hashId);
      target.focus({ preventScroll: true });
    } else {
      scroller?.scrollTo(0, 0);
      window.scrollTo(0, 0);
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
    if (scroller) scroller.style.scrollBehavior = originalScrollerBehavior || '';
    document.documentElement.style.scrollBehavior = originalDocumentBehavior;
    return () => document.body.removeAttribute('data-page');
  }, []);

  useEffect(() => {
    const chapters = chapterIds.map(id => document.getElementById(id)).filter((element): element is HTMLElement => !!element);
    if (!chapters.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(() => {
      const center = window.innerHeight / 2;
      const current = chapters.find(chapter => {
        const bounds = chapter.getBoundingClientRect();
        return bounds.top <= center && bounds.bottom > center;
      });
      if (current) {
        setActiveChapter(current.id);
        if (current.id === navigationTarget) setNavigationTarget(null);
      }
    }, { rootMargin: '-49% 0px -49% 0px' });

    chapters.forEach(chapter => observer.observe(chapter));
    return () => observer.disconnect();
  }, [navigationTarget]);

  useEffect(() => {
    const onHashChange = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (chapterIds.includes(id)) setNavigationTarget(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const alignHistoryChapter = () => {
      const id = decodeURIComponent(window.location.hash.slice(1)) || 'meet-the-founder';
      if (!chapterIds.includes(id)) return;
      setNavigationTarget(id);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    };
    window.addEventListener('popstate', alignHistoryChapter);
    return () => window.removeEventListener('popstate', alignHistoryChapter);
  }, [reducedMotion]);

  useEffect(() => {
    const biographyElement = biographyRef.current;
    if (!biographyElement) return;

    const updateScrollable = () => {
      setBiographyScrollable(
        biographyElement.scrollHeight > biographyElement.clientHeight + 1 &&
        window.getComputedStyle(biographyElement).overflowY === 'auto'
      );
    };

    updateScrollable();
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateScrollable)
      : null;
    observer?.observe(biographyElement);
    window.addEventListener('resize', updateScrollable);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateScrollable);
    };
  }, []);

  useGSAPContext(() => {
    if (reducedMotion || !rootRef.current) return;
    const root = rootRef.current;
    const find = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    timeline
      .from(find('.portfolio-decorative-heading'), { autoAlpha: 0, y: 12, duration: 0.5 })
      .from(find('.founder-portrait'), { autoAlpha: 0, y: 18, duration: 0.58 }, '-=0.34')
      .from(find('.founder-intro h2'), { autoAlpha: 0, y: 16, duration: 0.52 }, '-=0.4')
      .from(find('.founder-intro p'), { autoAlpha: 0, y: 12, duration: 0.46 }, '-=0.34')
      .from(find('.founder-biography'), { autoAlpha: 0, y: 12, duration: 0.52 }, '-=0.28')
      .from(find('.founder-actions > *'), { autoAlpha: 0, y: 12, duration: 0.46, stagger: 0.09 }, '-=0.32');
  }, [reducedMotion]);

  return (
    <div className="portfolio-page" ref={rootRef}>
      <GlobalNavigation variant="portfolio" activePortfolioChapter={activeChapter} portfolioProjects={projectNavigation} />
      <main id="main-content" tabIndex={-1}>
        <section id="meet-the-founder" className="portfolio-founder" aria-labelledby="founder-title" tabIndex={-1}>
          <h1 id="founder-title" className="sr-only">Meet the Founder</h1>
          <div className="portfolio-decorative-heading" aria-hidden="true">Founder</div>

          <div className="portfolio-founder-grid">
            <div className="founder-portrait">
              <img
                src={founderPortrait}
                alt="Jona Ferreira smiling in a black shirt and vest against a gray background"
                width="1024"
                height="1536"
                fetchPriority="high"
              />
            </div>

            <div className="founder-content">
              <div className="founder-intro">
                <h2>
                  I <span className="founder-design-word">design</span> products.{' '}
                  I <span className="founder-build-word">build</span> them too.
                </h2>
                <p>From 0 → 1. End to end.</p>
              </div>

              <div
                ref={biographyRef}
                className="founder-biography"
                role="region"
                aria-label="Founder biography"
                tabIndex={biographyScrollable ? 0 : undefined}
              >
                {biography.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <div className="founder-actions">
                <a href="#selected-work" className="founder-action founder-action--primary">See My Work</a>
                <a href={CONTACT_EMAIL_URL} className="founder-action founder-action--outline">Get in Touch</a>
                <a href={RESUME_URL} download={RESUME_FILE_NAME} className="founder-action founder-action--text">
                  Resume <img src={downloadIcon} alt="" width="20" height="20" />
                </a>
              </div>
            </div>
          </div>
        </section>
        {selectedWorkProjects.map(project => <SelectedWorkProject key={project.id} project={project} isActive={navigationTarget === null && activeChapter === project.sectionId} />)}
      </main>
    </div>
  );
};

export default PortfolioPage;
