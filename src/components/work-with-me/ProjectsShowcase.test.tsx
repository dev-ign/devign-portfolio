import { fireEvent, render, screen, within } from '@testing-library/react';
import ProjectsShowcase from './ProjectsShowcase';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }: React.ComponentProps<'a'> & { to: string }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });
jest.mock('@/hooks/useGSAPContext', () => ({ useGSAPContext: jest.fn() }));
jest.mock('@/animations/workWithMeAnimations', () => ({ runProjectsGridReveal: jest.fn() }));

const titles = [
  'Mirembe Cleaning', 'Template Manager', 'Donor Directory', 'URGE Talent',
  'Small Wrld Music', 'Givzey Landing', 'El Chancletazo', 'Gradum Group',
];

function renderProjects() {
  const align = jest.fn();
  render(<ProjectsShowcase navigationRef={{ current: null }} onAlignCategories={align} />);
  return {
    align,
    projects: screen.getByRole('region', { name: 'Built With Intention' }),
    categories: screen.getByRole('navigation', { name: 'Project type' }),
  };
}

test('shows the approved project order, meaningful destinations, and one real link per card', () => {
  const { projects, categories, align } = renderProjects();
  const cards = within(projects).getAllByRole('article');

  expect(within(projects).getByRole('heading', { level: 2 })).toHaveTextContent('Built With Intention');
  expect(within(projects).queryByText(/selected work shaped by real constraints/i)).not.toBeInTheDocument();
  expect(within(categories).getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
  expect(cards.map(card => within(card).getByRole('heading', { level: 3 }).textContent)).toEqual(titles);
  expect(within(projects).getAllByRole('button')).toHaveLength(3);
  expect(within(projects).getAllByRole('link')).toHaveLength(titles.length);
  expect(within(cards[0]).getByRole('link', { name: /Visit Mirembe Cleaning website/ })).toHaveAttribute('href', 'https://mirembecleaning.com');
  expect(within(cards[0]).getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  expect(within(cards[1]).getByRole('link', { name: 'View Template Manager case study' })).toHaveAttribute('href', '/case-studies/gravyty-template-manager');
  expect(within(cards[2]).getByRole('link', { name: 'View Donor Directory case study' })).toHaveAttribute('href', '/case-studies/donor-directory');
  expect(within(cards[3]).getByRole('link', { name: 'View URGE Talent project' })).toHaveAttribute('href', '/projects/urge-talent');
  expect(align).not.toHaveBeenCalled();
});

test('switches filters in place, keeps focus, and returns from the empty categories', () => {
  const { projects, categories } = renderProjects();
  for (const label of ['Design', 'Videos']) {
    const button = within(categories).getByRole('button', { name: label });
    fireEvent.click(button);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(within(projects).getByText('Coming Soon', { exact: true })).toBeVisible();
    expect(within(projects).getByRole('status')).toHaveTextContent(label + ': Coming Soon');
    expect(within(projects).queryByRole('article')).not.toBeInTheDocument();
  }

  fireEvent.click(within(categories).getByRole('button', { name: 'Code' }));
  expect(within(projects).getAllByRole('article')).toHaveLength(titles.length);
  expect(within(projects).getByRole('status')).toHaveTextContent('Code: 8 projects');
});
