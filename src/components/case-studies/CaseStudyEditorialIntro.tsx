import type { ReactNode } from 'react';
import './CaseStudyEditorial.css';

type CaseStudyEditorialIntroProps = {
  id: string;
  title: string;
  label?: string;
  variant?: 'balanced' | 'headline-led' | 'stacked';
  level?: 2 | 3;
  children: ReactNode;
};

export default function CaseStudyEditorialIntro({
  id, title, label, variant = 'balanced', level = 2, children,
}: CaseStudyEditorialIntroProps) {
  const Heading = level === 3 ? 'h3' : 'h2';

  return (
    <header className={`case-study-editorial-intro case-study-editorial-layout case-study-editorial-layout--${variant}`}>
      <div>
        {label && <p className="case-study-editorial-label">{label}</p>}
        <Heading id={id} tabIndex={level === 2 ? -1 : undefined} className={level === 2 ? 'case-study-editorial-title' : 'case-study-editorial-subtitle'}>
          {title}
        </Heading>
      </div>
      <div className="case-study-editorial-copy">{children}</div>
    </header>
  );
}
