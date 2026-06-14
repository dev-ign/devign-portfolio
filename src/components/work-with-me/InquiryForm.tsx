import React, { useRef, useState } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';
import InquiryStepperForm from './InquiryStepperForm';

const InquiryForm: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useGSAPContext(
    () => {
      if (!sectionRef.current) return;
      const targets = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>('.inquiry-reveal')
      );
      initScrollEnterExit(targets, {
        trigger: sectionRef.current,
        stagger: 0.1,
        start: 'top 64%',
        end: 'bottom top',
        duration: 1.24,
        y: 46,
        exitWhen: 'bottom',
      });
    },
    { scope: sectionRef, dependencies: [submitted] }
  );

  return (
    <section
      id="inquiry"
      ref={sectionRef}
      className="py-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway"
    >
      <div className="inquiry-reveal mb-14 max-w-[560px]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
          Start a Project
        </div>
        <h2 className="text-[clamp(30px,5vw,52px)] text-white/88 tracking-[-0.03em] leading-[1.1] m-0 mb-3.5">
          Let's start something.
        </h2>
        <p className="font-body font-light text-[15px] text-white/45 leading-[1.7] m-0">
          Tell me about your project and I'll reach out with next steps.
        </p>
      </div>
      <div className="inquiry-reveal max-w-[560px]">
        <InquiryStepperForm onSubmitted={() => setSubmitted(true)} />
      </div>
    </section>
  );
};

export default InquiryForm;
