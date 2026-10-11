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
  expect(screen.getByText(/A content workspace for managers to share reusable donor messages/i)).toBeInTheDocument();
  expect(screen.getByTestId('template-manager-project-summary')).toBeInTheDocument();
  expect(screen.getByText('Product design and frontend implementation')).toBeInTheDocument();
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

test('renders the Donor Directory case-study foundation at its public slug', () => {
  renderCaseStudy('donor-directory');

  expect(
    screen.getByRole('heading', { name: 'Designing Enterprise Data Experiences' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', {
      name: /Reconstructed Northstar Foundation donor directory showing search/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Project details' })).toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section')).toHaveLength(7);
  [
    'Making large record sets easier to navigate',
    'A workflow system, not a table',
    'Finding the right donor, faster',
    'Designing around real data constraints',
    'Using hierarchy and spacing to improve scanability',
    'From a record to a relationship',
    'Reducing repetitive work',
    'Designing beyond the ideal path',
    'Turning individual solutions into reusable product patterns',
    'Designing with production behavior in mind',
    'Designing for real-world interaction',
    'Outcome',
    'Reflection',
  ].forEach((heading) => {
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
  expect(screen.queryByRole('heading', { name: 'A foundation for every design decision' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Search' })).not.toBeInTheDocument();
  expect(screen.queryByText(/^undo$/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/^restricted$/i)).not.toBeInTheDocument();
  expect(screen.getByText(/DataGrid virtualization/i)).toBeInTheDocument();
  expect(screen.getByText(/CSV import and export/i)).toBeInTheDocument();
  expect(screen.getByText(/WCAG 2.1 AA-aligned practices/i)).toBeInTheDocument();
  expect(screen.getByText(/Search, filters, DataGrid behavior/i)).toBeInTheDocument();
  expect(screen.queryByText('donor-directory-overview')).not.toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-discovery')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-anatomy')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-hero')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-bulk')).toBeInTheDocument();
  expect(screen.getByText('Information hierarchy')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Pause row-to-drawer animation' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay row-to-drawer animation' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Amara Lewis selected and an Overview drawer/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /five chronological fictional donor activities/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Request First Draft call to action/i })).toBeInTheDocument();
  expect(screen.queryByRole('img', { name: /row highlighted by hover or keyboard focus/i })).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: /component system grouped into Inputs and Filters/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Interaction state grid for the donor directory/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /design specification and reconstructed React component implementation/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Accessibility and interaction-quality composition/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Calm summary of the reconstructed donor platform/i })).toBeInTheDocument();
  expect(screen.getByTestId('active-section-label')).toHaveTextContent('Opportunity');
  fireEvent.click(screen.getByRole('button', { name: 'Open section navigation' }));
  ['Opportunity', 'Discovery', 'Donor context', 'Bulk work', 'Reusable system', 'Implementation', 'Outcome'].forEach(
    (label) => {
      expect(screen.getByRole('menuitem', { name: label })).toBeInTheDocument();
    }
  );
  const portfolioReturnLinks = screen.getAllByRole('link', { name: 'Back to Portfolio' });
  expect(portfolioReturnLinks).toHaveLength(2);
  portfolioReturnLinks.forEach(link => expect(link).toHaveAttribute('href', '/portfolio#donor-directory'));
  expect(screen.getByText(/original product is protected by NDA/i)).toBeInTheDocument();
  expect(screen.getByText(/contextual drawer accepted a tighter canvas/i)).toBeInTheDocument();
  expect(screen.getByText(/Request First Draft sat beside the donor context/i)).toBeInTheDocument();
  expect(screen.getByText(/The directory did not create that system alone/i)).toBeInTheDocument();
  ['Discover and understand', 'Act without losing context', 'Scale beyond one feature'].forEach(
    (outcome) => expect(screen.getByRole('heading', { name: outcome })).toBeInTheDocument()
  );
  expect(screen.queryByRole('heading', { name: 'Improved discoverability' })).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Continue exploring' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View the Template Manager case study/i })).toHaveAttribute(
    'href',
    '/case-studies/gravyty-template-manager'
  );
});

test('shows a focused empty state for unsupported case-study slugs', () => {
  renderCaseStudy('not-a-case-study');

  expect(screen.getByText('Case study not found.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to Portfolio' })).toHaveAttribute(
    'href',
    '/portfolio'
  );
});
