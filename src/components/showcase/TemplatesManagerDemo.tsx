import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { templateManagerDemo as demo } from '@/data/templateManagerDemo';
import grid from '@/assets/templates-manager/imgGroup4.svg';
import search from '@/assets/templates-manager/imgGroup3.svg';
import chevronDown from '@/assets/templates-manager/imgGroup2.svg';
import chevronRight from '@/assets/templates-manager/imgGroup11.svg';
import share from '@/assets/templates-manager/imgGroup8.svg';
import users from '@/assets/templates-manager/imgGroup10.svg';
import braces from '@/assets/templates-manager/imgGroup26.svg';
import './TemplatesManagerDemo.css';

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type TemplatesManagerDemoProps = {
  variant: 'studio' | 'portfolio' | 'case-study';
  isActive: boolean;
  isTransitionComplete: boolean;
};

const stepTitles = [
  'Explore the library',
  'Select a reusable template',
  'Choose fundraisers',
  'Shared with the team',
  'View the shared original',
  'Personalize a copy',
  'Save the personal copy',
];
const nextLabels = ['Select template', 'Assign fundraisers', 'Confirm sharing', 'View as Maya', 'Duplicate to my library', 'Save personal copy'];
const previewDelays = [950, 950, 1350];

const Asset: React.FC<{ src: string }> = ({ src }) => <img src={src} alt="" aria-hidden="true" />;

