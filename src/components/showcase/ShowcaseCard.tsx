import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/data/projects';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ShowcaseCardProps {
  project: Project;
  interactive?: boolean;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ project, interactive = true }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div
      onClick={interactive ? () => navigate(`/projects/${project.id}`) : undefined}
      className="w-full aspect-[4/3] bg-[rgba(12,12,14,0.95)] rounded-[28px] overflow-hidden relative select-none [box-shadow:0_20px_60px_rgba(0,0,0,0.16),0_8px_24px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Project image */}
      <img
        src={project.image}
        alt={project.title}
        draggable={false}
        className="w-full h-full object-cover block opacity-88"
      />

      {/* Bottom gradient with info */}
      <div
        className="absolute bottom-0 left-0 right-0 [background:linear-gradient(to_top,rgba(0,0,0,0.82)_0%,transparent_100%)] flex items-end justify-between gap-3"
        style={{ padding: isMobile ? '28px 18px 16px' : '48px 28px 24px' }}
      >
        <div>
          <p
            className="font-mono text-white/44 m-0 mb-1 tracking-[0.08em] font-normal uppercase"
            style={{ fontSize: isMobile ? 10 : 11 }}
          >
            {project.category}
          </p>
          <h3
            className="text-white/92 tracking-[-0.01em] font-bold m-0"
            style={{ fontSize: isMobile ? 15 : 17 }}
          >
            {project.title}
          </h3>
        </div>

        {/* View pill */}
        {interactive && (
          <div className="shrink-0 py-2 px-4 bg-white/10 [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)] rounded-full border border-white/14">
            <span className="font-body text-[12px] text-white/75 font-medium whitespace-nowrap">
              View →
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseCard;
