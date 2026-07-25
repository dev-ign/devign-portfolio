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
  initPosterParallax: jest.fn(() => () => undefined),
}), { virtual: true });

jest.mock('@/animations/workWithMeAnimations', () => ({
  initScrollEnterExit: jest.fn(() => () => undefined),
}), { virtual: true });

describe('InquiryForm section modal experience', () => {
  test('renders the hero-style inquiry copy and calls the modal opener from the section CTA', () => {
    const onOpenInquiry = jest.fn();

    render(<InquiryForm onOpenInquiry={onOpenInquiry} />);

    expect(screen.getByRole('heading', { name: /let's start something\./i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /bring us the challenge, the ambition, or the idea that's still taking shape/i
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText('')).toHaveAttribute('src', '/inquiry-bg-poster.jpg');

    fireEvent.click(screen.getByRole('button', { name: /work with us/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
  });
});
