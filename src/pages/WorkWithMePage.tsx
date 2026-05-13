import React, { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Hero from '@/components/work-with-me/Hero';
import Services from '@/components/work-with-me/Services';

const WorkWithMePage: React.FC = () => {
  useLenis();

  useEffect(() => {
    document.body.setAttribute('data-page', 'work-with-me');
    return () => document.body.removeAttribute('data-page');
  }, []);

  return (
    <div style={{ background: '#E8E7E1', minHeight: '100dvh' }}>
      <Hero />
      <Services />
      {/* WhyWorkWithMe, Process, ProjectStartingPoints, BusinessOutcomes, InquiryForm, FAQ — Phase 4 + 5 */}
    </div>
  );
};

export default WorkWithMePage;
