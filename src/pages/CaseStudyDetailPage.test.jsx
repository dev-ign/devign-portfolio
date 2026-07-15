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

test('shows a focused empty state for unsupported case-study slugs', () => {
  renderCaseStudy('not-a-case-study');

  expect(screen.getByText('Case study not found.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to case studies' })).toHaveAttribute(
    'href',
    '/case-studies'
  );
});
