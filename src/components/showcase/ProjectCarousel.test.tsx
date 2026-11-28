import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { projects, studioProjects } from '@/data/projects';
import ProjectCarousel from './ProjectCarousel';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }: React.ComponentProps<'a'> & { to: string }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });
jest.mock('./DonorDirectoryAnimation', () => () => null);
jest.mock('./TemplatesManagerDemo', () => ({ isActive }: { isActive: boolean }) => (
  <div aria-label="Template Manager workflow" data-active={String(isActive)} />
));
jest.mock('./TalentSearchWorkflowAnimation', () => () => null);
jest.mock('@/hooks/useMediaQuery', () => ({ usePrefersReducedMotion: () => true }));

const scrollTo = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTo');

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: jest.fn() });
});

afterAll(() => {
  if (scrollTo) Object.defineProperty(HTMLElement.prototype, 'scrollTo', scrollTo);
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
});

test('starts with Mirembe and keeps the existing Studio Code projects in order', () => {
  render(<ProjectCarousel projects={studioProjects} />);
  const cards = screen.getAllByRole('article');
  expect(cards.map((card) => card.getAttribute('aria-label'))).toEqual([
    'Mirembe Cleaning', ...projects.map(({ title }) => title),
  ]);
  expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('button', { name: /Go to project/ })).toHaveLength(cards.length);
  expect(screen.getByRole('button', { name: 'Go to project 1' })).toHaveAttribute('aria-current', 'true');

  const featured = within(screen.getByRole('article', { name: 'Mirembe Cleaning' }));
  expect(featured.getByRole('img', { name: /English mobile homepage/ })).toHaveAttribute('src', '/mirembe-case-study/mobile-en.webp');
  const link = featured.getByRole('link', { name: /Visit live website for Mirembe Cleaning/ });
  expect(link).toHaveAttribute('href', 'https://mirembecleaning.com');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(featured.getByRole('link', { name: 'View Mirembe Cleaning case study' })).toHaveAttribute('href', '/case-studies/mirembe-cleaning');
});

test('shows Coming Soon for the empty categories and resets Code to the first slide', () => {
  render(<ProjectCarousel projects={studioProjects} />);
  const scroller = screen.getByLabelText('code projects carousel');
  const secondCard = screen.getByRole('article', { name: 'Template Manager' });
  Object.defineProperty(secondCard, 'offsetLeft', { value: 100 });
  fireEvent.scroll(scroller, { target: { scrollLeft: 100 } });
  expect(screen.getByRole('button', { name: 'Go to project 2' })).toHaveAttribute('aria-current', 'true');

  for (const category of ['Design', 'Videos']) {
    const button = screen.getByRole('button', { name: category });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Coming Soon')).toBeVisible();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Go to project/ })).not.toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole('button', { name: 'Code' }));
  expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to project 1' })).toHaveAttribute('aria-current', 'true');
});

test('shows real projects when another category is populated', () => {
  const designProject = { ...projects[0], id: 'design-project', title: 'Design project', projectType: 'design' as const };
  render(<ProjectCarousel projects={[...studioProjects, designProject]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Design' }));
  expect(screen.getByRole('article', { name: designProject.title })).toBeVisible();
  expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
});

test('activates the Template Manager preview after scrolling without a scrollend event', () => {
  jest.useFakeTimers();
  try {
    render(<ProjectCarousel projects={studioProjects} />);
    const scroller = screen.getByLabelText('code projects carousel');
    const secondCard = screen.getByRole('article', { name: 'Template Manager' });
    const preview = within(secondCard).getByLabelText('Template Manager workflow');
    Object.defineProperty(secondCard, 'offsetLeft', { value: 100 });

    fireEvent.scroll(scroller, { target: { scrollLeft: 100 } });
    expect(screen.getByRole('button', { name: 'Go to project 2' })).toHaveAttribute('aria-current', 'true');
    expect(preview).toHaveAttribute('data-active', 'false');
    act(() => jest.runOnlyPendingTimers());
    expect(preview).toHaveAttribute('data-active', 'true');
  } finally {
    jest.useRealTimers();
  }
});
