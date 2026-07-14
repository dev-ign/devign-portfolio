import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/data/projects';

interface FeaturedCaseStudyCardProps {
  project: Project;
  backgroundGradient: string;
  children: React.ReactNode;
}

const FeaturedCaseStudyCard: React.FC<FeaturedCaseStudyCardProps> = ({
  project,
  backgroundGradient,
  children,
}) => (
  <article className="h-full w-full">
    <Link
      to={`/projects/${project.id}`}
      aria-label={`View ${project.title} case study`}
      className="group relative isolate flex h-full w-full flex-col overflow-hidden rounded-[clamp(20px,2vw,28px)] border border-white/10 text-white no-underline shadow-[0_30px_72px_rgba(4,5,16,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: backgroundGradient }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[66%] [background:linear-gradient(to_bottom,transparent_0%,rgba(8,7,18,0.34)_30%,rgba(8,7,18,0.9)_100%)]"
      />

      <div className="relative z-10 px-[clamp(12px,1.5vw,20px)] pt-[clamp(12px,1.5vw,20px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] bottom-[-5%] h-1/2 rounded-full bg-[#17182d]/45 blur-[42px]"
        />
        <div className="relative overflow-hidden rounded-[clamp(10px,1.3vw,16px)] border border-white/12 bg-[#0f0f1a] shadow-[0_26px_58px_rgba(11,12,35,0.42),0_8px_22px_rgba(11,12,35,0.26)] transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
          {children}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-6 px-[clamp(20px,2.4vw,30px)] pb-[clamp(22px,2.6vw,32px)] pt-[clamp(24px,2.8vw,34px)]">
        <div>
          <p className="m-0 mb-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-white/58 sm:text-[10px]">
            {project.category}
          </p>
          <h2 className="m-0 text-[clamp(24px,2.25vw,34px)] leading-[1.05] tracking-[-0.035em] text-white">
            {project.title}
          </h2>
          <p className="m-0 mt-4 font-body text-[clamp(13px,1.08vw,15px)] font-light leading-[1.68] text-white/72">
            {project.description}
          </p>
        </div>

        <span className="mt-auto inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-white/82 backdrop-blur-md transition-[background-color,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-white/30 group-hover:bg-white/16 group-focus-visible:-translate-y-0.5 group-focus-visible:border-white/30 group-focus-visible:bg-white/16">
          View case study
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  </article>
);

export default FeaturedCaseStudyCard;
