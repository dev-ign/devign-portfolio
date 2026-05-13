import React, { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Hero from '@/components/work-with-me/Hero';
import Services from '@/components/work-with-me/Services';
import WhyWorkWithMe from '@/components/work-with-me/WhyWorkWithMe';
import Process from '@/components/work-with-me/Process';
import ProjectStartingPoints from '@/components/work-with-me/ProjectStartingPoints';
import BusinessOutcomes from '@/components/work-with-me/BusinessOutcomes';
import InquiryForm from '@/components/work-with-me/InquiryForm';
import FAQ from '@/components/work-with-me/FAQ';

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
      <WhyWorkWithMe />
      <Process />
      <ProjectStartingPoints />
      <BusinessOutcomes />
      <InquiryForm />
      <FAQ />
    </div>
  );
};

export default WorkWithMePage;
