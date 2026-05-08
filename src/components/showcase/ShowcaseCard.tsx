import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/data/projects';

interface ShowcaseCardProps {
  project: Project;
  interactive?: boolean;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ project, interactive = true }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={interactive ? () => navigate(`/projects/${project.id}`) : undefined}
      style={{
        width: '100%',
        aspectRatio: '4 / 3',
        backgroundColor: 'rgba(12, 12, 14, 0.95)',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow:
          '0 20px 60px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Project image */}
      <img
        src={project.image}
        alt={project.title}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: 0.88,
        }}
      />

      {/* Bottom gradient with info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '48px 28px 24px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.44)',
              margin: '0 0 5px',
              letterSpacing: '0.08em',
              fontWeight: 400,
              textTransform: 'uppercase',
            }}
          >
            {project.category}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 17,
              color: 'rgba(255,255,255,0.92)',
              margin: 0,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* View pill */}
        {interactive && (
          <div
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              View →
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseCard;
