import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CaseStudyDetailPage from './CaseStudyDetailPage';

jest.mock('gsap', () => ({
  gsap: { registerPlugin: jest.fn() },
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
      'Empowering fundraising teams to create, organize, and share email templates through a self-service templating platform.'
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
  expect(screen.getByTestId('template-manager-hero-visuals')).toBeInTheDocument();
  expect(screen.queryByText(/all projects/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/enterprise saas/i)).not.toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section')).toHaveLength(10);
  [
    'Opportunity',
    'Understanding the Workflow',
    'Organizing a Growing Library',
    'Safe Editing Without HTML',
    'Sharing Across Teams',
    'Find the Right Template, Fast',
    'Preventing User Errors',
    'Technical Implementation',
    'Impact',
    'Reflection',
  ].forEach((heading) => {
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
  expect(screen.getByAltText('TinyMCE formatting toolbar examples')).toBeInTheDocument();
  expect(screen.queryByText('02 / Opportunity')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveClass('fixed');
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
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

  fireEvent.click(screen.getByRole('menuitem', { name: 'Impact' }));

  expect(screen.getByTestId('active-section-label')).toHaveTextContent('Impact');
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
  expect(screen.getByRole('heading', { name: 'Quick Facts' })).toBeInTheDocument();
  expect(screen.getAllByTestId('case-study-section')).toHaveLength(7);
  [
    'Making large record sets easier to navigate',
    'A foundation for every design decision',
    'Solving the directory as a set of connected UX problems',
    'Finding the right donor, faster',
    'Search',
    'Filtering',
    'Sorting',
    'Designing for scale without sacrificing responsiveness',
    'Using hierarchy and spacing to improve scanability',
    'Moving from a record to a relationship',
    'Reducing repetitive work through confident bulk actions',
    'Designing beyond the ideal path',
    'Turning individual solutions into reusable product patterns',
    'Designing with production behavior in mind',
    'The details that make a complex product feel reliable',
    'A stronger foundation for data-heavy product experiences',
  ].forEach((heading) => {
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
  expect(screen.queryByText(/^undo$/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/^restricted$/i)).not.toBeInTheDocument();
  expect(screen.getByText(/DataGrid Pro's virtualization capabilities/i)).toBeInTheDocument();
  expect(screen.getByText('CSV import/export')).toBeInTheDocument();
  expect(screen.getByText(/WCAG 2.1 AA-aligned practices/i)).toBeInTheDocument();
  expect(screen.getByText(/reused and extended shared patterns for search/i)).toBeInTheDocument();
  expect(screen.queryByText('donor-directory-overview')).not.toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-discovery')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-anatomy')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-hero')).toBeInTheDocument();
  expect(screen.getByTestId('live-directory-demo-bulk')).toBeInTheDocument();
  expect(screen.getByText('Donor hierarchy')).toBeInTheDocument();
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
  ['Opportunity', 'Principles', 'Experience', 'Systems', 'Implementation', 'Quality', 'Impact'].forEach(
    (label) => {
      expect(screen.getByRole('menuitem', { name: label })).toBeInTheDocument();
    }
  );
  expect(screen.getByRole('link', { name: '← Case Studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
  expect(screen.getByText(/respect confidentiality/i)).toBeInTheDocument();
  expect(screen.getByText(/donor-detail drawer allowed users/i)).toBeInTheDocument();
  expect(screen.getByText(/including requesting a first draft/i)).toBeInTheDocument();
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
