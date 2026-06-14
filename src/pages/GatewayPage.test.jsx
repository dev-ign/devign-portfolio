import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GatewayPage from './GatewayPage';

jest.mock('@/hooks/useGSAPContext', () => ({
  useGSAPContext: jest.fn(),
}), { virtual: true });

jest.mock('@/hooks/useLenis', () => ({
  useLenis: jest.fn(() => ({ current: null })),
}), { virtual: true });

jest.mock('@/utils/deviceDetect', () => ({
  isTouchDevice: jest.fn(() => false),
}), { virtual: true });

jest.mock('@/animations/gatewayAnimations', () => ({
  runGatewayEntrance: jest.fn(),
  initVideoScrub: jest.fn(() => () => undefined),
  initPosterScroll: jest.fn(() => () => undefined),
  initGatewayServicesTypography: jest.fn(() => () => undefined),
}), { virtual: true });

jest.mock('@/components/gateway/GatewayNav', () => () => <nav aria-label="Primary" />, { virtual: true });
jest.mock('@/components/work-with-me/Services', () => () => <section id="services" />, { virtual: true });
jest.mock('@/components/work-with-me/Process', () => () => <section id="process" />, { virtual: true });
jest.mock('@/components/work-with-me/ProjectsShowcase', () => () => <section id="projects" />, { virtual: true });
jest.mock('@/components/work-with-me/BusinessOutcomes', () => () => <section />, { virtual: true });
jest.mock('@/components/work-with-me/InquiryForm', () => ({ onOpenInquiry }) => (
  <section id="inquiry">
    <button type="button" onClick={onOpenInquiry}>Section inquiry</button>
  </section>
), { virtual: true });
jest.mock('@/components/work-with-me/FAQ', () => () => <section id="faq" />, { virtual: true });
jest.mock('@/components/work-with-me/InquiryModal', () => ({ open, onClose }) => (
  open ? (
    <div role="dialog" aria-label="Project inquiry">
      <button type="button" onClick={onClose}>Close inquiry form</button>
    </div>
  ) : null
), { virtual: true });

test('opens the inquiry modal from the hero Work With Us button', () => {
  render(<GatewayPage />);

  fireEvent.click(screen.getByRole('button', { name: /^work with us$/i }));

  expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();
});