const TemplatesManagerDemo: React.FC<TemplatesManagerDemoProps> = ({ variant, isActive, isTransitionComplete }) => {
  const guided = variant === 'case-study';
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const guideNextRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState<Step>(guided || !reducedMotion ? 0 : 3);
  const [expandedCategory, setExpandedCategory] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([...demo.sharedRecipients]);
  const [subject, setSubject] = useState<string>(demo.template.personalSubject);
  const [body, setBody] = useState<string>(demo.template.personalBody);
  const [saved, setSaved] = useState(false);
  const [manual, setManual] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(demo.records.original.id);

  const reset = () => {
    setStep(guided || !reducedMotion ? 0 : 3);
    setExpandedCategory(true);
    setSelectedRecipients([...demo.sharedRecipients]);
    setSubject(demo.template.personalSubject);
    setBody(demo.template.personalBody);
    setSaved(false);
    setManual(false);
    setSearchTerm('');
    setSelectedTemplateId(demo.records.original.id);
  };

  useEffect(() => {
    if (!isActive && !guided) reset();
    // Resetting on selection change is intentional: the preview starts a fresh journey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, guided]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || guided || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35), { threshold: [0, 0.35, 0.7] });
    observer.observe(node);
    return () => observer.disconnect();
  }, [guided]);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const canAutoplay = !guided && isActive && isTransitionComplete && visible && documentVisible && !reducedMotion && !manual && step < 3;
  useEffect(() => {
    if (!canAutoplay) return;
    const timer = window.setTimeout(() => setStep(current => (current < 3 ? (current + 1) as Step : current)), previewDelays[step]);
    return () => window.clearTimeout(timer);
  }, [canAutoplay, step]);

  useEffect(() => {
    if (step !== 2 || !guided) return;
    const firstInput = dialogRef.current?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    firstInput?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setStep(1);
        shareButtonRef.current?.focus();
      } else if (event.key === 'Tab') {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])') || []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [guided, step]);

  useEffect(() => {
    if (guided && (step === 3 || step === 5)) guideNextRef.current?.focus();
  }, [guided, step]);

  const goTo = (next: Step) => {
    setManual(true);
    if (next === 5) setSelectedTemplateId(demo.records.personalCopy.id);
    if (next === 4) setSelectedTemplateId(demo.records.original.id);
    if (next === 6) setSaved(true);
    else if (next === 5) setSaved(false);
    setStep(next);
  };
  const next = () => {
    if (step === 2 && selectedRecipients.length === 0) return;
    if (step === 5 && selectedTemplateId === demo.records.original.id) {
      setSelectedTemplateId(demo.records.personalCopy.id);
      return;
    }
    if (step < 6) goTo((step + 1) as Step);
  };
  const toggleRecipient = (id: string) => {
    setManual(true);
    setSelectedRecipients(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };
  const isManager = step < 4;
  const hasPersonalCopy = step >= 5;
  const isPersonal = hasPersonalCopy && selectedTemplateId === demo.records.personalCopy.id;
  const isShared = !isManager && !isPersonal;
  const currentRecord = isPersonal ? demo.records.personalCopy : demo.records.original;
  const originalHasUpdate = hasPersonalCopy && demo.sharedUpdate.available && demo.sharedUpdate.templateId === demo.records.original.id && demo.sharedUpdate.recipientId === demo.people.maya.id;
  const selected = step >= 1;
  const mergeFieldCount = 2 + (isPersonal ? (body.match(/\{\{First Name\}\}/g) || []).length : 0);
  const showOriginal = !searchTerm || demo.records.original.title.toLowerCase().includes(searchTerm.toLowerCase());
  const showCopy = hasPersonalCopy && (!searchTerm || demo.records.personalCopy.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const visibleCategory = showOriginal || showCopy;
  const count = selectedRecipients.length;

  return (
    <div ref={rootRef} className={`tmx tmx--${variant}`} data-demo-step={step} data-playback={canAutoplay ? 'playing' : manual ? 'manual' : 'paused'} aria-label="Templates Manager workflow reconstruction">
      {guided && <div className="tmx-guide" aria-label="Workflow controls">
        <div><span className="tmx-eyebrow">Illustrative product reconstruction</span><p aria-live="polite"><strong>{String(step + 1).padStart(2, '0')} / 07</strong> {stepTitles[step]}</p></div>
        <div className="tmx-guide-actions"><button type="button" onClick={reset}>Replay</button><button type="button" onClick={() => goTo(Math.max(0, step - 1) as Step)} disabled={step === 0}>Back</button><button ref={guideNextRef} type="button" className="tmx-primary" onClick={next} disabled={step === 6 || (step === 2 && count === 0)}>{step === 6 ? 'Journey complete' : step === 5 && isShared ? 'Return to my copy' : nextLabels[step]}</button></div>
      </div>}
      <div className="tmx-app">
        <header className="tmx-appbar">
          <div className="tmx-brand"><span className="tmx-brand-mark"><Asset src={grid} /></span><strong>Templates Manager</strong></div>
          <div className="tmx-topnav"><span className="is-active">{isPersonal ? 'Personal library' : isShared ? 'Shared with me' : 'Library'}</span><span>{isManager ? 'Shared with me' : isShared ? 'Personal library' : 'Shared with me'}</span></div>
          <div className="tmx-account"><span>{demo.workspace}</span><b>{isManager ? 'DW' : 'MR'}</b></div>
        </header>
        <div className="tmx-main">
          <aside className="tmx-library" aria-label={isManager ? 'Manager template library' : 'Fundraiser template library'}>
            <div className="tmx-library-heading"><strong>{isManager ? 'All templates' : 'Maya’s library'}</strong><span>{isManager ? '38' : hasPersonalCopy ? '2' : '1'}</span></div>
            <label className="tmx-search"><Asset src={search} /><input value={searchTerm} onChange={event => { setManual(true); setSearchTerm(event.target.value); }} placeholder="Search templates" aria-label="Search templates" /></label>
            {visibleCategory ? <div className="tmx-category">
              <button type="button" className="tmx-category-toggle" aria-expanded={expandedCategory} onClick={() => { setManual(true); setExpandedCategory(value => !value); }}><Asset src={expandedCategory ? chevronDown : chevronRight} /><span>{demo.template.category}</span><small>· {isManager ? '12' : hasPersonalCopy ? '2' : '1'}</small></button>
              {expandedCategory && <div className="tmx-category-rows">
                {isManager && <div className="tmx-row tmx-row--muted"><strong>Year-End Giving Appeal</strong><small>Default · 12 fundraisers</small></div>}
                {showOriginal && <button type="button" data-template-id={demo.records.original.id} className={`tmx-row ${selected && !isPersonal ? 'is-selected' : ''}`} aria-current={selected && !isPersonal ? 'true' : undefined} onClick={() => { if (isManager) goTo(1); else { setManual(true); setSelectedTemplateId(demo.records.original.id); } }}><strong>{demo.records.original.title}</strong><small>{isManager ? step >= 3 ? `Shared · ${count} fundraisers` : `Owned by ${demo.manager}` : `Shared by ${demo.manager} · read-only`}</small>{!isManager && originalHasUpdate && <span className="tmx-update" aria-label="Update available for shared original">Update available</span>}</button>}
                {showCopy && <button type="button" data-template-id={demo.records.personalCopy.id} className={`tmx-row ${isPersonal ? 'is-selected' : ''}`} aria-current={isPersonal ? 'true' : undefined} onClick={() => { setManual(true); setSelectedTemplateId(demo.records.personalCopy.id); }}><strong>{demo.records.personalCopy.title}</strong><small>My templates · editable · owned by Maya</small></button>}
                {isManager && <div className="tmx-row tmx-row--muted"><strong>Giving Tuesday Reminder</strong><small>5 fundraisers</small></div>}
              </div>}
            </div> : <p className="tmx-empty">No matching templates</p>}
            {isManager && demo.categories.slice(1).map(category => <button type="button" key={category.name} className="tmx-category-toggle tmx-category-toggle--other" onClick={() => { setManual(true); setExpandedCategory(false); }}><Asset src={chevronRight} /><span>{category.name}</span><small>· {category.count}</small></button>)}
          </aside>
          <section className="tmx-workspace" aria-label="Template details">
            {selected ? <>
              <div className="tmx-workspace-top" data-template-id={currentRecord.id}><span className="tmx-crumb">{isPersonal ? 'My templates' : isShared ? 'Shared with me' : 'Library'} / {demo.template.category}</span><h3>{currentRecord.title}</h3><div className="tmx-badges"><span className={isPersonal ? 'tmx-badge--personal' : 'tmx-badge--shared'}><Asset src={isPersonal ? users : share} />{isPersonal ? 'Owned by Maya Rodriguez' : isShared ? 'Shared original · read-only' : `Owned by ${demo.manager}`}</span>{isManager && step >= 3 && <span><Asset src={users} />Shared with {count} fundraisers</span>}{isShared && originalHasUpdate && <span className="tmx-update" role="status">Update available on Dana’s shared original</span>}</div></div>
              {isManager && <div className="tmx-assignment"><span>Assigned to</span><div className="tmx-avatars">{step >= 3 && selectedRecipients.map(id => { const person = demo.fundraisers.find(item => item.id === id); return person && <span key={id} title={person.name}>{person.initials}</span>; })}</div><button ref={shareButtonRef} type="button" onClick={() => goTo(2)}>{step >= 3 ? 'Manage sharing' : 'Assign fundraisers'}</button></div>}
              {isShared && <div className="tmx-permission"><strong>Read-only shared template</strong><span>{hasPersonalCopy ? 'Dana’s original remains available. Updates to it do not overwrite your personal copy.' : `Make a personal copy to change its content. The shared original stays with ${demo.manager}.`}</span><button type="button" onClick={() => hasPersonalCopy ? setSelectedTemplateId(demo.records.personalCopy.id) : goTo(5)}>{hasPersonalCopy ? 'Open my copy' : 'Duplicate to my library'}</button></div>}
              <div className="tmx-subject"><label htmlFor={`tmx-subject-${variant}`}>Subject</label><input id={`tmx-subject-${variant}`} value={isPersonal ? subject : demo.template.subject} onChange={event => { setSubject(event.target.value); setSaved(false); }} readOnly={!isPersonal} aria-readonly={!isPersonal} /></div>
              <div className="tmx-editor"><div className="tmx-toolbar" aria-label="Formatting options shown for context"><span className="tmx-paragraph">Paragraph <span aria-hidden="true">⌄</span></span><span aria-hidden="true">B</span><span aria-hidden="true"><i>I</i></span><span aria-hidden="true"><u>U</u></span><span aria-hidden="true">☰</span><span aria-hidden="true">☷</span><span className="tmx-toolbar-merge"><Asset src={braces} />Merge field</span></div><div className="tmx-editor-body"><p>Hi <mark>{demo.template.greetingField}</mark>,</p>{isPersonal ? <textarea value={body} onChange={event => { setBody(event.target.value); setSaved(false); }} aria-label="Personal template message" /> : <p>{demo.template.body}</p>}<p>Thank you for being part of our community.</p><p>— <mark>{demo.template.signatureField}</mark><br />The Advancement Team</p></div><div className="tmx-editor-foot">{isPersonal ? <button type="button" onClick={() => { setBody(value => `${value} ${demo.template.greetingField}`); setSaved(false); }}>Insert merge field</button> : <span>{isShared ? 'Read-only original' : 'Manager preview'}</span>}<span>{mergeFieldCount} merge fields</span></div></div>
              <div className="tmx-savebar"><span role="status">{isPersonal ? saved ? 'Personal copy saved' : 'Personal copy · unsaved changes' : step >= 3 ? `Shared with ${count} fundraisers` : 'Manager-owned template'}</span>{isPersonal ? <button type="button" onClick={() => goTo(6)}>{saved ? 'Saved' : 'Save changes'}</button> : isManager && <button type="button" onClick={() => goTo(2)}>{step >= 3 ? 'Manage sharing' : 'Assign fundraisers'}</button>}</div>
            </> : <div className="tmx-placeholder"><span>01 / Library</span><h3>Find a template to share</h3><p>Expand Annual Giving, then select {demo.template.title}.</p><button type="button" onClick={() => goTo(1)}>Select template</button></div>}
          </section>
        </div>
      </div>
      {!guided && <div className="tmx-preview-caption"><span>Manager → Shared library → Fundraiser</span><strong>{stepTitles[step]}</strong>{step === 3 && <button type="button" onClick={reset}>Replay</button>}</div>}
      {step === 2 && <div className="tmx-dialog-layer"><div className="tmx-dialog" ref={dialogRef} role="dialog" aria-label="Assign fundraisers"><div className="tmx-dialog-head"><div><span>Manager sharing</span><h3>Assign fundraisers</h3></div>{guided && <button type="button" aria-label="Close dialog" onClick={() => { goTo(1); shareButtonRef.current?.focus(); }}>×</button>}</div><p>Share <strong>{demo.template.title}</strong> with assigned fundraisers. Recipients can view the original and duplicate it to personalize.</p><div className="tmx-recipient-list">{demo.fundraisers.map(person => <label key={person.id}><input type="checkbox" aria-label={person.name} checked={selectedRecipients.includes(person.id)} onChange={() => toggleRecipient(person.id)} /><span className="tmx-person-avatar">{person.initials}</span><span>{person.name}</span></label>)}</div><div className="tmx-dialog-actions"><span>{count} selected · read-only access</span><button type="button" onClick={next} disabled={count === 0}>Confirm sharing</button></div></div></div>}
    </div>
  );
};

export default TemplatesManagerDemo;
