import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import CaseStudyDetailPage from './CaseStudyDetailPage';

jest.mock('gsap', () => ({
  gsap: { registerPlugin: jest.fn(), to: jest.fn() },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

jest.mock('../hooks/useGSAPContext', () => ({
  useGSAPContext: jest.fn(),
}));

let mockSlug = 'gravyty-template-manager';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useParams: () => ({ slug: mockSlug }),
}), { virtual: true });

const renderCaseStudy = (slug = 'gravyty-template-manager') => {
  mockSlug = slug;
  return render(<CaseStudyDetailPage />);
};

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  window.scrollTo = jest.fn();
});

test('presents the Templates Manager story around ownership and the role transition', () => {
  renderCaseStudy();

  expect(screen.getByRole('heading', { name: 'Templates Manager' })).toBeInTheDocument();
  expect(screen.getByText(/I designed the user workflows, interaction states, and reusable UI patterns/i)).toBeInTheDocument();
  expect(screen.getByTestId('template-manager-project-summary')).toBeInTheDocument();
  expect(screen.getByText('Product Design & Frontend Engineering')).toBeInTheDocument();
  expect(screen.getByText(/The original product is protected by NDA/i)).toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section')).toHaveLength(8);
  [
    'A template is only useful when the right person can find and use it.',
    'Manager → Shared Library → Fundraiser',
    'Design the rules into the interface.',
    'Follow the template from one role to the next.',
    'One rule. One designated default.',
    'The rules carried through to the frontend.',
    'A clearer path from approved content to personal outreach.',
    'The interface was the visible part of a content system.',
  ].forEach((heading) => expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument());
  expect(screen.getByText('Visible ownership and sharing')).toBeInTheDocument();
  expect(screen.getByText('Safe editing through a personal copy')).toBeInTheDocument();
  const ownershipTimeline = screen.getByTestId('ownership-timeline');
  expect(within(ownershipTimeline).getAllByRole('listitem')).toHaveLength(3);
  expect(within(ownershipTimeline).getByRole('heading', { name: 'Manager' })).toBeInTheDocument();
  expect(within(ownershipTimeline).getByRole('heading', { name: 'Shared Library' })).toBeInTheDocument();
  expect(within(ownershipTimeline).getByRole('heading', { name: 'Fundraiser' })).toBeInTheDocument();
  const firstDraft = screen.getByRole('region', { name: 'One rule. One designated default.' });
  expect(within(firstDraft).getByText('1 assigned in applicable scope')).toBeInTheDocument();
  expect(within(firstDraft).getAllByText('Top Donor')).toHaveLength(2);
  expect(within(firstDraft).getByText(/historical rule list, uniqueness scope, and reassignment behavior need confirmation/)).toBeInTheDocument();
  expect(screen.queryByText('100 users supported')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to Portfolio' })).toHaveAttribute('href', '/portfolio#selected-work');
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
});

test('guides readers from manager sharing to an editable fundraiser copy', () => {
  renderCaseStudy();
  const controls = screen.getByLabelText('Workflow controls');
  const advance = (name) => fireEvent.click(within(controls).getByRole('button', { name }));

  advance('Select template');
  expect(within(screen.getByLabelText('Template details')).getByRole('heading', { name: 'First-Time Donor Thank You' })).toBeInTheDocument();
  advance('Assign fundraisers');
  expect(screen.getByRole('dialog', { name: 'Assign fundraisers' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: /Maya Rodriguez/ })).toBeChecked();
  advance('Confirm sharing');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByText('Shared with 2 fundraisers', { selector: '.tmx-savebar span' })).toBeInTheDocument();
  advance('View as Maya');
  expect(screen.getByText(/Read-only shared template/)).toBeInTheDocument();
  advance('Duplicate to my library');
  const library = screen.getByLabelText('Fundraiser template library');
  expect(within(library).getByRole('button', { name: /First-Time Donor Thank You Shared by Dana Whitfield/ })).toHaveAttribute('data-template-id', 'template-dana-first-time');
  expect(within(library).getByRole('button', { name: /First-Time Donor Thank You — My Copy/ })).toHaveAttribute('data-template-id', 'template-maya-first-time-copy');
  expect(within(library).getByText('Update available')).toBeInTheDocument();
  expect(screen.getByLabelText('Personal template message')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Thank you for joining our community')).not.toHaveAttribute('readonly');
  fireEvent.change(screen.getByLabelText('Personal template message'), { target: { value: 'A personal note' } });
  advance('Save personal copy');
  expect(screen.getByText('Personal copy saved')).toBeInTheDocument();
  fireEvent.click(within(library).getByRole('button', { name: /First-Time Donor Thank You Shared by Dana Whitfield/ }));
  expect(screen.getByText('Update available on Dana’s shared original')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Thank you for your first gift')).toHaveAttribute('readonly');
  expect(screen.queryByLabelText('Personal template message')).not.toBeInTheDocument();
  fireEvent.click(within(library).getByRole('button', { name: /First-Time Donor Thank You — My Copy/ }));
  expect(screen.getByLabelText('Personal template message')).toHaveValue('A personal note');
  expect(screen.queryByText('Update available on Dana’s shared original')).not.toBeInTheDocument();
});

test('opens the section menu and updates the current section after navigation', () => {
  renderCaseStudy();

  expect(screen.getByTestId('active-section-label')).toHaveTextContent('Hero');
  fireEvent.click(screen.getByRole('button', { name: 'Open section navigation' }));

  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Hero' })).toHaveAttribute(
    'aria-current',
    'location'
  );

  fireEvent.click(screen.getByRole('menuitem', { name: 'Outcome' }));

  expect(screen.getByTestId('active-section-label')).toHaveTextContent('Outcome');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Open section navigation' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
});

test('presents the Donor Directory research, decisions, and credible outcomes at its public slug', () => {
  renderCaseStudy('donor-directory');

  expect(screen.getByRole('heading', { level: 1, name: 'Donor Directory' })).toBeInTheDocument();
  expect(screen.getByRole('img', {
    name: /Top of a reconstructed donor directory showing navigation, search, filters/i,
  })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Project details' })).toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section').map((section) => section.id)).toEqual([
    'opportunity', 'research', 'design-priorities', 'discovery', 'bulk-actions',
    'donor-context', 'reusable-system', 'implementation', 'outcome',
  ]);
  expect(screen.getByRole('heading', { name: 'Recommendations weren’t enough' })).toBeInTheDocument();
  expect(screen.getByText(/Original production assets and source code remain proprietary/)).toBeInTheDocument();

  const research = screen.getByRole('region', {
    name: 'I wanted to understand the workflow before designing the interface.',
  });
  expect(within(research).getByText(/champion users, fundraisers, gift officers, fundraising managers, and customer support/)).toBeInTheDocument();
  expect(within(research).getByText(/Representative questions from my recollection/)).toBeInTheDocument();
  expect(within(research).getByText('What information do you need before deciding to engage a donor?')).toBeInTheDocument();
  expect(within(research).getAllByRole('article')).toHaveLength(3);
  expect(within(research).getByText(/Fundraisers described friction/)).toBeInTheDocument();

  const priorities = screen.getByRole('region', { name: 'Turning what I learned into design priorities' });
  expect(within(priorities).getByRole('link', { name: 'Search and filtering' })).toHaveAttribute('href', '#discovery');
  expect(within(priorities).getByRole('link', { name: 'A contextual information drawer' })).toHaveAttribute('href', '#donor-context');
  expect(within(priorities).getByText(/Notes and reminders were needs raised in discovery; they are not implemented/)).toBeInTheDocument();

  expect(screen.getByTestId('live-directory-demo-discovery')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-bulk')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-hero')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Pause row-to-drawer animation' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay row-to-drawer animation' })).toBeInTheDocument();
  expect(screen.getByText(/less suited to a long, detailed workflow/)).toBeInTheDocument();
  expect(screen.getByText(/The goal wasn’t to replace the AI/)).toBeInTheDocument();
  expect(screen.getByText(/server-side retrieval and pagination with DataGrid virtualization/)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /design specification and reconstructed React component implementation/i })).toBeInTheDocument();

  const outcome = screen.getByRole('region', { name: 'What I heard, and what I’d measure today' });
  expect(within(outcome).getByText(/My product manager shared usage data/)).toBeInTheDocument();
  expect(within(outcome).getByText(/These are future evaluation measures, not historical results/)).toBeInTheDocument();
  expect(within(outcome).getAllByRole('listitem')).toHaveLength(6);
  expect(screen.queryByText(/30%/)).not.toBeInTheDocument();

  const portfolioReturnLinks = screen.getAllByRole('link', { name: 'Back to Portfolio' });
  expect(portfolioReturnLinks).toHaveLength(2);
  portfolioReturnLinks.forEach(link => expect(link).toHaveAttribute('href', '/portfolio#donor-directory'));
  expect(screen.getByRole('navigation', { name: 'Continue exploring' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View the Template Manager case study/i })).toHaveAttribute(
    'href', '/case-studies/gravyty-template-manager'
  );
});

