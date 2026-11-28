import { render, screen, within } from '@testing-library/react';
import Services from './Services';

jest.mock('@/hooks/useGSAPContext', () => ({ useGSAPContext: jest.fn() }));
jest.mock('@/animations/workWithMeAnimations', () => ({
  runServicesIntroReveal: jest.fn(),
  runServicesStagger: jest.fn(),
}));

test('preserves all eight service titles and copy without exposing decorative controls', () => {
  render(<Services />);
  const section = screen.getByRole('region', { name: 'Services with Deliberate Craft' });
  const cards = within(section).getAllByRole('listitem');
  expect(within(section).getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual([
    'Landing Pages',
    'Business Websites',
    'Website Redesigns',
    'E-Commerce',
    'Web Apps',
    'Ongoing Support',
    'Video & Motion Design',
    'Graphic & Product Design',
  ]);
  expect(cards).toHaveLength(8);
  expect(cards[0]).toHaveTextContent('Focused pages that connect a clear offer to a clear next step.');
  expect(cards[7]).toHaveTextContent('Brand identity, UI/UX, and design systems from first sketch to pixel-perfect delivery.');
  expect(within(section).queryByRole('img')).not.toBeInTheDocument();
  expect(within(section).queryByRole('button')).not.toBeInTheDocument();
  expect(within(section).queryByRole('link')).not.toBeInTheDocument();
});
