import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CaseStudiesPage from './CaseStudiesPage';

jest.mock('gsap', () => ({ gsap: {} }));
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { refresh: jest.fn() },
}));

jest.mock('@/data/projects', () => ({
  projects: [
    {
      id: 'gravyty-template-manager',
      title: 'Template Manager',
    },
    {
      id: 'gravyty-donor-directory',
      title: 'Donor Directory',
    },
  ],
}), { virtual: true });

jest.mock('@/components/case-studies/FeaturedCaseStudyCard', () => ({ project, caseStudyPath, comingSoon, children }) => (
  comingSoon ? (
    <div aria-label={`${project.title} case study coming soon`} aria-disabled="true">
      {children}
      {project.title}
      <span>Coming soon</span>
    </div>
  ) : (
    <a
      href={caseStudyPath ?? `/projects/${project.id}`}
      aria-label={`View ${project.title} case study`}
    >
      {children}
      {project.title}
    </a>
  )
), { virtual: true });

jest.mock('@/components/showcase/TemplateManagerAnimation', () => () => (
  <div data-testid="template-manager-animation" />
), { virtual: true });

jest.mock('@/components/showcase/DonorDirectoryAnimation', () => () => (
  <div data-testid="donor-directory-animation" />
), { virtual: true });

jest.mock('@/hooks/useLenis', () => ({
  useLenis: jest.fn(),
}), { virtual: true });

jest.mock('@/hooks/useGSAPContext', () => ({
  useGSAPContext: jest.fn(),
}), { virtual: true });

jest.mock('@/components/navigation/GlobalNavigation', () => ({ onOpenInquiry, variant }) => (
  <nav aria-label="Primary" data-variant={variant}>
    <button type="button" onClick={onOpenInquiry}>Lets Work</button>
  </nav>
), { virtual: true });

jest.mock('@/components/work-with-me/InquiryModal', () => ({ open, onClose }) => (
  open ? (
    <div role="dialog" aria-label="Project inquiry">
      <button type="button" onClick={onClose}>Close inquiry form</button>
    </div>
  ) : null
), { virtual: true });

test('renders the case-studies navigation and opens the inquiry modal', () => {
  render(<CaseStudiesPage />);

  expect(screen.getByRole('navigation', { name: /primary/i })).toHaveAttribute(
    'data-variant',
    'case-studies'
  );
  expect(
    screen.getByRole('heading', { name: /projects & case studies/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/big-team builds and scrappy freelance favorites/i)).toBeInTheDocument();
  expect(screen.getByText(/^selected work$/i)).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /view template manager case study/i })
  ).toHaveAttribute('href', '/case-studies/gravyty-template-manager');
  expect(screen.queryByRole('link', { name: /donor directory/i })).not.toBeInTheDocument();
  expect(screen.getByLabelText(/donor directory case study coming soon/i)).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  expect(screen.getByText(/^coming soon$/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^lets work$/i }));

  expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();
});
