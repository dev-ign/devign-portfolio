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

  test('includes Case Studies in the home navigation', () => {
    renderNavigation({ onScrollTo: jest.fn(), onOpenInquiry: jest.fn() });

    expect(screen.getByRole('link', { name: /^case studies$/i })).toHaveAttribute(
      'href',
      '/case-studies'
    );
  });

  test('transitions the Case Studies action to its glass pill state on scroll', () => {
    renderNavigation({ onScrollTo: jest.fn(), onOpenInquiry: jest.fn() });
    const caseStudiesLink = screen.getByRole('link', { name: /^case studies$/i });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    fireEvent.scroll(window);

    expect(caseStudiesLink).toHaveClass('case-studies-nav-link--glass');
  });

  test('shows only the logo and Lets Work actions on the case-studies page', () => {
    renderNavigation({ variant: 'case-studies', onOpenInquiry: jest.fn() });

    expect(screen.getByRole('button', { name: /go to home page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^lets work$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^services$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^case studies$/i })).not.toBeInTheDocument();
  });
});
