import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

test('renders the clean Template Manager case-study hero', () => {
  renderCaseStudy();

  expect(screen.getByRole('heading', { name: 'Templates Manager' })).toBeInTheDocument();
  expect(
    screen.getByText(
      'Turning a support-dependent content workflow into a scalable self-service system for fundraising teams.'
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
  expect(screen.getByTestId('template-manager-hero-visuals')).toBeInTheDocument();
  expect(screen.queryByText(/all projects/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/enterprise saas/i)).not.toBeInTheDocument();
  expect(screen.getByTestId('template-manager-project-summary')).toBeInTheDocument();
  expect(screen.getByText('Lead Product Designer & Frontend Engineer')).toBeInTheDocument();
  expect(screen.getByText(/The original product is protected by NDA/i)).toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section')).toHaveLength(11);
  [
    'Opportunity',
    'Understanding the Workflow',
    'Key Design Decisions',
    'Organizing a Growing Library',
    'Safe Editing Without HTML',
    'Sharing Across Teams',
    'Find the Right Template, Fast',
    'Preventing User Errors',
    'Technical Implementation',
    'Outcome',
    'Reflection',
  ].forEach((heading) => {
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
  expect(screen.getByAltText('TinyMCE formatting toolbar examples')).toBeInTheDocument();
  expect(screen.getByText(/How might we give fundraising teams control/i)).toBeInTheDocument();
  expect(screen.getByText('Managers needed control. Fundraisers needed flexibility.')).toBeInTheDocument();
  expect(screen.getByText('One unified library')).toBeInTheDocument();
  expect(screen.getByText('Structured editing instead of raw HTML')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Separate libraries' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Why it didn’t work' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Unified library' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Raw HTML or a custom editor' })).toBeInTheDocument();
  expect(screen.queryByText('Explored')).not.toBeInTheDocument();
  expect(screen.queryByText('Why it fell short')).not.toBeInTheDocument();
  expect(screen.queryByText('Final approach')).not.toBeInTheDocument();
  expect(screen.getByText('100', { selector: '[data-impact-metric="1"]' })).toBeInTheDocument();
  expect(screen.queryByText('100s')).not.toBeInTheDocument();
  expect(screen.getByText('Self-service', { selector: '[data-impact-metric]' })).toBeInTheDocument();
  expect(screen.queryByText('02 / Opportunity')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveClass('fixed');
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
});

test('configures the users-supported metric as a one-time 0 to 100 scroll animation', () => {
  renderCaseStudy();

  const { gsap } = require('gsap');
  const { useGSAPContext } = require('../hooks/useGSAPContext');
  const impactAnimation = useGSAPContext.mock.calls.find(
    ([, options]) => options?.scope?.current?.id === 'impact'
  );

  expect(impactAnimation).toBeDefined();
  gsap.to.mockImplementation((target, config) => {
    target.value = 100;
    config.onUpdate();
    config.onComplete();
    return {};
  });

  impactAnimation[0]();

  expect(gsap.to).toHaveBeenCalledTimes(1);
  expect(gsap.to.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      value: 100,
      duration: 1.15,
      ease: 'power1.out',
      scrollTrigger: expect.objectContaining({ once: true }),
    })
  );
  expect(screen.getByText('100', { selector: '[data-impact-metric="1"]' })).toBeInTheDocument();
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
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
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
  expect(screen.getByRole('link', { name: 'Back to case studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
});
