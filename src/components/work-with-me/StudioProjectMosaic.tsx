import React from 'react';
import { Link } from 'react-router-dom';
import type { StudioProject } from '@/data/projects';
import donorWorkspace from '@/assets/case-studies/donor-directory/donor-directory-row-drawer-open.webp';
import templateWorkspace from '@/assets/studio-projects/template-workspace.webp';
import talentDashboard from '@/assets/studio-projects/urge-dashboard.webp';
import givzeyHome from '@/assets/studio-projects/givzey-home.webp';
import { trackEvent } from '@/utils/analytics';

const studioMedia: Record<string, { src: string; alt: string }> = {
  'gravyty-template-manager': {
    src: templateWorkspace,
    alt: 'Template library and email editor showing a shared thank-you template and its assigned fundraisers.',
  },
  'gravyty-donor-directory': {
    src: donorWorkspace,
    alt: 'Donor records, filters, and a profile drawer with a giving history chart in the illustrative directory.',
  },
  'urge-talent': {
    src: talentDashboard,
    alt: 'Talent discovery dashboard with casting profiles, search filters, and a selected profile.',
  },
  'givzey-landing': {
    src: givzeyHome,
    alt: 'Givzey’s Virtual Engagement Officer landing page with its colorful illustration and demo action.',
  },
};

function ProjectMedia({ project, featured }: { project: StudioProject; featured: boolean }) {
  const loading = featured ? 'eager' : 'lazy';
  const { showcase } = project;
  if (showcase) {
    const { desktop, mobile } = showcase;
    return (
      <div className="studio-projects-media studio-projects-devices">
        <img
          className="studio-projects-desktop"
          src={desktop.src}
          srcSet={desktop.mobile ? `${desktop.mobile} 760w, ${desktop.src} ${desktop.width}w` : undefined}
          sizes="(min-width: 1460px) 760px, (min-width: 1100px) 49vw, (min-width: 700px) 72vw, 86vw"
          alt={desktop.alt}
          width={desktop.width}
          height={desktop.height}
          loading={loading}
          decoding="async"
        />
        <img
          className="studio-projects-phone"
          src={mobile.src}
          alt={mobile.alt}
          width={mobile.width}
          height={mobile.height}
          loading={loading}
          decoding="async"
        />
      </div>
    );
  }

  const media = studioMedia[project.id];
  return (
    <div className="studio-projects-media">
      <img
        src={media?.src ?? project.image}
        alt={media?.alt ?? `${project.title} project interface`}
        loading={loading}
        decoding="async"
      />
    </div>
  );
}

function ProjectDestination({ project }: { project: StudioProject }) {
  const { destination, id, title } = project;
  const arrow = (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (destination.kind === 'website') {
    return (
      <a className="studio-projects-arrow" href={destination.href} target="_blank" rel="noopener noreferrer"
        aria-label={`Visit ${title} website (opens in a new tab)`}>
        {arrow}
      </a>
    );
  }

  const caseStudy = destination.kind === 'case-study';
  return (
    <Link
      to={destination.href}
      className="studio-projects-arrow"
      aria-label={`View ${title} ${caseStudy ? 'case study' : 'project'}`}
      onClick={() => trackEvent(caseStudy ? 'case_study_view' : 'project_view', { project_id: id })}
    >
      {arrow}
    </Link>
  );
}

export default function StudioProjectMosaic({ projects }: { projects: readonly StudioProject[] }) {
  return (
    <div className="studio-projects-mosaic">
      {projects.map((project, index) => (
        <article
          key={project.id}
          className="studio-projects-card"
          data-project-id={project.id}
          data-project-layout={project.layout ?? 'standard'}
          aria-labelledby={`studio-project-${project.id}`}
        >
          <div className="studio-projects-card-frame">
            <ProjectMedia project={project} featured={index === 0} />
            <div className="studio-projects-label">
              <h3 id={`studio-project-${project.id}`}>{project.title}</h3>
              <ProjectDestination project={project} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
