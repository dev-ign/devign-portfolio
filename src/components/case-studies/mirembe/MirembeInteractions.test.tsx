import { fireEvent, render, screen } from '@testing-library/react';
import MirembeCreativeShowcase from './MirembeCreativeShowcase';
import MirembeServiceJourney from './MirembeServiceJourney';

test('defers the reels and mounts one muted player at a time', () => {
  const pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  const play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  try {
    const { unmount } = render(<MirembeCreativeShowcase />);
    const holidayTitle = 'Holiday booking reel';
    const multilingualTitle = 'Multilingual launch reel';
    expect(screen.queryByTitle(holidayTitle)).not.toBeInTheDocument();
    expect(screen.queryByTitle(multilingualTitle)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: `Play ${holidayTitle}` }));
    expect(screen.getByTitle<HTMLVideoElement>(holidayTitle).muted).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: `Play ${multilingualTitle}` }));
    expect(screen.queryByTitle(holidayTitle)).not.toBeInTheDocument();
    expect(screen.getByTitle<HTMLVideoElement>(multilingualTitle).muted).toBe(true);
    expect(pause).toHaveBeenCalledTimes(1);
    unmount();
    expect(pause).toHaveBeenCalledTimes(2);
  } finally {
    play.mockRestore();
    pause.mockRestore();
  }
});

test('moves focus through service details and returns it after the booking preview', () => {
  const showModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
  const close = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true; } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false; } },
  });
  try {
    render(<MirembeServiceJourney />);
    const optionName = 'See what’s included in Standard Clean';
    fireEvent.click(screen.getByRole('button', { name: optionName }));
    expect(screen.getByRole('dialog', { name: 'Standard Clean' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Close service details' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Preview booking handoff' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Request a Cleaning' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Back to services' }));
    expect(screen.getByRole('button', { name: optionName })).toHaveFocus();
  } finally {
    if (showModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModal);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    if (close) Object.defineProperty(HTMLDialogElement.prototype, 'close', close);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  }
});
