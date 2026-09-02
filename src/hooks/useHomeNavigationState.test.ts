import { deriveHomeNavigationState } from './useHomeNavigationState';

describe('deriveHomeNavigationState', () => {
  test('uses contextual mode for Services and Projects', () => {
    expect(deriveHomeNavigationState('services', 0.2, 'websites')).toEqual({
      mode: 'contextual',
      activeSection: 'services',
      contextTitle: 'Services',
      activeService: 'websites',
      progress: 0.2,
    });
    expect(deriveHomeNavigationState('projects', 0.7)).toEqual({
      mode: 'contextual',
      activeSection: 'projects',
      contextTitle: 'Projects',
      progress: 0.7,
    });
  });

  test('returns to general mode for Process and clamps contextual progress', () => {
    expect(deriveHomeNavigationState('services', 2).progress).toBe(1);
    expect(deriveHomeNavigationState('process', 0.8)).toEqual({
      mode: 'general',
      activeSection: 'process',
      progress: 0,
    });
  });
});