test('navigates the Donor Directory story without resetting the working demo', () => {
  renderCaseStudy('donor-directory');
  const demo = screen.getByTestId('live-directory-demo-discovery');
  fireEvent.change(within(demo).getByRole('searchbox', { name: 'Search donors' }), {
    target: { value: 'Martinez' },
  });

  expect(screen.getByTestId('active-section-label')).toHaveTextContent('Problem');
  for (const [label, activeLabel, hash] of [
    ['Research and discovery', 'Research', '#research'],
    ['From findings to decisions', 'Design priorities', '#design-priorities'],
    ['Discover and narrow', 'Search and filters', '#discovery'],
    ['From discovery to action', 'Bulk actions', '#bulk-actions'],
    ['Inspect in context', 'Donor context', '#donor-context'],
    ['Validation and lessons', 'Outcomes', '#outcome'],
  ]) {
    fireEvent.click(screen.getByRole('button', { name: 'Open section navigation' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(9);
    fireEvent.click(screen.getByRole('menuitem', { name: label }));
    expect(window.location.hash).toBe(hash);
    expect(screen.getByTestId('active-section-label')).toHaveTextContent(activeLabel);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  }
  expect(within(demo).getByRole('searchbox', { name: 'Search donors' })).toHaveValue('Martinez');
  expect(within(demo).getByText('3 matching donors')).toBeInTheDocument();
});

test('shows a focused empty state for unsupported case-study slugs', () => {
  renderCaseStudy('not-a-case-study');

  expect(screen.getByText('Case study not found.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to Portfolio' })).toHaveAttribute(
    'href',
    '/portfolio'
  );
});
