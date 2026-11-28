import { useRef } from 'react';
import { Link } from 'react-router-dom';
import CaseStudyEditorialIntro from '@/components/case-studies/CaseStudyEditorialIntro';
import CaseStudyProjectDetails from '@/components/case-studies/CaseStudyProjectDetails';
import CaseStudySectionNavigation, {
  type CaseStudySectionLink,
} from '@/components/case-studies/CaseStudySectionNavigation';
import {
  MIREMBE_PORTFOLIO_PATH,
  mirembeArchitecture,
  mirembeFacts,
  mirembeOutcomes,
} from '@/data/mirembeCleaningCaseStudy';
import { mirembeVisuals as visuals, type MirembeVisual } from '@/data/mirembeVisualAssets';
import MirembeCreativeShowcase from './MirembeCreativeShowcase';
import MirembeServiceJourney from './MirembeServiceJourney';
import { useMirembeMotion } from './useMirembeMotion';
import './MirembeCleaningCaseStudy.css';

const sections: CaseStudySectionLink[] = [
  { id: 'hero', label: 'Project overview', menuLabel: 'Overview' },
  { id: 'strategy', label: 'Launch strategy', menuLabel: 'Strategy' },
  { id: 'design', label: 'Identity & customer experience', menuLabel: 'Design' },
  { id: 'engineering', label: 'Operational foundation', menuLabel: 'Engineering' },
  { id: 'growth', label: 'Creative direction & acquisition', menuLabel: 'Growth' },
  { id: 'outcomes', label: 'Outcomes & reflection', menuLabel: 'Outcomes' },
];

const phases = [
  {
    step: '01',
    label: 'Pre-launch',
    title: 'Make it easy to express interest',
    image: visuals.waitlist,
    caption: 'Original waitlist design · Figma',
    text: 'The one-screen landing page asked for an email first. A ZIP could follow after signup, and a separate route let cleaners apply.',
  },
  {
    step: '02',
    label: 'Expanded site',
    title: 'Answer questions before booking',
    image: visuals.services,
    caption: 'Expanded service discovery · Figma',
    text: 'Service details, coverage maps, the founder story, and FAQs helped customers understand the offer as the business prepared to open.',
  },
  {
    step: '03',
    label: 'Booking enabled',
    title: 'Give ready customers a next step',
    image: visuals.homepage,
    caption: 'Booking-led homepage · Current product',
    text: 'Limited holiday availability gave us a reason to promote Request a Cleaning. The waitlist stayed available for regular service, planned for January 2027.',
  },
];

