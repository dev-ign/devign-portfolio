import React, { useEffect, useState } from 'react';
import type { DonorRecord } from '../../../data/donorDirectoryDemoData';

interface DirectoryTableProps {
  records: DonorRecord[];
  selectedIds: Set<string>;
  emphasizedDonorId?: string;
  activeDonorId?: string;
  onToggleDonor: (donorId: string) => void;
  onToggleAll: () => void;
  onOpenDonor: (donor: DonorRecord, trigger: HTMLButtonElement) => void;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const useMobileDirectory = () => {
  const getMatches = () => window.matchMedia?.('(max-width: 760px)').matches ?? false;
  const [isMobile, setIsMobile] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(max-width: 760px)');
    if (!mediaQuery) return undefined;

    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.('change', update);
    return () => mediaQuery.removeEventListener?.('change', update);
  }, []);

  return isMobile;
};

export const StatusBadge: React.FC<{ status: DonorRecord['status'] }> = ({ status }) => (
  <span className={`directory-demo-status directory-demo-status--${status.toLowerCase()}`}>
    {status}
  </span>
);

export const EngagementMeter: React.FC<{ engagement: DonorRecord['engagement'] }> = ({ engagement }) => (
  <span className="directory-demo-engagement">
    <span className={`directory-demo-engagement__bar directory-demo-engagement__bar--${engagement.toLowerCase()}`} aria-hidden="true" />
    {engagement}
  </span>
);

export const DonorIdentity: React.FC<{ donor: DonorRecord }> = ({ donor }) => (
  <>
    <span className="directory-demo-avatar" aria-hidden="true">
      {donor.name.split(' ').map((part) => part[0]).join('')}
    </span>
    <span className="min-w-0">
      <span className="directory-demo-donor-name">{donor.name}</span>
      <span className="directory-demo-donor-meta">{donor.email}</span>
    </span>
  </>
);

const DirectoryTable: React.FC<DirectoryTableProps> = ({
  records,
  selectedIds,
  emphasizedDonorId,
  activeDonorId,
  onToggleDonor,
  onToggleAll,
  onOpenDonor,
}) => {
  const isMobile = useMobileDirectory();
  const allSelected = records.length > 0 && records.every(({ id }) => selectedIds.has(id));

  if (isMobile) {
    return (
      <div className="directory-demo-mobile-list" aria-label="Donors">
        {records.map((donor) => {
          const selected = selectedIds.has(donor.id);
          const emphasized = donor.id === emphasizedDonorId;
          const active = donor.id === activeDonorId;

          return (
            <article
              key={donor.id}
              className="directory-demo-mobile-record"
              data-selected={selected ? 'true' : 'false'}
              data-emphasized={emphasized ? 'true' : 'false'}
              data-active={active ? 'true' : 'false'}
            >
              <button
                type="button"
                className="directory-demo-mobile-record__button"
                onClick={(event) => onOpenDonor(donor, event.currentTarget)}
                aria-label={`Open details for ${donor.name}`}
              >
                <span className="directory-demo-mobile-record__identity">
                  <DonorIdentity donor={donor} />
                </span>
                <span className="directory-demo-mobile-record__signal">
                  <span className={`directory-demo-mobile-record__engagement directory-demo-mobile-record__engagement--${donor.engagement.toLowerCase()}`}>
                    {donor.engagement}
                  </span>
                  <strong>{currency.format(donor.lifetimeGiving)}</strong>
                </span>
                <span className="directory-demo-mobile-record__contact">
                  Last contact <strong>{donor.lastContact}</strong>
                </span>
                <span className="directory-demo-mobile-record__arrow" aria-hidden="true">›</span>
              </button>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="directory-demo-table-wrap">
      <table className="directory-demo-table">
        <thead>
          <tr>
            <th className="directory-demo-checkbox-cell">
              <input
                type="checkbox"
                aria-label="Select all visible donors"
                checked={allSelected}
                onChange={onToggleAll}
              />
            </th>
            <th>Donor</th>
            <th className="directory-demo-column--engagement">Engagement</th>
            <th className="directory-demo-column--manager">Relationship manager</th>
            <th>Last contact</th>
            <th className="directory-demo-column--numeric directory-demo-column--last-gift">Last gift</th>
            <th className="directory-demo-column--numeric">Lifetime giving</th>
            <th className="directory-demo-column--status">Status</th>
            <th className="directory-demo-actions-cell"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {records.map((donor) => {
            const selected = selectedIds.has(donor.id);
            const emphasized = donor.id === emphasizedDonorId;
            const active = donor.id === activeDonorId;

            return (
              <tr
                key={donor.id}
                data-selected={selected ? 'true' : 'false'}
                data-emphasized={emphasized ? 'true' : 'false'}
                data-active={active ? 'true' : 'false'}
              >
                <td className="directory-demo-checkbox-cell">
                  <input
                    type="checkbox"
                    aria-label={`Select ${donor.name}`}
                    checked={selected}
                    onChange={() => onToggleDonor(donor.id)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="directory-demo-donor-button"
                    onClick={(event) => onOpenDonor(donor, event.currentTarget)}
                  >
                    <DonorIdentity donor={donor} />
                  </button>
                </td>
                <td className="directory-demo-column--engagement"><EngagementMeter engagement={donor.engagement} /></td>
                <td className="directory-demo-column--manager">
                  <span className="directory-demo-manager">{donor.relationshipManager}</span>
                </td>
                <td className="directory-demo-last-contact">{donor.lastContact}</td>
                <td className="directory-demo-column--numeric directory-demo-column--last-gift">{currency.format(donor.lastGift)}</td>
                <td className="directory-demo-column--numeric">{currency.format(donor.lifetimeGiving)}</td>
                <td className="directory-demo-column--status"><StatusBadge status={donor.status} /></td>
                <td className="directory-demo-actions-cell">
                  <button type="button" aria-label={`More actions for ${donor.name}`} className="directory-demo-icon-button">
                    ···
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DirectoryTable;
