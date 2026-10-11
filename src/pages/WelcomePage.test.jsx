import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomePage from './WelcomePage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => mockNavigate,
}), { virtual: true });
jest.mock('@/hooks/useGSAPContext', () => ({ useGSAPContext: jest.fn() }));

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  window.scrollTo = jest.fn();
  mockNavigate.mockReset();
});

test('offers two equally direct destination links with the approved content', () => {
  render(<WelcomePage />);

  expect(screen.getByRole('heading', { name: 'What brings you here?' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Studio Websites, digital products/i })).toHaveAttribute('href', '/studio');
  expect(screen.getByRole('link', { name: /Portfolio Product design, UX engineering/i })).toHaveAttribute('href', '/portfolio');
  expect(screen.getAllByRole('link')).toHaveLength(2);
});

test('sends an old Studio root hash to the corresponding Studio section', () => {
  window.history.replaceState(null, '', '/#services');
  render(<WelcomePage />);

  expect(mockNavigate).toHaveBeenCalledWith('/studio#services', { replace: true });
});
