import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, Project } from '@/data/projects';
import AmbientOrb from '@/components/showcase/AmbientOrb';
import ProjectCarousel from '@/components/showcase/ProjectCarousel';
import ControlBar from '@/components/story/ControlBar';
import { useIsMobile } from '@/hooks/useMediaQuery';

const ProjectsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  useEffect(() => {
    document.body.setAttribute('data-page', 'projects');
    return () => document.body.removeAttribute('data-page');
  }, []);

  return (
    <div className="min-h-screen bg-editorial relative overflow-hidden px-[clamp(22px,6vw,72px)] py-[clamp(24px,5vw,44px)]">
      <AmbientOrb color={activeProject.accentColor} />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between gap-5"
      >
        <Link
          to="/portfolio"
          className="font-disp text-[#333333] no-underline transition-opacity duration-200 hover:opacity-70"
          style={{ fontSize: isMobile ? 18 : 24, fontWeight: 400, letterSpacing: '0.03em' }}
        >
          devign
        </Link>
        <Link
          to="/portfolio"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/45 no-underline transition-colors duration-200 hover:text-[#1A1A1A]/75"
        >
          Back
        </Link>
      </motion.header>

      <main id="main-content" tabIndex={-1} className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-[1320px] flex-col justify-center pt-[clamp(54px,8vh,92px)] pb-[92px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="mx-auto mb-[clamp(36px,5vw,64px)] max-w-[760px] text-center"
        >
          <p className="m-0 mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#1A1A1A]/38">
            Selected work
          </p>
          <h1 className="m-0 text-[clamp(44px,7vw,92px)] leading-[0.95] tracking-[-0.05em] text-[#1A1A1A]">
            Projects
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
        >
          <ProjectCarousel
            projects={projects}
            theme="light"
            onActiveProjectChange={setActiveProject}
          />
        </motion.div>
      </main>

      <ControlBar show={true} />
    </div>
  );
};

export default ProjectsPage;
