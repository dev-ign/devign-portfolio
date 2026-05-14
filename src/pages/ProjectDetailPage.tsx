import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects } from '@/data/projects';
import CaseStudyContent from '@/components/panel/CaseStudyContent';
import { useIsMobile } from '@/hooks/useMediaQuery';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [imageZoomed, setImageZoomed] = useState(false);

  const project = projects.find((p) => p.id === slug);

  useEffect(() => {
    document.body.setAttribute('data-page', 'project-detail');
    return () => document.body.removeAttribute('data-page');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setImageZoomed(true), 80);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#E8E7E1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          fontFamily: 'var(--font-body)',
        }}
      >
        <p style={{ color: '#1A1A1A', opacity: 0.5, fontSize: 15 }}>Project not found.</p>
        <button
          onClick={() => navigate('/portfolio/projects')}
          style={backBtnStyle}
        >
          ← Back to projects
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8E7E1' }}>
      {/* Hero image */}
      <div
        style={{
          height: '52vh',
          minHeight: 300,
          maxHeight: 520,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0C0C0E',
        }}
      >
        {/* Scroll progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: project.accentColor,
            zIndex: 30,
            opacity: 0.7,
          }}
        />

        {/* Ken Burns hero */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${project.caseStudy.heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: imageZoomed ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 8s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: 0.65,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          onClick={() => navigate('/portfolio/projects')}
          style={backBtnStyle}
        >
          ← Projects
        </motion.button>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: isMobile ? 20 : 36,
            right: isMobile ? 20 : 36,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 8px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {project.category}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.94)',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.55)',
              margin: '10px 0 0',
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            {project.description}
          </p>
        </motion.div>
      </div>

      {/* Case study body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: isMobile ? '32px 20px 80px' : '48px 28px 140px',
        }}
      >
        {/* Impact line */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: project.accentColor,
            letterSpacing: '0.08em',
            marginBottom: 32,
            fontWeight: 400,
          }}
        >
          {project.caseStudy.footerImpact}
        </p>

        {/* Reuse existing CaseStudyContent renderer */}
        <CaseStudyContent sections={project.caseStudy.sections} />

        {/* Footer with back + live site links */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 56,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/portfolio/projects')}
            style={footerBtnStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#1A1A1A';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,26,0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(26,26,26,0.55)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,26,0.15)';
            }}
          >
            ← All projects
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                backgroundColor: '#1A1A1A',
                color: '#E8E7E1',
                borderRadius: 100,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Live site →
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const backBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 24,
  left: 24,
  display: 'inline-flex',
  alignItems: 'center',
  padding: '9px 18px',
  backgroundColor: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: 'rgba(255,255,255,0.82)',
  borderRadius: 100,
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.16)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'opacity 0.2s ease',
  zIndex: 20,
};

const footerBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'transparent',
  color: 'rgba(26,26,26,0.55)',
  borderRadius: 100,
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid rgba(26,26,26,0.15)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 0.2s ease, border-color 0.2s ease',
};

export default ProjectDetailPage;
