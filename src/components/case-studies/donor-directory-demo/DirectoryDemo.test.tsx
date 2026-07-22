import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { donorDirectoryRecords } from '../../../data/donorDirectoryDemoData';
import DirectoryDemo, { ROW_TO_DRAWER_DURATION, ROW_TO_DRAWER_TIMELINE } from './DirectoryDemo';

const setMatchMedia = (matchesFor: (query: string) => boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: matchesFor(query),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia');
});

test('uses 30 consistent fictional donor records with reserved email domains', () => {
  expect(donorDirectoryRecords).toHaveLength(30);
  expect(new Set(donorDirectoryRecords.map(({ id }) => id)).size).toBe(30);
  donorDirectoryRecords.forEach((donor) => {
    expect(donor.email).toMatch(/@example\.org$/);
    expect(donor.phone).toMatch(/^\(555\) 010-/);
    expect(donor.givingHistory).toHaveLength(5);
    expect(donor.givingHistory.reduce((total, point) => total + point.amount, 0))
      .toBeLessThanOrEqual(donor.lifetimeGiving);
  });
  expect(JSON.stringify(donorDirectoryRecords)).not.toMatch(/gravyty/i);
});

test('renders a believable filtered directory state', () => {
  render(<DirectoryDemo state="filtered" />);

  expect(screen.getByRole('searchbox', { name: 'Search donors' })).toHaveValue('Martinez');
  expect(screen.getByText('Sofia Martinez')).toBeInTheDocument();
  expect(screen.getByText('Mateo Martinez')).toBeInTheDocument();
  expect(screen.queryByText('Lucia Martinez')).not.toBeInTheDocument();
  expect(screen.getByText('2 matching donors')).toBeInTheDocument();
});

test('lets a viewer search and apply or remove a high-engagement filter', () => {
  render(<DirectoryDemo state="default" />);

  fireEvent.change(screen.getByRole('searchbox', { name: 'Search donors' }), {
    target: { value: 'Martinez' },
  });
  expect(screen.getByText('3 matching donors')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /filters/i }));
  fireEvent.click(screen.getByRole('button', { name: 'High engagement' }));
  expect(screen.getByText('2 matching donors')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Remove engagement filter' }));
  expect(screen.getByText('3 matching donors')).toBeInTheDocument();
});

test('opens the contextual drawer with history and the confirmed primary action', () => {
  render(<DirectoryDemo state="drawer" donorId="amara-lewis" />);

  expect(screen.getByRole('dialog', { name: 'Amara Lewis' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Request First Draft' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('heading', { name: 'Giving History' })).toBeInTheDocument();
  expect(screen.getByText('Meeting recorded')).toBeInTheDocument();
  expect(within(screen.getByRole('dialog', { name: 'Amara Lewis' })).getByText('$24,850')).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('uses Overview, History, and Details as keyboard-operable drawer tabs', () => {
  render(<DirectoryDemo state="drawer" donorId="amara-lewis" />);

  const overviewTab = screen.getByRole('tab', { name: 'Overview' });
  const historyTab = screen.getByRole('tab', { name: 'History' });
  const detailsTab = screen.getByRole('tab', { name: 'Details' });

  expect(overviewTab).toHaveAttribute('aria-selected', 'true');
  expect(historyTab).toHaveAttribute('aria-selected', 'false');
  expect(detailsTab).toHaveAttribute('aria-selected', 'false');

  fireEvent.click(historyTab);
  expect(screen.getByRole('heading', { name: 'Relationship history' })).toBeInTheDocument();

  fireEvent.keyDown(historyTab, { key: 'ArrowRight' });
  expect(detailsTab).toHaveFocus();
  expect(screen.getByRole('heading', { name: 'Donor details' })).toBeInTheDocument();
  expect(screen.getByText('Student opportunity')).toBeInTheDocument();
});

test('renders an accessible five-year giving visualization', () => {
  render(<DirectoryDemo state="drawer" donorId="amara-lewis" />);

  const chart = screen.getByRole('region', { name: 'Giving History' });
  expect(within(chart).getByText('Last 5 years')).toBeInTheDocument();
  expect(within(chart).getAllByRole('listitem')).toHaveLength(5);
  expect(within(chart).getByLabelText('2025: $7,400')).toBeInTheDocument();
});

test('restores focus to the donor row trigger after closing the drawer', async () => {
  render(<DirectoryDemo state="default" />);

  const donorTrigger = screen.getByRole('button', {
    name: 'Amara Lewis amara.lewis@example.org',
  });
  fireEvent.click(donorTrigger);
  fireEvent.click(screen.getByRole('button', { name: 'Close donor details' }));

  await waitFor(() => expect(donorTrigger).toHaveFocus());
});

test('shows contextual bulk actions for the selected state', () => {
  render(<DirectoryDemo state="selected" />);

  expect(screen.getByRole('region', { name: 'Bulk actions' })).toHaveTextContent('3 selected');
  expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument();
  expect(screen.queryByText(/^undo$/i)).not.toBeInTheDocument();
});

test('uses an 8.58 second staged row-to-drawer sequence', () => {
  expect(ROW_TO_DRAWER_TIMELINE.map(({ id }) => id)).toEqual([
    'resting',
    'row-focused',
    'row-activated',
    'drawer-opening',
    'overview-settled',
    'giving-history',
    'history',
    'action-emphasis',
    'drawer-closing',
    'context-restored',
  ]);
  expect(ROW_TO_DRAWER_DURATION).toBe(8580);
});

test('settles on an understandable Overview state when reduced motion is requested', async () => {
  setMatchMedia((query) => query.includes('prefers-reduced-motion'));
  render(<DirectoryDemo state="row-to-drawer" />);

  await waitFor(() => {
    expect(screen.getByTestId('directory-demo-shell'))
      .toHaveAttribute('data-animation-stage', 'overview-settled');
  });
  expect(screen.getByRole('dialog', { name: 'Amara Lewis' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
});

test('uses a prioritized mobile record list and opens a full detail panel', () => {
  setMatchMedia((query) => query.includes('max-width'));
  render(<DirectoryDemo state="default" />);

  const donorTrigger = screen.getByRole('button', { name: 'Open details for Amara Lewis' });
  expect(screen.getByLabelText('Donors')).toBeInTheDocument();
  fireEvent.click(donorTrigger);
  expect(screen.getByRole('dialog', { name: 'Amara Lewis' })).toBeInTheDocument();
});
