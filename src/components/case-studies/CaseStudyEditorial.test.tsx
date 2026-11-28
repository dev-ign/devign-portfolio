import { render, screen, within } from '@testing-library/react';
import CaseStudyEditorialIntro from './CaseStudyEditorialIntro';
import CaseStudyProjectDetails from './CaseStudyProjectDetails';

test.each(['balanced', 'headline-led', 'stacked'] as const)('keeps the heading and narrative in source order for %s layouts', (variant) => {
  render(
    <section aria-labelledby="test-heading">
      <CaseStudyEditorialIntro id="test-heading" title="An editorial heading" variant={variant}>
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </CaseStudyEditorialIntro>
    </section>
  );
  const section = screen.getByRole('region', { name: 'An editorial heading' });
  expect(within(section).getByRole('heading', { level: 2 })).toHaveAttribute('tabindex', '-1');
  expect(section).toHaveTextContent('An editorial headingFirst paragraph.Second paragraph.');
});

test('supports purposeful context and subsection headings', () => {
  render(
    <CaseStudyEditorialIntro id="test-heading" title="An editorial subsection" level={3} label="Project context">
      <p>Supporting text.</p>
    </CaseStudyEditorialIntro>
  );
  expect(screen.getByRole('heading', { level: 3 })).not.toHaveAttribute('tabindex');
  expect(screen.getByText('Project context')).toBeVisible();
});

test('keeps description terms and values paired while omitting empty fields', () => {
  const value = 'Long unbroken value ' + 'DesignEngineeringAndImplementation'.repeat(8);
  render(<CaseStudyProjectDetails items={[
    { label: 'Role', value: 'Designer' },
    { label: 'Scope', value },
    { label: 'Status' },
    { label: 'Industry', value: null },
    { label: 'Timeline', value: '   ' },
  ]} />);
  const details = screen.getByLabelText('Project details');
  expect(details.tagName).toBe('DL');
  expect(within(details).getAllByRole('term').map((term) => term.textContent)).toEqual(['Role', 'Scope']);
  expect(within(details).getAllByRole('definition').map((definition) => definition.textContent)).toEqual(['Designer', value]);
  expect(details).toHaveTextContent(`RoleDesignerScope${value}`);
});

test('omits an empty project details card', () => {
  render(<CaseStudyProjectDetails items={[]} />);
  expect(screen.queryByLabelText('Project details')).not.toBeInTheDocument();
});
