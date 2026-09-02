import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ServiceChapterSequence, { getChapterIndex, getChapterProgress } from './ServiceChapterSequence';

jest.mock('gsap', () => ({
  gsap: { set: jest.fn(), timeline: jest.fn() },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: jest.fn() },
}));

jest.mock('@/hooks/useGSAPContext', () => ({
  useGSAPContext: jest.fn(),
}));

jest.mock('@/hooks/useHomeNavigationState', () => ({
  useHomeNavigationState: () => ({
    mode: 'contextual',
    activeSection: 'services',
    contextTitle: 'Services',
    activeService: 'web-applications',
    progress: 0.34,
  }),
  useHomeNavigationController: () => ({ setServiceContext: jest.fn() }),
}));

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string }) => <span data-icon={icon} {...props} />,
}));

describe('ServiceChapterSequence', () => {
  test('maps normalized progress to all four chapters in both directions', () => {
    expect([0, 0.34, 0.67, 1].map(getChapterIndex)).toEqual([0, 1, 2, 3]);
    expect([1, 0.67, 0.34, 0].map(getChapterIndex)).toEqual([3, 2, 1, 0]);
    expect([0, 1, 2, 3].map(getChapterProgress)).toEqual([0, 1 / 3, 2 / 3, 1]);
  });

  test('renders real semantic chapter targets and exposes only the active CTA', () => {
    const onSelect = jest.fn();
    const { container } = render(<ServiceChapterSequence onSelect={onSelect} />);

    const markers = screen.getAllByTestId('service-chapter-marker');
    expect(markers).toHaveLength(4);
    expect(markers[0]).toHaveAttribute('id', 'service-websites');
    expect(markers[1]).toHaveAttribute('id', 'service-web-applications');
    expect(markers[2]).toHaveAttribute('id', 'service-branding-marketing');
    expect(markers[3]).toHaveAttribute('id', 'service-motion-video');

    const activeCta = screen.getByRole('button', { name: 'Explore Applications' });
    expect(activeCta).toHaveAttribute('tabindex', '0');
    fireEvent.click(activeCta);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'web-applications' }));

    expect(screen.getByRole('heading', { name: 'Web Applications' })).toBeInTheDocument();
    expect(screen.getByText('Build Your Product')).toBeInTheDocument();
    expect(screen.queryByText('Digital products and platforms designed around real workflows, users, and business goals.')).not.toBeInTheDocument();
    expect(container.querySelector('[data-service-reveal="eyebrow"]')).not.toBeInTheDocument();
  });
});
