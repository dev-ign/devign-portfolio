import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { initScrollEnterExit } from '@/animations/workWithMeAnimations';
import {
  INQUIRY_ACCEPTED_EXTENSIONS,
  INQUIRY_ACCEPTED_FILE_TYPES,
  INQUIRY_FILE_LIMITS,
  formatFileSize,
  validateContactStep,
  validateInquiryFiles,
  type ContactErrors,
  type InquiryFormData,
  type ProjectTypeId,
} from './inquiryFormEmail';
import { submitInquiry } from './inquiryFormSubmission';

type Budget = 'Under $2k' | '$2k–$5k' | '$5k–$10k' | '$10k+' | 'Not sure yet';
type Timeline = 'ASAP' | '2–4 Weeks' | '1–2 Months' | 'Flexible';

const PROJECT_TYPES: Array<{
  id: ProjectTypeId;
  name: string;
  desc: string;
  icon: string;
}> = [
  { id: 'product', name: 'Product design', desc: 'End-to-end UX/UI for a product surface', icon: 'solar:figma-bold-duotone' },
  { id: 'system', name: 'Design system', desc: 'Components, tokens & documentation', icon: 'solar:layers-minimalistic-bold-duotone' },
  { id: 'marketing', name: 'Marketing website', desc: 'Landing pages & brand sites that convert', icon: 'solar:planet-bold-duotone' },
  { id: 'app', name: 'App / dashboard', desc: 'Built & coded — front-end engineering', icon: 'solar:code-square-bold-duotone' },
  { id: 'graphic', name: 'Graphic design', desc: 'Identity, print & visual assets', icon: 'solar:palette-bold-duotone' },
  { id: 'video', name: 'Video', desc: 'Motion, editing & visual storytelling', icon: 'solar:videocamera-record-bold-duotone' },
];
const BUDGETS: Budget[] = ['Under $2k', '$2k–$5k', '$5k–$10k', '$10k+', 'Not sure yet'];
const TIMELINES: Timeline[] = ['ASAP', '2–4 Weeks', '1–2 Months', 'Flexible'];

