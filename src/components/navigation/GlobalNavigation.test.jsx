import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GlobalNavigation from './GlobalNavigation';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

jest.mock('@/components/BrandLogo', () => () => <span>devignUX</span>, { virtual: true });

describe('GlobalNavigation', () => {
  const renderNavigation = props => render(<GlobalNavigation {...props} />);
  const portfolioProps = {
    variant: 'portfolio',
    activePortfolioChapter: 'meet-the-founder',
    portfolioProjects: [
      { sectionId: 'selected-work', title: 'Templates Manager' },
      { sectionId: 'donor-directory', title: 'Donor Directory' },
      { sectionId: 'urge-talent', title: 'Urge Talent' },
    ],
  };

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  test('opens the inquiry modal from the desktop Lets Work button', () => {
    const onScrollTo = jest.fn();
    const onOpenInquiry = jest.fn();

    renderNavigation({ onScrollTo, onOpenInquiry });

    fireEvent.click(screen.getByRole('button', { name: /^lets work$/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
    expect(onScrollTo).not.toHaveBeenCalledWith('inquiry');
  });

  test('opens the inquiry modal from the mobile menu Lets Work button', () => {
    const onScrollTo = jest.fn();
    const onOpenInquiry = jest.fn();

    renderNavigation({ onScrollTo, onOpenInquiry });

    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /^lets work →$/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
    expect(onScrollTo).not.toHaveBeenCalledWith('inquiry');
  });

  test('includes Portfolio in the home navigation', () => {
    renderNavigation({ onScrollTo: jest.fn(), onOpenInquiry: jest.fn() });

    expect(screen.getByRole('link', { name: /^portfolio$/i })).toHaveAttribute(
      'href',
      '/portfolio'
    );
  });

  test('transitions the Portfolio action to its glass pill state on scroll', () => {
    renderNavigation({ onScrollTo: jest.fn(), onOpenInquiry: jest.fn() });
    const caseStudiesLink = screen.getByRole('link', { name: /^portfolio$/i });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    fireEvent.scroll(window);

    expect(caseStudiesLink).toHaveClass('case-studies-nav-link--glass');
  });

  test('connects the portfolio navigation to Studio and the real resume', () => {
    renderNavigation(portfolioProps);

    expect(screen.getByRole('link', { name: /^studio$/i })).toHaveAttribute('href', '/studio');
    expect(screen.getByRole('link', { name: /^resume$/i })).toHaveAttribute(
      'href',
      '/jona-ferreira-product-resume-devign.docx'
    );
    expect(screen.getByRole('link', { name: /^resume$/i })).toHaveAttribute('download', 'jona-ferreira-product-resume-devign.docx');
    expect(screen.getByRole('link', { name: /^get in touch$/i })).toHaveAttribute('href', 'mailto:contact@devignux.com');
    expect(screen.getByRole('link', { name: /^meet the founder$/i })).toHaveAttribute(
      'href',
      '#meet-the-founder'
    );
    expect(screen.getByRole('link', { name: /^selected work$/i })).toHaveAttribute('href', '#selected-work');
    expect(screen.getByRole('link', { name: /^meet the founder$/i })).toHaveAttribute('aria-current', 'location');
  });

  test('morphs into the active project title and updates in both directions', () => {
    const { rerender } = renderNavigation({ ...portfolioProps, activePortfolioChapter: 'selected-work' });
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(nav).toHaveAttribute('data-portfolio-mode', 'compact');
    expect(screen.getByRole('button', { name: 'Templates Manager. Choose project' })).toBeVisible();

    rerender(<GlobalNavigation {...portfolioProps} activePortfolioChapter="donor-directory" />);
    expect(screen.getByRole('button', { name: 'Donor Directory. Choose project' })).toBeVisible();
    rerender(<GlobalNavigation {...portfolioProps} activePortfolioChapter="urge-talent" />);
    expect(screen.getByRole('button', { name: 'Urge Talent. Choose project' })).toBeVisible();
    rerender(<GlobalNavigation {...portfolioProps} activePortfolioChapter="selected-work" />);
    expect(screen.getByRole('button', { name: 'Templates Manager. Choose project' })).toBeVisible();
    rerender(<GlobalNavigation {...portfolioProps} activePortfolioChapter="meet-the-founder" />);
    expect(nav).toHaveAttribute('data-portfolio-mode', 'full');
    expect(screen.getByRole('link', { name: /^meet the founder$/i })).toHaveAttribute('aria-current', 'location');
  });

  test('project selector exposes all project anchors and current state', () => {
    renderNavigation({ ...portfolioProps, activePortfolioChapter: 'donor-directory' });
    const title = screen.getByRole('button', { name: 'Donor Directory. Choose project' });
    fireEvent.click(title);
    expect(title).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Donor Directory' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Urge Talent' })).toHaveAttribute('href', '#urge-talent');
    fireEvent.click(screen.getByRole('link', { name: 'Templates Manager' }));
    expect(title).toHaveAttribute('aria-expanded', 'false');
  });

  test('hamburger keeps the title visible and Escape returns focus', () => {
    renderNavigation({ ...portfolioProps, activePortfolioChapter: 'urge-talent' });
    const toggle = screen.getByRole('button', { name: 'Open Portfolio navigation' });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Urge Talent. Choose project' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Selected Work' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Meet the Founder' })).toHaveAttribute('href', '#meet-the-founder');
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('download');
    expect(screen.getByRole('link', { name: 'Get in Touch' })).toHaveAttribute('href', 'mailto:contact@devignux.com');
    screen.getAllByRole('link', { name: 'Studio' }).forEach(link => {
      expect(link).toHaveAttribute('href', '/studio');
    });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open Portfolio navigation' })).toHaveFocus();
  });
});
