import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import BrandLogo from '@/components/BrandLogo';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import './WelcomePage.css';

const destinations = [
  {
    title: 'Studio',
    description: 'Websites, digital products, and creative experiences built from idea to launch.',
    to: '/studio',
    tone: 'studio',
  },
  {
    title: 'Portfolio',
    description: 'Product design, UX engineering, and selected work—from problem to shipped experience.',
    to: '/portfolio',
    tone: 'portfolio',
  },
] as const;

const legacyStudioHashes = new Set(['top', 'services', 'process', 'projects', 'faq', 'inquiry']);

type Destination = (typeof destinations)[number];

const DestinationIcon: React.FC<{ tone: Destination['tone'] }> = ({ tone }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {tone === 'studio' ? (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
      </>
    ) : (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 9v12" />
      </>
    )}
  </svg>
);

const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => (
  <Link
    to={destination.to}
    className={`welcome-card welcome-card--${destination.tone}`}
    data-welcome-reveal
  >
    <span className="welcome-card__top" aria-hidden="true">
      <span className="welcome-card__icon"><DestinationIcon tone={destination.tone} /></span>
      <svg className="welcome-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </span>
    <span className="welcome-card__copy">
      <span className="welcome-card__title">{destination.title}</span>
      <span className="welcome-card__description">{destination.description}</span>
    </span>
  </Link>
);

const WelcomePage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (legacyStudioHashes.has(hash)) {
      navigate(`/studio#${hash}`, { replace: true });
    }
  }, [navigate]);

  useLayoutEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (legacyStudioHashes.has(hash)) return;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousBehavior;
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-page', 'welcome');
    return () => document.body.removeAttribute('data-page');
  }, []);

  useGSAPContext(() => {
    if (reducedMotion || !rootRef.current) return;
    gsap.from(rootRef.current.querySelectorAll('[data-welcome-reveal]'), {
      autoAlpha: 0,
      y: 16,
      duration: 0.56,
      ease: 'power2.out',
      stagger: 0.11,
      clearProps: 'all',
    });
  }, { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div className="welcome-page" ref={rootRef}>
      <main id="main-content" className="welcome-content" tabIndex={-1}>
        <div className="welcome-logo" data-welcome-reveal>
          <BrandLogo markSize={38} textSize={21} gap={11} />
        </div>

        <div className="welcome-introduction">
          <h1 data-welcome-reveal>What brings you here?</h1>
          <p data-welcome-reveal>
            Whether you're looking to build something new or explore the work behind it,
            choose where you'd like to begin.
          </p>
        </div>

        <div className="welcome-destinations" aria-label="Choose an experience">
          {destinations.map(destination => <DestinationCard key={destination.to} destination={destination} />)}
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
