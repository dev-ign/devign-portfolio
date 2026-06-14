import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryForm from './InquiryForm';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

jest.mock('@/hooks/useGSAPContext', () => ({
  useGSAPContext: jest.fn(),
}), { virtual: true });

jest.mock('@/animations/gatewayAnimations', () => ({
  initVideoScrub: jest.fn(() => () => undefined),
  initPosterScroll: jest.fn(() => () => undefined),
  runGatewayEntrance: jest.fn(),
}), { virtual: true });

jest.mock('@/animations/workWithMeAnimations', () => ({
  initScrollEnterExit: jest.fn(() => () => undefined),
}), { virtual: true });

jest.mock('@/utils/deviceDetect', () => ({
  isTouchDevice: jest.fn(() => false),
}), { virtual: true });

describe('InquiryForm section modal experience', () => {
  test('renders the hero-style inquiry copy and calls the modal opener from the section CTA', () => {
    const onOpenInquiry = jest.fn();

    render(<InquiryForm onOpenInquiry={onOpenInquiry} />);

    expect(screen.getByRole('heading', { name: /let's start something\./i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /whether you're launching something new, refining an existing product, or reimagining your digital presence/i
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /work with us/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
  });
});
