import React from 'react';
import PlannerOption from './PlannerOption';
import type {
  PlannerAnswer,
  PlannerQuestion as PlannerQuestionType,
} from '../types/servicePlanner.types';

interface PlannerQuestionProps {
  question: PlannerQuestionType;
  answer: PlannerAnswer | undefined;
  onAnswer: (answer: PlannerAnswer) => void;
}

const inputClass = 'w-full rounded-[10px] border border-white/12 bg-white/[0.04] px-4 py-3.5 font-body text-[14px] text-white/88 outline-none transition-colors placeholder:text-white/25 focus:border-white/35 focus:ring-2 focus:ring-white/20';

const PlannerQuestion: React.FC<PlannerQuestionProps> = ({ question, answer, onAnswer }) => {
  const selected = Array.isArray(answer) ? answer : [];
  const isSelection = question.inputType === 'single-select' || question.inputType === 'multi-select';

  const toggleOption = (optionId: string) => {
    if (question.inputType === 'single-select') {
      onAnswer(optionId);
      return;
    }
    const next = selected.includes(optionId)
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId];
    onAnswer(next);
  };

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">{question.title}</legend>
      <div aria-live="polite" aria-atomic="true">
        <p className="m-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/36">{question.stepLabel}</p>
        <h3 className="m-0 mt-3 font-disp text-[clamp(24px,4vw,36px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-white/92">
          {question.title}
        </h3>
        {question.description && <p className="mb-0 mt-3 max-w-[620px] font-body text-[13px] font-light leading-[1.6] text-white/48">{question.description}</p>}
      </div>

      {isSelection && (
        <div className="mt-7 grid gap-2.5 sm:grid-cols-2" role={question.inputType === 'single-select' ? 'radiogroup' : 'group'} aria-label={question.title}>
          {question.options?.map(option => {
            const isSelected = question.inputType === 'single-select' ? answer === option.id : selected.includes(option.id);
            const atLimit = Boolean(question.maxSelections && selected.length >= question.maxSelections);
            return (
              <PlannerOption
                key={option.id}
                option={option}
                selected={isSelected}
                disabled={question.inputType === 'multi-select' && atLimit && !isSelected}
                multiple={question.inputType === 'multi-select'}
                onSelect={() => toggleOption(option.id)}
              />
            );
          })}
        </div>
      )}

      {(question.inputType === 'text' || question.inputType === 'date' || question.inputType === 'number') && (
        <input
          className={`${inputClass} mt-7`}
          type={question.inputType}
          value={typeof answer === 'string' || typeof answer === 'number' ? answer : ''}
          min={question.validation?.min}
          max={question.validation?.max}
          maxLength={question.validation?.maxLength}
          required={question.required}
          onChange={event => onAnswer(question.inputType === 'number' ? Number(event.target.value) : event.target.value)}
        />
      )}

      {question.inputType === 'textarea' && (
        <textarea
          className={`${inputClass} mt-7 min-h-[150px] resize-y`}
          value={typeof answer === 'string' ? answer : ''}
          maxLength={question.validation?.maxLength}
          required={question.required}
          placeholder="Share a few sentences…"
          onChange={event => onAnswer(event.target.value)}
        />
      )}

      {question.inputType === 'range' && (
        <div className="mt-7">
          <input
            className="w-full accent-[#B887FF]"
            type="range"
            value={typeof answer === 'number' ? answer : question.validation?.min ?? 0}
            min={question.validation?.min ?? 0}
            max={question.validation?.max ?? 100}
            onChange={event => onAnswer(Number(event.target.value))}
          />
          <output className="mt-2 block font-mono text-[10px] text-white/48">{String(answer ?? question.validation?.min ?? 0)}</output>
        </div>
      )}
    </fieldset>
  );
};

export default PlannerQuestion;