function Visual({
  asset,
  caption,
  className,
}: {
  asset: MirembeVisual;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className ?? 'mirembe-visual'}>
      <img
        src={asset.src}
        srcSet={asset.mobile ? `${asset.mobile} 760w, ${asset.src} ${asset.width}w` : undefined}
        sizes={asset.mobile ? '(max-width: 760px) 92vw, (max-width: 1280px) 88vw, 1120px' : undefined}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        loading={asset.priority && !caption ? 'eager' : 'lazy'}
        fetchPriority={asset.priority && !caption ? 'high' : undefined}
        decoding="async"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default function MirembeCleaningCaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMirembeMotion(rootRef);

  return (
    <div ref={rootRef} className="mirembe-story" data-case-study-motion-root="mirembe-cleaning">
      <section
        id="hero"
        aria-labelledby="mirembe-title"
        className="mirembe-hero case-study-section"
        data-case-study-section="hero"
      >
        <div className="mirembe-wrap">
          <div className="mirembe-hero-lead">
            <div data-mirembe-hero="title">
              <p className="case-study-editorial-label">Digital experience &amp; business launch</p>
              <h1 id="mirembe-title" tabIndex={-1}>Mirembe Cleaning</h1>
            </div>
            <div data-mirembe-hero="intro">
              <p className="mirembe-hero-headline">
                Building the digital foundation for a new service business.
              </p>
              <p className="case-study-editorial-copy">
                From pre-launch demand generation to a multilingual customer experience, I partnered with
                Mirembe Cleaning to design and engineer the systems supporting its launch, customer
                acquisition, and ongoing growth.
              </p>
            </div>
          </div>
          <div className="mirembe-hero-stage">
            <div className="mirembe-browser" data-mirembe-hero="desktop">
              <div className="mirembe-browser-bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>mirembecleaning.com</span>
              </div>
              <Visual asset={visuals.homepage} />
            </div>
            <Visual asset={visuals.mobile} className="mirembe-hero-mobile" />
          </div>
          <div className="mirembe-hero-details">
            <CaseStudyProjectDetails items={mirembeFacts} />
          </div>
          <CaseStudySectionNavigation sections={sections} tone="mirembe" />
        </div>
      </section>

      <section
        id="strategy"
        aria-labelledby="mirembe-strategy"
        className="mirembe-section case-study-section"
        data-case-study-section="strategy"
      >
        <div className="mirembe-wrap">
          <CaseStudyEditorialIntro id="mirembe-strategy" title="Build for the stage the business is in." variant="stacked">
            <p>
              Mirembe’s founders were preparing a family-owned cleaning business for Greater Boston and
              Greater Hartford. They needed to establish trust, attract customers, and recruit cleaners
              while they got operations ready for appointments.
            </p>
            <p>
              I started with the decisions the team could act on immediately. An email-first waitlist
              tested a practical hypothesis: fewer upfront questions could make it easier to express
              interest. As service became available, we could give visitors a more useful next step.
            </p>
          </CaseStudyEditorialIntro>
          <ol className="mirembe-evolution" data-mirembe-reveal>
            {phases.map((phase) => (
              <li key={phase.step}>
                <p className="mirembe-phase">
                  <span>{phase.step}</span>
                  {phase.label}
                </p>
                <Visual asset={phase.image} caption={phase.caption} />
                <h3>{phase.title}</h3>
                <p>{phase.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="design"
        aria-labelledby="mirembe-design"
        className="mirembe-section mirembe-section--tint case-study-section"
        data-case-study-section="design"
      >
        <div className="mirembe-wrap">
          <CaseStudyEditorialIntro id="mirembe-design" title="Make a first cleaning feel easier to choose.">
            <p>
              I translated the idea of peace into the site’s typography, color, and photography. I paired
              that warmth with practical answers about what a clean includes, which towns Mirembe serves,
              and what happens after a request.
            </p>
          </CaseStudyEditorialIntro>
          <div className="mirembe-brand" data-mirembe-reveal>
            <div className="mirembe-brand-specimen">
              <p className="case-study-editorial-label">Brand foundations</p>
              <p className="mirembe-specimen">
                A Cleaner Home.
                <br />
                <em>More Peace.</em>
              </p>
              <p className="mirembe-specimen-caption">Montserrat · Cormorant Garamond · Inter</p>
              <ul className="mirembe-swatches" aria-label="Brand palette">
                <li>Cream</li>
                <li>Lavender</li>
                <li>Purple</li>
                <li>Plum</li>
              </ul>
            </div>
            <Visual asset={visuals.heroPhoto} />
          </div>
          <div className="mirembe-subsection" id="service-discovery">
            <CaseStudyEditorialIntro
              id="mirembe-service-discovery"
              title="From service card to cleaning request"
              level={3}
            >
              <p>
                The service overview stays quick to scan. The drawer gives people room to review the
                checklist and add-ons before proceeding. On a phone the detail becomes a sheet, keeping
                the request action within reach.
              </p>
            </CaseStudyEditorialIntro>
            <MirembeServiceJourney />
            <Visual
              asset={visuals.drawer}
              caption="Standard Clean drawer · Current desktop product"
              className="mirembe-visual mirembe-drawer-capture"
            />
          </div>
          <div className="mirembe-subsection case-study-editorial-layout case-study-editorial-layout--asymmetric" id="multilingual">
            <div className="case-study-editorial-copy">
              <h3 className="case-study-editorial-subtitle">Four languages, with room to grow.</h3>
              <p>
                English, Spanish, Portuguese, and Haitian Creole have localized routes, navigation,
                forms, validation, consent copy, and search metadata. Flexible layouts accommodate longer
                labels, and a separate mobile crop keeps the hero imagery useful on small screens.
              </p>
              <p>
                The site tells customers that ZenMaid’s form may still appear in English and offers phone
                assistance. The surrounding booking and acknowledgment pages remain localized.
              </p>
            </div>
            <div className="mirembe-phone-pair" data-mirembe-reveal>
              <Visual asset={visuals.spanish} caption="Spanish homepage" />
              <Visual asset={visuals.mobileDrawer} caption="Mobile service sheet" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="engineering"
        aria-labelledby="mirembe-engineering"
        className="mirembe-section case-study-section"
        data-case-study-section="engineering"
      >
        <div className="mirembe-wrap">
          <CaseStudyEditorialIntro
            id="mirembe-engineering"
            title="Give each customer action a clear destination."
            variant="headline-led"
          >
            <p>
              React, TypeScript, Vite, Tailwind, and i18next power the interface. The public pages are
              prerendered and then hydrated. Vercel hosts the site and serverless endpoints, with
              Cloudflare Turnstile protecting public forms.
            </p>
          </CaseStudyEditorialIntro>
          <figure className="mirembe-architecture" data-mirembe-reveal>
            <figcaption>How the website connects to Mirembe’s operations</figcaption>
            <div className="mirembe-flow-head" aria-hidden="true">
              <span>Website action</span>
              <span>Processing</span>
              <span>Operational destination</span>
            </div>
            <ul aria-label="Website workflows">
              {mirembeArchitecture.map(({ action, processing, protection, destination, downstream }) => (
                <li key={action}>
                  <strong className="mirembe-flow-action">{action}</strong>
                  <div className="mirembe-flow-node">
                    <strong>{processing}</strong>
                    <span>{protection}</span>
                  </div>
                  <div className="mirembe-flow-node mirembe-flow-node--destination">
                    <strong>{destination}</strong>
                    {downstream && <span className="mirembe-flow-downstream">{downstream}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </figure>
          <div className="mirembe-operations">
            <article>
              <h3>Separate lists for separate jobs</h3>
              <p>
                I kept customer interest and cleaner applications apart. The server validates requests,
                checks Turnstile, handles duplicates, and uses a short-lived signed token for the
                optional ZIP step. Durable outboxes queue Resend notifications and Google Sheets sync.
                Sheets gave the founders a familiar way to review submissions during launch.
              </p>
            </article>
            <article>
              <h3>Preserve the choice a subscriber made</h3>
              <p>
                Newsletter signup has its own localized disclosure and validated endpoint. Provider
                testing exposed a risk that a duplicate could overwrite earlier consent. The revised flow
                skips existing contacts on import and verifies consent before segment assignment,
                preserving opt-outs. This supports subscriber collection, with broadcasts still deferred.
              </p>
            </article>
          </div>
          <div className="mirembe-subsection case-study-editorial-layout case-study-editorial-layout--asymmetric" id="booking">
            <div className="case-study-editorial-copy">
              <h3 className="case-study-editorial-subtitle">Use a scheduling tool the team can operate.</h3>
              <p>
                I kept the request journey on Mirembe’s site and used ZenMaid for holiday booking
                operations. That gave the founders a working scheduling tool while I could focus on the
                branded flow, a hosted fallback, and a localized acknowledgment with a separate
                newsletter invitation.
              </p>
              <p>
                The integration addressed the soft-launch scope. The founders are evaluating longer-term
                booking requirements as the business grows.
              </p>
            </div>
            <div className="mirembe-phone-pair">
              <Visual asset={visuals.booking} caption="Holiday booking form · Launch archive" />
              <Visual asset={visuals.thankYou} caption="Localized acknowledgment and separate opt-in" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="growth"
        aria-labelledby="mirembe-growth"
        className="mirembe-section mirembe-section--plum case-study-section"
        data-case-study-section="growth"
      >
        <div className="mirembe-wrap">
          <CaseStudyEditorialIntro
            id="mirembe-growth"
            title="Carry the same promise from the ad to the site."
            label="Creative direction & customer acquisition"
            variant="stacked"
          >
            <p>
              I produced short-form creative for social placements, using the actual mobile experience to
              show why someone might book or explore the site in their language. The launch reel and
              language reel each focus on a different reason to visit.
            </p>
          </CaseStudyEditorialIntro>
          <MirembeCreativeShowcase />
          <div className="mirembe-conversion">
            <h3 className="case-study-editorial-subtitle">From discovery to a booking request</h3>
            <ol aria-label="Acquisition journey">
              <li>Paid or organic discovery</li>
              <li>Explore services</li>
              <li>Request a cleaning</li>
              <li>Booking handoff</li>
            </ol>
            <p>
              The same service journey can receive visitors from Google Ads, Meta Ads, social, and local
              search. The waitlist and newsletter serve visitors with different intentions. With consent,
              GA4 and Meta can measure eligible booking redirects and count newly created waitlist
              signups. A booking redirect estimates a request submission. Confirmed appointments and
              completed cleanings are separate business milestones.
            </p>
          </div>
        </div>
      </section>

      <section
        id="outcomes"
        aria-labelledby="mirembe-outcomes"
        className="mirembe-section mirembe-section--outcomes case-study-section"
        data-case-study-section="outcomes"
      >
        <div className="mirembe-wrap">
          <CaseStudyEditorialIntro id="mirembe-outcomes" title="From pre-launch to serving customers." variant="headline-led">
            <p>
              A focused waitlist has grown into a live digital experience for an operating cleaning
              business. The partnership continues as real customer activity shapes the next phase of
              booking, acquisition, and engagement.
            </p>
          </CaseStudyEditorialIntro>
          <article className="mirembe-milestone">
            <h3>{mirembeOutcomes.milestone.title}</h3>
            <p>{mirembeOutcomes.milestone.text}</p>
          </article>
          <div className="mirembe-delivered">
            <h3 className="case-study-editorial-label">What shipped</h3>
            <ul className="mirembe-outcomes">
              {mirembeOutcomes.capabilities.map(({ title, text }) => (
                <li key={title}>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mirembe-reflection">
            <h3 className="case-study-editorial-subtitle">Let the business set the pace of the product.</h3>
            <p>
              Building around operational readiness gave us a clear decision at each stage. First we made
              it easy to register interest. Then we explained the service and supported real requests.
              I’m continuing to work with the founders as those needs evolve.
            </p>
            <nav aria-label="Continue exploring">
              <a
                className="mirembe-action mirembe-action--filled"
                href="https://www.mirembecleaning.com/"
              >
                View live website <span aria-hidden="true">↗</span>
              </a>
              <Link className="mirembe-action" to={MIREMBE_PORTFOLIO_PATH}>
                Back to Portfolio
              </Link>
              <Link className="mirembe-related" to="/case-studies/donor-directory">
                Previous case study · Donor Directory <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
