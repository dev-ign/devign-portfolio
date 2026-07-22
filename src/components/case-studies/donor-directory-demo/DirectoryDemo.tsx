import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  DONOR_DIRECTORY_ORGANIZATION,
  DONOR_DIRECTORY_TOTAL_RECORDS,
  donorDirectoryRecords,
  getDemoDonor,
  type DonorRecord,
} from '../../../data/donorDirectoryDemoData';
import DirectoryTable from './DirectoryTable';
import DonorDetailDrawer, { type DonorDrawerView } from './DonorDetailDrawer';

export type DirectoryDemoState =
  | 'default'
  | 'filtered'
  | 'selected'
  | 'row-focused'
  | 'row-selected'
  | 'drawer'
  | 'drawer-history'
  | 'drawer-details'
  | 'row-to-drawer';

interface DirectoryDemoProps {
  state: DirectoryDemoState;
  donorId?: string;
  autoPlay?: boolean;
  onAnimationStageChange?: (stage: string) => void;
  embedded?: boolean;
}

const selectedStateIds = ['amara-lewis', 'julian-mercer', 'elena-rivera'];

export const ROW_TO_DRAWER_TIMELINE = [
  { id: 'resting', duration: 1000 },
  { id: 'row-focused', duration: 650 },
  { id: 'row-activated', duration: 400 },
  { id: 'drawer-opening', duration: 300 },
  { id: 'overview-settled', duration: 1400 },
  { id: 'giving-history', duration: 900 },
  { id: 'history', duration: 1400 },
  { id: 'action-emphasis', duration: 1250 },
  { id: 'drawer-closing', duration: 280 },
  { id: 'context-restored', duration: 1000 },
] as const;

export const ROW_TO_DRAWER_DURATION = ROW_TO_DRAWER_TIMELINE.reduce(
  (total, stage) => total + stage.duration,
  0
);

const drawerViewForState = (state: DirectoryDemoState): DonorDrawerView => {
  if (state === 'drawer-history') return 'history';
  if (state === 'drawer-details') return 'details';
  return 'overview';
};

