import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
  test('renders the hero-style inquiry copy and opens the modal stepper', () => {
    render(<InquiryForm />);

    expect(screen.getByRole('heading', { name: /let's start something\./i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /whether you're launching something new, refining an existing product, or reimagining your digital presence/i
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /work with us/i }));

    const dialog = screen.getByRole('dialog', { name: /project inquiry/i });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: /let's start with you\./i })).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/^name\s*\*?$/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('closes the inquiry modal from the close button and escape key', async () => {
    render(<InquiryForm />);

    fireEvent.click(screen.getByRole('button', { name: /work with us/i }));
    const dialog = screen.getByRole('dialog', { name: /project inquiry/i });
    expect(dialog).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /close inquiry form/i }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /project inquiry/i })).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /work with us/i }));
    expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /project inquiry/i })).not.toBeInTheDocument());
  });
});
