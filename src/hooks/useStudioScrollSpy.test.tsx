import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { selectStudioSection, useStudioScrollSpy } from './useStudioScrollSpy';

test('uses the reading line and clears the active section between tracked sections', () => {
  const sections = [
    { id: 'services', top: 110, bottom: 220 },
    { id: 'process', top: 220, bottom: 900 },
    { id: 'faq', top: 1450, bottom: 1495 },
  ] as const;

  expect(selectStudioSection(sections, 90)).toBeNull();
  expect(selectStudioSection(sections, 130)).toBe('services');
  expect(selectStudioSection(sections, 220)).toBe('process');
  expect(selectStudioSection(sections, 1120)).toBeNull();
  expect(selectStudioSection(sections, 1480)).toBe('faq');
  expect(selectStudioSection(sections, 1495)).toBeNull();
});

test('gives the clicked anchor precedence, then recovers on interruption or timeout', () => {
  jest.useFakeTimers();
  try {
    render(
      <main id="main-content">
        <section id="services" data-testid="services" style={{ visibility: 'hidden' }} />
        <section id="projects" aria-label="Projects" />
      </main>,
    );
    let scrollOffset = 0;
    const bounds = (top: number, bottom: number) =>
      ({ top: top - scrollOffset, bottom: bottom - scrollOffset } as DOMRect);
    const services = screen.getByTestId('services');
    jest.spyOn(services, 'getBoundingClientRect').mockImplementation(() => bounds(0, 600));
    jest.spyOn(screen.getByRole('region', { name: 'Projects' }), 'getBoundingClientRect').mockImplementation(() => bounds(700, 1350));

    const header = { current: null };
    const { result, unmount } = renderHook(() => useStudioScrollSpy(header));
    act(() => jest.advanceTimersByTime(20));
    expect(result.current.activeSection).toBeNull();
    services.style.visibility = 'visible';
    fireEvent.resize(window);
    act(() => jest.advanceTimersByTime(20));
    expect(result.current.activeSection).toBe('services');

    act(() => result.current.noteNavigation('projects'));
    act(() => jest.advanceTimersByTime(20));
    expect(result.current.activeSection).toBe('projects');
    fireEvent.wheel(window, { deltaY: -100 });
    act(() => jest.advanceTimersByTime(20));
    expect(result.current.activeSection).toBe('services');

    act(() => result.current.noteNavigation('projects'));
    act(() => jest.advanceTimersByTime(1850));
    expect(result.current.activeSection).toBe('services');

    scrollOffset = 650;
    fireEvent.scroll(window);
    act(() => jest.advanceTimersByTime(20));
    expect(result.current.activeSection).toBe('projects');
    unmount();
  } finally {
    jest.useRealTimers();
    jest.restoreAllMocks();
  }
});