const DirectoryDemo: React.FC<DirectoryDemoProps> = ({
  state,
  donorId = 'amara-lewis',
  autoPlay = true,
  onAnimationStageChange,
  embedded = false,
}) => {
  const titleId = useId();
  const [query, setQuery] = useState(state === 'filtered' ? 'Martinez' : '');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(state === 'selected' ? selectedStateIds : state === 'row-selected' ? ['amara-lewis'] : [])
  );
  const [drawerDonor, setDrawerDonor] = useState<DonorRecord | null>(
    state.startsWith('drawer') ? getDemoDonor(donorId) : null
  );
  const [filtersOpen, setFiltersOpen] = useState(state === 'filtered');
  const [engagementFilter, setEngagementFilter] = useState<'High' | null>(
    state === 'filtered' ? 'High' : null
  );
  const [animationStep, setAnimationStep] = useState(state === 'row-to-drawer' ? 0 : -1);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setQuery(state === 'filtered' ? 'Martinez' : '');
    setSelectedIds(new Set(state === 'selected' ? selectedStateIds : state === 'row-selected' ? ['amara-lewis'] : []));
    setDrawerDonor(state.startsWith('drawer') ? getDemoDonor(donorId) : null);
    setFiltersOpen(state === 'filtered');
    setEngagementFilter(state === 'filtered' ? 'High' : null);
  }, [donorId, state]);

  useEffect(() => {
    if (state !== 'row-to-drawer') {
      setAnimationStep(-1);
      return undefined;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setAnimationStep(4);
      return undefined;
    }

    setAnimationStep(0);
    return undefined;
  }, [state]);

  useEffect(() => {
    if (state !== 'row-to-drawer' || animationStep < 0 || !autoPlay) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setTimeout(() => {
      setAnimationStep((current) => (current + 1) % ROW_TO_DRAWER_TIMELINE.length);
    }, ROW_TO_DRAWER_TIMELINE[animationStep].duration);

    return () => window.clearTimeout(timer);
  }, [animationStep, autoPlay, state]);

  useEffect(() => {
    if (state !== 'row-to-drawer' || animationStep < 0) return;
    onAnimationStageChange?.(ROW_TO_DRAWER_TIMELINE[animationStep].id);
  }, [animationStep, onAnimationStageChange, state]);

  const displayedRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let records = normalizedQuery
      ? donorDirectoryRecords.filter((donor) =>
          [donor.name, donor.email, donor.location].some((value) =>
            value.toLowerCase().includes(normalizedQuery)
          )
        )
      : donorDirectoryRecords;

    if (engagementFilter) {
      records = records.filter((donor) => donor.engagement === engagementFilter);
    }

    return records.slice(0, 8);
  }, [engagementFilter, query]);

  const activeFilterCount = (engagementFilter ? 1 : 0) + (query.trim() ? 1 : 0);

  const effectiveSelectedIds = useMemo(() => {
    const ids = new Set(selectedIds);
    if (state === 'row-to-drawer' && animationStep >= 2) ids.add('amara-lewis');
    return ids;
  }, [animationStep, selectedIds, state]);

  const animatedDrawerDonor =
    state === 'row-to-drawer' && animationStep >= 3 && animationStep <= 8
      ? getDemoDonor('amara-lewis')
      : drawerDonor;

  const animatedDrawerView: DonorDrawerView =
    state === 'row-to-drawer' && animationStep === 6
      ? 'history'
      : drawerViewForState(state);

  const activeDonorId = animatedDrawerDonor?.id
    ?? (state === 'row-to-drawer' && animationStep === 9 ? 'amara-lewis' : undefined);

  const toggleDonor = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((current) => {
      const allSelected = displayedRecords.every(({ id }) => current.has(id));
      return allSelected ? new Set() : new Set(displayedRecords.map(({ id }) => id));
    });
  };

  const openDonor = (donor: DonorRecord, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setDrawerDonor(donor);
  };

  const closeDrawer = useCallback(() => {
    setDrawerDonor(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const MainElement = embedded ? 'div' : 'main';
  const DemoHeading = embedded ? 'h4' : 'h1';

  return (
    <div
      className="directory-demo-shell"
      data-testid="directory-demo-shell"
      data-demo-state={state}
      data-animation-step={animationStep}
      data-animation-stage={animationStep >= 0 ? ROW_TO_DRAWER_TIMELINE[animationStep]?.id : undefined}
    >
      <header className="directory-demo-product-nav">
        <div className="directory-demo-product-mark" aria-hidden="true">N</div>
        <strong>{DONOR_DIRECTORY_ORGANIZATION}</strong>
        <nav aria-label="Product">
          <span>Dashboard</span>
          <span aria-current="page">Donors</span>
          <span>Campaigns</span>
          <span>Reporting</span>
        </nav>
        <div className="directory-demo-user" aria-label="Signed in as Jordan Blake">JB</div>
      </header>

      <MainElement className="directory-demo-main">
        <section className="directory-demo-heading-row" aria-labelledby={titleId}>
          <div>
            <span className="directory-demo-kicker">Relationship intelligence</span>
            <DemoHeading id={titleId}>Donor Directory</DemoHeading>
            <p>{DONOR_DIRECTORY_TOTAL_RECORDS.toLocaleString()} donor records</p>
          </div>
          <div className="directory-demo-heading-actions">
            <button type="button" className="directory-demo-button directory-demo-button--secondary">Import CSV</button>
            <button type="button" className="directory-demo-button directory-demo-button--primary">Add donor</button>
          </div>
        </section>

        <section className="directory-demo-toolbar" aria-label="Directory controls">
          <label className="directory-demo-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search donors</span>
            <input
              type="search"
              aria-label="Search donors"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search donors"
            />
            <kbd>⌘ K</kbd>
          </label>
          <button
            type="button"
            className="directory-demo-filter-trigger"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            Filters <span>{activeFilterCount}</span>
          </button>
          {engagementFilter && (
            <span className="directory-demo-filter-chip">
              Engagement: {engagementFilter}
              <button
                type="button"
                aria-label="Remove engagement filter"
                onClick={() => setEngagementFilter(null)}
              >
                ×
              </button>
            </span>
          )}
          {query.trim() && (
            <span className="directory-demo-filter-chip">
              Name: {query.trim()}
              <button type="button" aria-label="Clear donor search" onClick={() => setQuery('')}>×</button>
            </span>
          )}
          <button type="button" className="directory-demo-sort-control">Lifetime giving ↓</button>
          <span className="directory-demo-result-count">
            {activeFilterCount > 0
              ? `${displayedRecords.length} matching donors`
              : `1–${displayedRecords.length} of ${DONOR_DIRECTORY_TOTAL_RECORDS.toLocaleString()}`}
          </span>
        </section>

        {filtersOpen && (
          <div className="directory-demo-filter-panel" role="region" aria-label="Filters">
            <button type="button">Relationship manager</button>
            <button
              type="button"
              aria-pressed={engagementFilter === 'High'}
              onClick={() => {
                setEngagementFilter((current) => (current === 'High' ? null : 'High'));
                setFiltersOpen(false);
              }}
            >
              High engagement
            </button>
            <button type="button">Donor status</button>
            <button type="button">Location</button>
          </div>
        )}

        {effectiveSelectedIds.size > 0 && (
          <section className="directory-demo-bulk-bar" aria-label="Bulk actions">
            <strong>{effectiveSelectedIds.size} selected</strong>
            <button type="button">Export CSV</button>
            <button type="button">Assign</button>
            <button type="button">Add tag</button>
            <button type="button" disabled={effectiveSelectedIds.size < 2}>Update status</button>
            <button type="button" onClick={() => setSelectedIds(new Set())} className="directory-demo-bulk-clear">Clear selection</button>
          </section>
        )}

        <DirectoryTable
          records={displayedRecords}
          selectedIds={effectiveSelectedIds}
          emphasizedDonorId={
            state === 'row-focused' || (state === 'row-to-drawer' && animationStep === 1)
              ? 'amara-lewis'
              : undefined
          }
          activeDonorId={activeDonorId}
          onToggleDonor={toggleDonor}
          onToggleAll={toggleAll}
          onOpenDonor={openDonor}
        />

        <footer className="directory-demo-pagination" aria-label="Pagination">
          <span>Rows per page <strong>25</strong></span>
          <span>1–25 of {DONOR_DIRECTORY_TOTAL_RECORDS.toLocaleString()}</span>
          <div>
            <button type="button" aria-label="Previous page" disabled>‹</button>
            <button type="button" aria-current="page">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button" aria-label="Next page">›</button>
          </div>
        </footer>
      </MainElement>

      {animatedDrawerDonor && (
        <DonorDetailDrawer
          key={animatedDrawerDonor.id}
          donor={animatedDrawerDonor}
          initialView={drawerViewForState(state)}
          activeView={animatedDrawerView}
          emphasizeGiving={state === 'row-to-drawer' && animationStep === 5}
          emphasizeAction={state === 'row-to-drawer' && animationStep === 7}
          closing={state === 'row-to-drawer' && animationStep === 8}
          manageFocus={state !== 'row-to-drawer'}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
};

export default DirectoryDemo;
