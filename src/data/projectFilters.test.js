import { filterProjectsByType } from './projectFilters';

describe('project type filtering', () => {
  it('returns only projects that match the selected project type', () => {
    const baseProject = {
      id: 'base-project',
      title: 'Base Project',
      category: 'Case Study',
      projectType: 'code',
      description: 'A project',
      image: 'project.png',
      tags: [],
      roles: [],
      rolePillLabel: 'Code',
      impactLine: 'Impact',
      liveUrl: '',
      githubUrl: '',
      accentColor: '#7B8CDE',
      caseStudy: {
        heroBackground: 'project.png',
        footerImpact: 'Impact',
        sections: [],
      },
    };
    const mixedProjects = [
      { ...baseProject, id: 'code-project', projectType: 'code' },
      { ...baseProject, id: 'design-project', projectType: 'design' },
      { ...baseProject, id: 'video-project', projectType: 'videos' },
    ];

    expect(filterProjectsByType(mixedProjects, 'design')).toEqual([
      expect.objectContaining({ id: 'design-project' }),
    ]);
  });
});
