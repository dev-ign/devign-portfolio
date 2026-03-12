import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Project } from '@/data/projects';
import RoleChipRow from '@/components/projects/RoleChipRow';

interface ProjectCardProps {
  project: Project;
  onCaseStudyOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCaseStudyOpen }) => {
  return (
    <Card
      elevation={0}
      className="project-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out',
        boxShadow: 'none',
        '--Paper-shadow': 'none',
        '--Paper-overlay': 'none',
        '&::before': { display: 'none' },
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-4px)',
            '& .image-overlay': {
              opacity: 1,
              pointerEvents: 'auto',
            },
            '& .project-image': {
              transform: 'scale(1.05)',
            },
          },
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        onClick={onCaseStudyOpen}
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '20px',
          cursor: 'pointer',
        }}
      >
        <CardMedia
          component="img"
          image={project.image}
          alt={project.title}
          className="project-image"
          sx={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: { xs: '12px', md: '20px' },
            transition: 'transform 0.3s ease-in-out',
          }}
        />

        {/* Role pill badge — top-left */}
        <Box
          sx={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(12, 12, 14, 0.6)',
            border: '1px solid var(--border)',
            borderRadius: '100px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            color: 'var(--off-white)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {project.rolePillLabel}
        </Box>

        {/* Hover overlay — two action buttons */}
        <Box
          className="image-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(12, 12, 14, 0.75)',
            borderRadius: { xs: '12px', md: '20px' },
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            zIndex: 2,
          }}
        >
          <Button
            onClick={(e) => { e.stopPropagation(); onCaseStudyOpen(); }}
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              px: '20px',
              py: '9px',
              borderRadius: '100px',
              backgroundColor: 'var(--accent-active)',
              color: '#0f0f0f',
              fontWeight: 500,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'var(--accent-active)',
                opacity: 0.88,
                boxShadow: 'none',
              },
            }}
          >
            Open Case Study
          </Button>
          {project.liveUrl && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                px: '20px',
                py: '9px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Live Site →
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: '1.1rem', md: '1.5rem' },
          }}
        >
          {project.title}
        </Typography>
        {project.category && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 1,
              textTransform: 'uppercase',
              fontSize: { xs: '0.65rem', md: '0.75rem' },
              letterSpacing: '1px',
            }}
          >
            {project.category}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            opacity: 0.8,
            fontSize: { xs: '0.875rem', md: '0.875rem' },
            mb: 2,
          }}
        >
          {project.description}
        </Typography>

        <RoleChipRow roles={project.roles} />
      </CardContent>

      {/* Card footer — impact line + links */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 2,
          pt: 1.5,
          pb: 2,
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent-active)',
            letterSpacing: '0.03em',
            transition: 'color 0.4s ease',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {project.impactLine}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {project.liveUrl && (
            <Typography
              component="a"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': { color: 'var(--accent-active)' },
              }}
            >
              Live Site →
            </Typography>
          )}
          <Typography
            component="button"
            onClick={onCaseStudyOpen}
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--accent-active)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'color 0.2s ease, opacity 0.2s ease',
              opacity: 0.8,
              '&:hover': { opacity: 1 },
            }}
          >
            Case study ↕
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProjectCard;
