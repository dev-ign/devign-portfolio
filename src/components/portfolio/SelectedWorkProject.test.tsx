import { render, screen } from '@testing-library/react';
import { gsap } from 'gsap';
import SelectedWorkProject, { type SelectedWorkProjectData } from './SelectedWorkProject';

let mockReducedMotion = false;
jest.mock('@/hooks/useMediaQuery', () => ({ usePrefersReducedMotion: () => mockReducedMotion }));
jest.mock('@/components/showcase/TemplatesManagerDemo', () => () => null);
jest.mock('@iconify/react', () => ({ Icon: () => null }));
jest.mock('react-router-dom', () => ({ Link: 'a' }), { virtual: true });

const project: SelectedWorkProjectData = {
  id: 'mirembe-cleaning',
  sectionId: 'mirembe-cleaning',
  title: 'Mirembe Cleaning',
  category: 'Digital experience',
  summary: 'A multilingual customer experience.',
  image: '/desktop.webp',
  imageAlt: 'Mirembe Cleaning on desktop and phone',
  previewLayers: { desktopSmall: '/desktop-small.webp', phone: '/phone.webp' },
  highlights: [{ title: 'A phased launch', description: 'From waitlist to booking.' }],
  technologies: ['React'],
};

const createTimeline = gsap.timeline.bind(gsap);
let timeline: gsap.core.Timeline;
let play: jest.SpyInstance;
let notifyIntersection: IntersectionObserverCallback;
const observer = { observe: jest.fn(), disconnect: jest.fn() };
const originalObserver = window.IntersectionObserver;
const browserDefaults = document.createElement('style');

beforeAll(() => {
  // JSDOM omits the browser's computed initial opacity.
  browserDefaults.textContent = '.selected-work-chapter * { opacity: 1; visibility: visible; }';
  document.head.append(browserDefaults);
});

afterAll(() => browserDefaults.remove());

function intersect(intersectionRatio: number) {
  notifyIntersection([{ isIntersecting: intersectionRatio > 0, intersectionRatio } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
}

beforeEach(() => {
  mockReducedMotion = false;
  jest.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  window.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
    notifyIntersection = callback;
    return observer;
  }) as unknown as typeof IntersectionObserver;
  jest.spyOn(gsap, 'timeline').mockImplementation((settings) => {
    timeline = createTimeline(settings);
    play = jest.spyOn(timeline, 'play').mockImplementation(() => timeline);
    return timeline;
  });
});

afterEach(() => {
  window.IntersectionObserver = originalObserver;
  jest.restoreAllMocks();
});

test('prepares the initial styles and enters once when active and in view', () => {
  const { rerender } = render(<SelectedWorkProject project={project} />);
  gsap.ticker.tick();
  const [desktop, phone] = screen.getAllByAltText('');
  const title = screen.getByText(project.title, { selector: 'h2' });
  expect(desktop).toHaveStyle({ opacity: '0' });
  expect(phone).toHaveStyle({ opacity: '0' });
  expect(title).toHaveStyle({ visibility: 'hidden' });

  intersect(.11);
  rerender(<SelectedWorkProject project={project} isActive />);
  expect(play).not.toHaveBeenCalled();
  rerender(<SelectedWorkProject project={project} />);
  intersect(.8);
  expect(play).not.toHaveBeenCalled();
  rerender(<SelectedWorkProject project={project} isActive />);
  expect(play).toHaveBeenCalledTimes(1);

  timeline.time(.25);
  expect(Number(desktop.style.opacity)).toBeGreaterThan(0);
  expect(phone).toHaveStyle({ opacity: '0' });
  expect(title).toHaveStyle({ visibility: 'hidden' });
  const updatedProject = { ...project, summary: 'Updated summary.', previewLayers: { ...project.previewLayers! } };
  rerender(<SelectedWorkProject project={updatedProject} isActive />);
  expect(gsap.timeline).toHaveBeenCalledTimes(1);
  expect(play).toHaveBeenCalledTimes(1);

  rerender(<SelectedWorkProject project={updatedProject} />);
  expect(timeline.progress()).toBe(1);
  expect(title).toBeVisible();
  expect(desktop.style.opacity).toBe('');
  expect(phone.style.transform).toBe('');
  rerender(<SelectedWorkProject project={updatedProject} isActive />);
  expect(title).toBeVisible();
  expect(play).toHaveBeenCalledTimes(1);
});

test('defers entry while the document is hidden and starts when it becomes visible', () => {
  const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  render(<SelectedWorkProject project={project} isActive />);
  intersect(.8);
  expect(play).not.toHaveBeenCalled();

  hidden.mockReturnValue(false);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(play).toHaveBeenCalledTimes(1);
});

test('presents a stable reduced-motion view when entering and on preference changes', () => {
  const { rerender } = render(<SelectedWorkProject project={project} isActive />);
  intersect(.8);
  timeline.time(.25);

  mockReducedMotion = true;
  rerender(<SelectedWorkProject project={project} isActive />);
  expect(screen.getByRole('heading', { name: project.title })).toBeVisible();
  expect(screen.getAllByAltText('').map((image) => image.style.opacity)).toEqual(['', '']);

  mockReducedMotion = false;
  rerender(<SelectedWorkProject project={project} isActive />);
  expect(screen.getByRole('heading', { name: project.title })).toBeVisible();
  expect(gsap.timeline).toHaveBeenCalledTimes(1);
});

test('renders immediately when reduced motion is enabled before mount', () => {
  mockReducedMotion = true;
  render(<SelectedWorkProject project={project} isActive />);
  expect(screen.getByRole('heading', { name: project.title })).toBeVisible();
  expect(gsap.timeline).not.toHaveBeenCalled();
});