const TOTAL_STEPS = 6;
const RESOURCE_ACCEPT = [
  ...INQUIRY_ACCEPTED_FILE_TYPES,
  ...INQUIRY_ACCEPTED_EXTENSIONS,
].join(',');

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const inputCn = 'w-full bg-white/5 border border-white/10 rounded-[10px] py-[13px] px-4 font-body text-[14px] text-white/88 outline-none box-border';
const labelCn = 'font-mono text-[10px] tracking-[0.1em] uppercase text-white/38 block mb-2';
const errorCn = 'mt-2 font-body text-[12px] text-[#FF8A8A]';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const InquiryForm: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [projectTypesTouched, setProjectTypesTouched] = useState(false);
  const [budgetTouched, setBudgetTouched] = useState(false);
  const [timelineTouched, setTimelineTouched] = useState(false);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '', email: '', businessName: '', website: '',
    projectTypes: [], budget: '', timeline: '', details: '',
  });

  const set = (field: keyof InquiryFormData) => (val: string) => {
    setSubmitError('');
    setFormData(prev => ({ ...prev, [field]: val }));
    if (field === 'budget') setBudgetTouched(true);
    if (field === 'timeline') setTimelineTouched(true);
    if (field === 'name' || field === 'email' || field === 'website') {
      setContactErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleProjectType = (id: ProjectTypeId) => {
    setProjectTypesTouched(true);
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(id)
        ? prev.projectTypes.filter(type => type !== id)
        : [...prev.projectTypes, id],
    }));
  };

  const addResourceFiles = (files: FileList | null) => {
    if (!files?.length) return;

    setResourceFiles(prev => {
      const next = [...prev];

      Array.from(files).forEach(file => {
        const exists = next.some(existing =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
        );
        if (!exists) next.push(file);
      });

      const validationErrors = validateInquiryFiles(next);
      if (validationErrors.length) {
        setFileError(validationErrors[0]);
        return prev;
      }

      setFileError('');
      setSubmitError('');
      return next;
    });
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      const validationErrors = validateInquiryFiles(next);
      setFileError(validationErrors[0] || '');
      return next;
    });
  };

  const goNext = () => {
    if (!canAdvance()) {
      if (step === 1) setContactErrors(validateContactStep(formData));
      if (step === 2) setProjectTypesTouched(true);
      if (step === 3) setBudgetTouched(true);
      if (step === 4) setTimelineTouched(true);
      return;
    }
    setDir(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canAdvance = () => {
    if (step === 1) return Object.keys(validateContactStep(formData)).length === 0;
    if (step === 2) return formData.projectTypes.length > 0;
    if (step === 3) return formData.budget !== '';
    if (step === 4) return formData.timeline !== '';
    return true;
  };

  const handleSubmit = async () => {
    setSubmitError('');
    const nextContactErrors = validateContactStep(formData);
    if (Object.keys(nextContactErrors).length > 0) {
      setContactErrors(nextContactErrors);
      setDir(-1);
      setStep(1);
      return;
    }
    if (formData.projectTypes.length === 0) {
      setProjectTypesTouched(true);
      setDir(-1);
      setStep(2);
      return;
    }
    if (!formData.budget) {
      setBudgetTouched(true);
      setDir(-1);
      setStep(3);
      return;
    }
    if (!formData.timeline) {
      setTimelineTouched(true);
      setDir(-1);
      setStep(4);
      return;
    }
    const fileValidationErrors = validateInquiryFiles(resourceFiles);
    if (fileValidationErrors.length) {
      setFileError(fileValidationErrors[0]);
      setStep(6);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitInquiry(formData, resourceFiles);
      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('InquiryForm submit error:', err);
      setSubmitError('Your inquiry could not be sent right now. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const PillButton = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`font-body text-[14px] py-3 px-5 rounded-full cursor-pointer transition-all duration-200 ${
        selected
          ? 'font-medium border-[1.5px] border-white/70 bg-white/8 text-white/88'
          : 'font-light border border-white/12 bg-transparent text-white/60'
      }`}
    >
      {label}
    </button>
  );

  const TypeCard = ({
    type,
    selected,
    onToggle,
  }: {
    type: (typeof PROJECT_TYPES)[number];
    selected: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`relative min-h-[118px] text-left rounded-[8px] border p-4 transition-[border-color,background,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${
        selected
          ? 'border-[#A86CFF]/80 bg-[#8F4DFF]/13 shadow-[0_18px_44px_rgba(143,77,255,0.16)]'
          : 'border-white/10 bg-white/3.5 hover:border-white/20'
      }`}
    >
      <span
        className={`mb-3 grid h-9 w-9 place-items-center rounded-[8px] border ${
          selected
            ? 'border-[#C99DFF]/40 bg-[#A75CFF] text-white shadow-[0_10px_28px_rgba(167,92,255,0.28)]'
            : 'border-white/10 bg-white/5.5 text-white/58'
        }`}
      >
        <Icon icon={type.icon} className="h-[18px] w-[18px]" />
      </span>
      {selected && (
        <span className="absolute right-3.5 top-3.5 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#B779FF] text-white">
          <Icon icon="solar:check-circle-bold" className="h-[12px] w-[12px]" />
        </span>
      )}
      <span className="block font-disp text-[15px] font-bold leading-tight tracking-[-0.015em] text-white/90">
        {type.name}
      </span>
      <span className="mt-2 block font-body text-[12px] font-light leading-[1.45] text-white/45">
        {type.desc}
      </span>
    </button>
  );

  const stepH3Cn = 'font-disp font-bold text-[clamp(20px,2.5vw,26px)] text-white/88 tracking-[-0.02em] m-0';

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <h3 className={`${stepH3Cn} mb-2`}>Let's start with you.</h3>
            <div>
              <label className={labelCn}>Name *</label>
              <input
                className={inputCn}
                value={formData.name}
                onBlur={() => setContactErrors(validateContactStep(formData))}
                onChange={e => set('name')(e.target.value)}
                placeholder="Your name"
                aria-invalid={Boolean(contactErrors.name)}
                aria-describedby={contactErrors.name ? 'inquiry-name-error' : undefined}
              />
              {contactErrors.name && <p id="inquiry-name-error" className={errorCn}>{contactErrors.name}</p>}
            </div>
            <div>
              <label className={labelCn}>Email *</label>
              <input
                className={inputCn}
                type="email"
                value={formData.email}
                onBlur={() => setContactErrors(validateContactStep(formData))}
                onChange={e => set('email')(e.target.value)}
                placeholder="your@email.com"
                aria-invalid={Boolean(contactErrors.email)}
                aria-describedby={contactErrors.email ? 'inquiry-email-error' : undefined}
              />
              {contactErrors.email && <p id="inquiry-email-error" className={errorCn}>{contactErrors.email}</p>}
            </div>
            <div>
              <label className={labelCn}>Business name (optional)</label>
              <input className={inputCn} value={formData.businessName} onChange={e => set('businessName')(e.target.value)} placeholder="Your business" />
            </div>
            <div>
              <label className={labelCn}>Current website or Instagram (optional)</label>
              <input
                className={inputCn}
                value={formData.website}
                onBlur={() => setContactErrors(validateContactStep(formData))}
                onChange={e => set('website')(e.target.value)}
                placeholder="yoursite.com or @handle"
                aria-invalid={Boolean(contactErrors.website)}
                aria-describedby={contactErrors.website ? 'inquiry-website-error' : undefined}
              />
              {contactErrors.website && <p id="inquiry-website-error" className={errorCn}>{contactErrors.website}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mb-6">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
                What can I help with?
              </div>
              <h3 className={`${stepH3Cn} mb-2`}>Pick your project type</h3>
              <p className="font-body font-light text-[14px] text-white/48 leading-[1.65] m-0">
                Choose one or more — this helps me tailor the right approach. You can always refine later.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map(type => (
                <TypeCard
                  key={type.id}
                  type={type}
                  selected={formData.projectTypes.includes(type.id)}
                  onToggle={() => toggleProjectType(type.id)}
                />
              ))}
            </div>
            {projectTypesTouched && formData.projectTypes.length === 0 && (
              <p className="mt-3.5 font-body text-[12px] text-[#FF8A8A]">
                Select at least one project type to continue.
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className={`${stepH3Cn} mb-7`}>Do you have a budget range in mind?</h3>
            <div className="flex flex-wrap gap-2.5">
              {BUDGETS.map(b => (
                <PillButton key={b} label={b} selected={formData.budget === b} onClick={() => set('budget')(b)} />
              ))}
            </div>
            {budgetTouched && !formData.budget && (
              <p className={errorCn}>Select a budget range to continue.</p>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className={`${stepH3Cn} mb-7`}>When are you looking to get started?</h3>
            <div className="flex flex-wrap gap-2.5">
              {TIMELINES.map(t => (
                <PillButton key={t} label={t} selected={formData.timeline === t} onClick={() => set('timeline')(t)} />
              ))}
            </div>
            {timelineTouched && !formData.timeline && (
              <p className={errorCn}>Select a timeline to continue.</p>
            )}
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-4">
            <h3 className={`${stepH3Cn} mb-2`}>Tell me about your project.</h3>
            <div>
              <label className={labelCn}>Project details — A few sentences are helpful.</label>
              <textarea
                value={formData.details}
                onChange={e => set('details')(e.target.value)}
                rows={5}
                placeholder="What does your business do? What's not working about your current online presence? What would a win look like?"
                className={`${inputCn} resize-y min-h-[120px]`}
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <div className="mb-6">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-3">
                Resources & assets
              </div>
              <h3 className={`${stepH3Cn} mb-2`}>Upload anything helpful.</h3>
              <p className="font-body font-light text-[14px] text-white/48 leading-[1.65] m-0">
                Add images, PDFs, brand files, sketches, decks, or any other assets that would help me understand the project.
              </p>
            </div>

            <label
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                addResourceFiles(event.dataTransfer.files);
              }}
              className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-white/14 bg-white/3.5 px-5 py-6 text-center transition-[border-color,background] duration-300 hover:border-white/28 hover:bg-white/5.5"
            >
              <input
                type="file"
                multiple
                accept={RESOURCE_ACCEPT}
                onChange={event => {
                  addResourceFiles(event.target.files);
                  event.target.value = '';
                }}
                className="sr-only"
              />
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-[10px] border border-white/12 bg-white/6 text-white/64 transition-colors duration-300 group-hover:text-white">
                <Icon icon="solar:upload-minimalistic-bold-duotone" className="h-5 w-5" />
              </span>
              <span className="font-disp text-[16px] font-bold tracking-[-0.015em] text-white/88">
                Drop files here or choose files
              </span>
              <span className="mt-2 font-body text-[12px] font-light leading-[1.5] text-white/42">
                Up to {INQUIRY_FILE_LIMITS.maxFiles} files. Images {formatFileSize(INQUIRY_FILE_LIMITS.maxImageBytes)}, PDFs {formatFileSize(INQUIRY_FILE_LIMITS.maxPdfBytes)}, videos {formatFileSize(INQUIRY_FILE_LIMITS.maxVideoBytes)}.
              </span>
            </label>

            {fileError && (
              <p className="mt-3 font-body text-[12px] leading-[1.55] text-[#FFB3B3]" role="alert">
                {fileError}
              </p>
            )}

            {resourceFiles.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {resourceFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 rounded-[8px] border border-white/8 bg-white/3.5 px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="m-0 truncate font-body text-[13px] font-medium text-white/82">
                        {file.name}
                      </p>
                      <p className="m-0 mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white/34">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResourceFile(index)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-transparent text-white/42 transition-colors duration-200 hover:border-white/24 hover:text-white"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Icon icon="solar:close-circle-bold" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <section
        id="inquiry"
        ref={sectionRef}
        className="py-[clamp(80px,10vw,120px)] px-[clamp(16px,6vw,88px)] bg-gateway flex flex-col items-center justify-center min-h-[50dvh]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          className="inquiry-reveal text-center max-w-[480px]"
        >
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[28px] mb-7"
            style={{ color: 'var(--accent-active)' }}
          >
            ✦
          </motion.div>
          <h3 className="font-disp font-extrabold text-[clamp(28px,4vw,38px)] text-white/90 tracking-[-0.03em] m-0 mb-4">
            Thank you! Your inquiry has been received.
          </h3>
          <p className="font-body font-light text-[15px] text-white/50 leading-[1.75] m-0">
            I've received your project details and will review everything shortly. If I believe we're a good fit, I'll reach out within 1–2 business days to discuss next steps.
          </p>
          <p className="mt-4 font-body font-light text-[15px] text-white/42 leading-[1.75]">
            In the meantime, feel free to gather any additional materials, references, or inspiration you'd like to share.
          </p>
        </motion.div>
      </section>
    );
  }

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
        {/* Step indicator dots */}
        <div className="flex gap-1.5 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i + 1 === step ? 28 : 8,
                background: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.12)',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ height: '4px', borderRadius: '2px' }}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="relative min-h-[240px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-9">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="font-mono text-[11px] tracking-[0.08em] uppercase bg-transparent border-none text-white/40 cursor-pointer p-0"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              aria-disabled={!canAdvance()}
              className={`font-mono text-[11px] tracking-[0.1em] uppercase border-none rounded-full py-[13px] px-7 transition-[background,color] duration-200 ${
                canAdvance()
                  ? 'bg-white text-gateway cursor-pointer'
                  : 'bg-white/8 text-white/25 cursor-default'
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="font-mono text-[11px] tracking-[0.1em] uppercase bg-white text-gateway border-none rounded-full py-[13px] px-7 cursor-pointer transition-opacity duration-200"
              style={{ opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Sending…' : 'Start the Conversation →'}
            </button>
          )}
        </div>
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.24, ease }}
              className="fixed bottom-5 left-4 right-4 z-[80] mx-auto max-w-[440px] rounded-[8px] border border-white/12 bg-[#100D16]/70 px-4 py-3 shadow-[0_22px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#FFB3B3]/20 bg-[#FF8A8A]/10 text-[#FFB3B3]">
                  <Icon icon="solar:danger-triangle-bold-duotone" className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="m-0 font-disp text-[14px] font-bold tracking-[-0.01em] text-white/88">
                    Inquiry not sent
                  </p>
                  <p className="m-0 mt-1 font-body text-[13px] font-light leading-[1.55] text-white/56">
                    {submitError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError('')}
                  className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/8 bg-white/5 text-white/42 transition-colors duration-200 hover:text-white"
                  aria-label="Dismiss inquiry error"
                >
                  <Icon icon="solar:close-circle-bold" className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InquiryForm;
