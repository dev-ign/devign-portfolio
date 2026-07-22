import React, { useEffect, useId, useRef, useState } from 'react';
import type {
  DonorGivingHistoryPoint,
  DonorHistoryEvent,
  DonorRecord,
} from '../../../data/donorDirectoryDemoData';

export type DonorDrawerView = 'overview' | 'history' | 'details';

interface DonorDetailDrawerProps {
  donor: DonorRecord;
  initialView?: DonorDrawerView;
  activeView?: DonorDrawerView;
  emphasizeGiving?: boolean;
  emphasizeAction?: boolean;
  closing?: boolean;
  manageFocus?: boolean;
  onClose: () => void;
}

const drawerViews: Array<{ id: DonorDrawerView; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' },
  { id: 'details', label: 'Details' },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const TimelineItem: React.FC<{ event: DonorHistoryEvent }> = ({ event }) => (
  <li className="donor-drawer-timeline__item">
    <span className={`donor-drawer-timeline__marker donor-drawer-timeline__marker--${event.type.toLowerCase()}`} aria-hidden="true" />
    <div>
      <div className="donor-drawer-timeline__heading">
        <strong>{event.title}</strong>
        <time>{event.date}</time>
      </div>
      <p>{event.description}</p>
    </div>
  </li>
);

export const DonorSummaryMetrics: React.FC<{ donor: DonorRecord }> = ({ donor }) => (
  <div className="donor-drawer-metrics" aria-label="Donor summary">
    {[
      ['Lifetime giving', currency.format(donor.lifetimeGiving)],
      ['Last gift', currency.format(donor.lastGift)],
      ['Last contact', donor.lastContact],
      ['Engagement', donor.engagement],
    ].map(([label, value]) => (
      <div key={label}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    ))}
  </div>
);

export const DonorGivingHistory: React.FC<{
  points: DonorGivingHistoryPoint[];
  emphasized?: boolean;
}> = ({ points, emphasized }) => {
  const titleId = useId();
  const summaryId = useId();
  const maxAmount = Math.max(...points.map(({ amount }) => amount), 1);
  const total = points.reduce((sum, { amount }) => sum + amount, 0);

  return (
    <section
      className="donor-drawer-giving"
      data-emphasized={emphasized ? 'true' : 'false'}
      aria-labelledby={titleId}
    >
      <div className="donor-drawer-section__heading">
        <h3 id={titleId}>Giving History</h3>
        <span>Last 5 years</span>
      </div>
      {points.length > 0 ? (
        <>
          <p id={summaryId} className="sr-only">
            {currency.format(total)} represented across the last five years of fictional giving history.
          </p>
          <ol className="donor-drawer-giving__chart" aria-describedby={summaryId}>
            {points.map(({ year, amount }) => (
              <li key={year} aria-label={`${year}: ${currency.format(amount)}`}>
                <span className="donor-drawer-giving__value">{currency.format(amount)}</span>
                <span className="donor-drawer-giving__track" aria-hidden="true">
                  <span style={{ height: `${Math.max((amount / maxAmount) * 100, 8)}%` }} />
                </span>
                <span className="donor-drawer-giving__year">{year}</span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="donor-drawer-giving__empty">No giving history is available for this donor.</p>
      )}
    </section>
  );
};

export const DonorNextAction: React.FC<{ donor: DonorRecord; emphasized?: boolean }> = ({ donor, emphasized }) => {
  const [requested, setRequested] = useState(false);
  const titleId = useId();

  return (
    <section className="donor-drawer-next-action" data-emphasized={emphasized ? 'true' : 'false'} aria-labelledby={titleId}>
      <span className="donor-drawer-eyebrow">Recommended next step</span>
      <h3 id={titleId}>Request a personalized first draft</h3>
      <p>{donor.nextAction}</p>
      <div className="donor-drawer-next-action__context">
        <span>Based on</span>
        <strong>Recent engagement · {donor.relationshipStage}</strong>
      </div>
      <button type="button" onClick={() => setRequested(true)} disabled={requested}>
        {requested ? 'Request submitted' : 'Request First Draft'}
      </button>
      {requested && <p role="status" className="donor-drawer-success">The request was added to the donor workflow.</p>}
    </section>
  );
};

export const DonorDetailsList: React.FC<{ donor: DonorRecord; compact?: boolean }> = ({ donor, compact = false }) => {
  const details = [
    ['Email', donor.email],
    ['Phone', donor.phone],
    ['Location', donor.location],
    ['Relationship manager', donor.relationshipManager],
    ['Preferred contact', donor.preferredChannel],
    ['Relationship stage', donor.relationshipStage],
  ];

  return (
    <dl className="donor-drawer-details">
      {(compact ? details.filter(([label]) => ['Email', 'Relationship manager', 'Preferred contact'].includes(label)) : details)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
};

const DonorDetailDrawer: React.FC<DonorDetailDrawerProps> = ({
  donor,
  initialView = 'overview',
  activeView,
  emphasizeGiving = false,
  emphasizeAction = false,
  closing = false,
  manageFocus = true,
  onClose,
}) => {
  const drawerTitleId = useId();
  const panelId = useId();
  const recentHistoryTitleId = useId();
  const coreDetailsTitleId = useId();
  const fullHistoryTitleId = useId();
  const detailsTitleId = useId();
  const [view, setView] = useState<DonorDrawerView>(activeView ?? initialView);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Record<DonorDrawerView, HTMLButtonElement | null>>({
    overview: null,
    history: null,
    details: null,
  });

  useEffect(() => {
    if (activeView) setView(activeView);
  }, [activeView]);

  useEffect(() => {
    if (manageFocus) closeButtonRef.current?.focus({ preventScroll: true });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [manageFocus, onClose]);

  const selectView = (nextView: DonorDrawerView, moveFocus = false) => {
    setView(nextView);
    if (moveFocus) tabRefs.current[nextView]?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentView: DonorDrawerView) => {
    const currentIndex = drawerViews.findIndex(({ id }) => id === currentView);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % drawerViews.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + drawerViews.length) % drawerViews.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = drawerViews.length - 1;
    else return;

    event.preventDefault();
    selectView(drawerViews[nextIndex].id, true);
  };

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={drawerTitleId}
      className="donor-detail-drawer"
      data-closing={closing ? 'true' : 'false'}
      data-testid="donor-detail-drawer"
    >
      <header className="donor-drawer-header">
        <span className="donor-drawer-avatar" aria-hidden="true">
          {donor.name.split(' ').map((part) => part[0]).join('')}
        </span>
        <div>
          <h2 id={drawerTitleId}>{donor.name}</h2>
          <p>{donor.location} · {donor.relationshipStage}</p>
        </div>
        <button ref={closeButtonRef} type="button" aria-label="Close donor details" onClick={onClose} className="donor-drawer-close">
          ×
        </button>
      </header>

      <div className="donor-drawer-tabs" role="tablist" aria-label="Donor detail sections">
        {drawerViews.map(({ id, label }) => (
          <button
            key={id}
            ref={(element) => { tabRefs.current[id] = element; }}
            id={`${panelId}-tab-${id}`}
            type="button"
            role="tab"
            aria-controls={`${panelId}-${id}`}
            aria-selected={view === id}
            tabIndex={view === id ? 0 : -1}
            onClick={() => selectView(id)}
            onKeyDown={(event) => handleTabKeyDown(event, id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id={`${panelId}-${view}`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${view}`}
        className="donor-drawer-scroll-region"
      >
        {view === 'overview' && (
          <>
            <DonorSummaryMetrics donor={donor} />
            <DonorNextAction donor={donor} emphasized={emphasizeAction} />
            <DonorGivingHistory points={donor.givingHistory} emphasized={emphasizeGiving} />
            <section className="donor-drawer-section" aria-labelledby={recentHistoryTitleId}>
              <div className="donor-drawer-section__heading">
                <h3 id={recentHistoryTitleId}>Recent history</h3>
                <button type="button" onClick={() => selectView('history')}>View all</button>
              </div>
              <ol className="donor-drawer-timeline">
                {donor.history.slice(0, 3).map((event) => <TimelineItem key={event.id} event={event} />)}
              </ol>
            </section>
            <section className="donor-drawer-section" aria-labelledby={coreDetailsTitleId}>
              <h3 id={coreDetailsTitleId}>Essential details</h3>
              <DonorDetailsList donor={donor} compact />
            </section>
          </>
        )}

        {view === 'history' && (
          <section className="donor-drawer-section donor-drawer-section--history" aria-labelledby={fullHistoryTitleId}>
            <h3 id={fullHistoryTitleId}>Relationship history</h3>
            <p className="donor-drawer-section__intro">A chronological view of meaningful donor activity.</p>
            <ol className="donor-drawer-timeline donor-drawer-timeline--expanded">
              {donor.history.map((event) => <TimelineItem key={event.id} event={event} />)}
            </ol>
          </section>
        )}

        {view === 'details' && (
          <section className="donor-drawer-section donor-drawer-section--details" aria-labelledby={detailsTitleId}>
            <h3 id={detailsTitleId}>Donor details</h3>
            <DonorDetailsList donor={donor} />
            <h4>Tags</h4>
            <div className="donor-drawer-tags" aria-label="Donor tags">
              {donor.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <h4>Interests</h4>
            <div className="donor-drawer-tags donor-drawer-tags--interests" aria-label="Donor interests">
              {donor.interests.map((interest) => <span key={interest}>{interest}</span>)}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
};

export default DonorDetailDrawer;
