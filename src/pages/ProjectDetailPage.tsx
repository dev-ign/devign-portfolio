import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects } from '@/data/projects';
import CaseStudyContent from '@/components/panel/CaseStudyContent';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { trackEvent } from '@/utils/analytics';

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

  if (slug === 'gravyty-template-manager') {
    return <Navigate to="/case-studies/gravyty-template-manager" replace />;
  }

  if (slug === 'gravyty-donor-directory') {
    return <Navigate to="/case-studies/donor-directory" replace />;
  }

  if (!project) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-editorial flex flex-col items-center justify-center gap-5 font-body">
        <p className="text-[#1A1A1A] opacity-50 text-[15px]">Project not found.</p>
        <button onClick={() => navigate('/projects')} className={backBtnCn}>
          ← Back to projects
        </button>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-editorial">
      {/* Hero image */}
      <div className="relative overflow-hidden bg-gateway h-[52vh] min-h-[300px] max-h-[520px]">

        {/* Accent progress bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 z-30 opacity-70"
          style={{ backgroundColor: project.accentColor }}
        />

        {/* Ken Burns hero */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 transition-transform duration-[8000ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
          style={{
            backgroundImage: `url(${project.caseStudy.heroBackground})`,
            transform: imageZoomed ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 [background:linear-gradient(to_bottom,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.7)_100%)]" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          onClick={() => navigate('/projects')}
          className={backBtnCn}
        >
          ← Projects
        </motion.button>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute z-10"
          style={{
            bottom: 32,
            left: isMobile ? 20 : 36,
            right: isMobile ? 20 : 36,
          }}
        >
          <p className="font-mono text-[11px] text-white/50 m-0 mb-2 tracking-[0.1em] uppercase">
            {project.category}
          </p>
          <h1 className="text-[clamp(28px,4vw,44px)] font-bold text-white/94 tracking-[-0.02em] leading-[1.1]">
            {project.title}
          </h1>
          <p className="font-body text-[14px] text-white/55 mt-2.5 m-0 font-light leading-[1.6] max-w-[560px]">
            {project.description}
          </p>
        </motion.div>
      </div>

      {/* Case study body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="max-w-[720px] mx-auto"
        style={{ padding: isMobile ? '32px 20px 80px' : '48px 28px 140px' }}
      >
        {/* Impact line */}
        <p
          className="font-mono text-[12px] tracking-[0.08em] mb-8 font-normal"
          style={{ color: project.accentColor }}
        >
          {project.caseStudy.footerImpact}
        </p>

        <CaseStudyContent sections={project.caseStudy.sections} />

        {/* Footer links */}
        <div className="flex gap-3 mt-14 pt-8 border-t border-[var(--border)] flex-wrap">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center py-2.5 px-5 bg-transparent text-[rgba(26,26,26,0.55)] rounded-full font-body text-[13px] font-medium border border-[rgba(26,26,26,0.15)] cursor-pointer no-underline transition-[color,border-color] duration-200 hover:text-[#1A1A1A] hover:border-[rgba(26,26,26,0.35)]"
          >
            ← All projects
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} live site (opens in a new tab)`}
              onClick={() => trackEvent('outbound_click', {
                destination: 'project_site',
                project_id: project.id,
              })}
              className="inline-flex items-center py-2.5 px-5 bg-[#1A1A1A] text-editorial rounded-full font-body text-[13px] font-medium no-underline transition-opacity duration-200 hover:opacity-75"
            >
              Live site →
            </a>
          )}
        </div>
      </motion.div>
    </main>
  );
};

const backBtnCn = [
  'absolute top-6 left-6 inline-flex items-center',
  'py-[9px] px-[18px]',
  'bg-white/12 [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]',
  'text-white/82 rounded-full font-body text-[13px] font-medium',
  'border border-white/16 cursor-pointer no-underline',
  'transition-opacity duration-200 z-20',
].join(' ');

export default ProjectDetailPage;
