import type { ProjectType } from './projects';

export const projectTypeTabs: Array<{ type: ProjectType; label: string }> = [
  { type: 'code', label: 'Code' },
  { type: 'design', label: 'Design' },
  { type: 'videos', label: 'Videos' },
];

export const filterProjectsByType = <T extends { projectType: ProjectType }>(projectList: T[], type: ProjectType) =>
  projectList.filter((project) => project.projectType === type);
