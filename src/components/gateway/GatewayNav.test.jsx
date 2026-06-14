import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GatewayNav from './GatewayNav';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

jest.mock('@/components/BrandLogo', () => () => <span>devignUX</span>, { virtual: true });

describe('GatewayNav inquiry action', () => {
  test('opens the inquiry modal from the desktop Lets Work button', () => {
    const onScrollTo = jest.fn();
    const onOpenInquiry = jest.fn();

    render(<GatewayNav onScrollTo={onScrollTo} onOpenInquiry={onOpenInquiry} />);

    fireEvent.click(screen.getByRole('button', { name: /^lets work$/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
    expect(onScrollTo).not.toHaveBeenCalledWith('inquiry');
  });

  test('opens the inquiry modal from the mobile menu Lets Work button', () => {
    const onScrollTo = jest.fn();
    const onOpenInquiry = jest.fn();

    render(<GatewayNav onScrollTo={onScrollTo} onOpenInquiry={onOpenInquiry} />);

    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /^lets work →$/i }));

    expect(onOpenInquiry).toHaveBeenCalledTimes(1);
    expect(onScrollTo).not.toHaveBeenCalledWith('inquiry');
  });
});
