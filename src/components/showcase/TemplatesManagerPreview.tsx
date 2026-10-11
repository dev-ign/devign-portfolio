import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import avatar1 from '@/assets/templates-manager/avatar-1.png';
import avatar2 from '@/assets/templates-manager/imgAvatar2.png';
import avatar3 from '@/assets/templates-manager/imgAvatar3.png';
import avatar4 from '@/assets/templates-manager/imgAvatar4.png';
import grid from '@/assets/templates-manager/imgGroup4.svg';
import plus from '@/assets/templates-manager/imgGroup1.svg';
import chevronDown from '@/assets/templates-manager/imgGroup2.svg';
import search from '@/assets/templates-manager/imgGroup3.svg';
import newPlus from '@/assets/templates-manager/imgGroup5.svg';
import star from '@/assets/templates-manager/imgGroup6.svg';
import trending from '@/assets/templates-manager/imgGroup7.svg';
import share from '@/assets/templates-manager/imgGroup8.svg';
import refresh from '@/assets/templates-manager/imgGroup9.svg';
import users from '@/assets/templates-manager/imgGroup10.svg';
import chevronRight from '@/assets/templates-manager/imgGroup11.svg';
import pencil from '@/assets/templates-manager/imgGroup12.svg';
import statusStar from '@/assets/templates-manager/imgGroup13.svg';
import statusTrending from '@/assets/templates-manager/imgGroup14.svg';
import more from '@/assets/templates-manager/imgGroup15.svg';
import toolbarDown from '@/assets/templates-manager/imgGroup16.svg';
import bold from '@/assets/templates-manager/imgGroup.svg';
import italic from '@/assets/templates-manager/imgGroup17.svg';
import underline from '@/assets/templates-manager/imgGroup18.svg';
import alignLeft from '@/assets/templates-manager/imgGroup19.svg';
import alignCenter from '@/assets/templates-manager/imgGroup20.svg';
import alignRight from '@/assets/templates-manager/imgGroup21.svg';
import list from '@/assets/templates-manager/imgGroup22.svg';
import orderedList from '@/assets/templates-manager/imgGroup23.svg';
import link from '@/assets/templates-manager/imgGroup24.svg';
import image from '@/assets/templates-manager/imgGroup25.svg';
import braces from '@/assets/templates-manager/imgGroup26.svg';
import undo from '@/assets/templates-manager/imgGroup27.svg';
import redo from '@/assets/templates-manager/imgGroup28.svg';
import './TemplatesManagerPreview.css';

type CategoryId = 'annual' | 'stewardship' | 'campaign' | 'followup';
type TemplateId = 'year-end' | 'first-time' | 'tuesday' | 'major-gift' | 'progress' | 'stewardship' | 'campaign' | 'followup';
type SaveStatus = 'saved' | 'saving' | 'success' | 'unsaved';

type Template = {
  id: TemplateId;
  category: CategoryId;
  title: string;
  meta: string;
  subject: string;
  paragraphs: string[];
  closing: string;
  button: string;
  default?: boolean;
  highEngagement?: boolean;
  shared?: boolean;
  assigned?: boolean;
  update?: boolean;
};

const templates: Template[] = [
  { id: 'year-end', category: 'annual', title: 'Year-End Giving Appeal', meta: 'Default · 12 fundraisers', subject: 'Help us finish the year strong', paragraphs: ["As the year comes to a close, we're reflecting on everything our community has accomplished together.", "Your support has helped create meaningful opportunities for students, and there's still time to make an even greater impact.", 'Will you help us finish the year strong?'], closing: 'Thank you for being part of our community.', button: 'Make a Gift', default: true, highEngagement: true },
  { id: 'first-time', category: 'annual', title: 'First-Time Donor Thank You', meta: 'Shared with team', subject: 'Thank you for your support', paragraphs: ['Your first gift is already making a difference for students and our community.', 'Because of you, more people can access the opportunities they need to thrive.', 'We are grateful to welcome you to this community.'], closing: 'Thank you for standing with us.', button: 'See Your Impact', shared: true },
  { id: 'tuesday', category: 'annual', title: 'Giving Tuesday Reminder', meta: '5 fundraisers · Update available', subject: 'Your Giving Tuesday gift matters', paragraphs: ['Today is a chance to come together and make a lasting difference.', 'Your generosity helps students pursue new possibilities.'], closing: 'Thank you for your support.', button: 'Give Today', update: true },
  { id: 'major-gift', category: 'annual', title: 'Major Gift Follow-Up', meta: '3 fundraisers', subject: 'Following up on our conversation', paragraphs: ['Thank you for taking the time to speak with us.', 'Your partnership can create meaningful opportunities for our community.'], closing: 'We look forward to connecting again.', button: 'Learn More', assigned: true },
  { id: 'progress', category: 'annual', title: 'Campaign Progress Update', meta: 'Not assigned · Edited 4d ago', subject: 'See the progress we made together', paragraphs: ['Your support is helping our campaign move forward.', 'Here is what our community has accomplished so far.'], closing: 'Thank you for making this progress possible.', button: 'View Progress' },
  { id: 'stewardship', category: 'stewardship', title: 'Impact Story Follow-Up', meta: 'Shared with team', subject: 'The difference your gift made', paragraphs: ['Your generosity is opening doors for students every day.', 'We wanted to share a story that shows the impact of your support.'], closing: 'With gratitude for your partnership.', button: 'Read the Story', shared: true },
  { id: 'campaign', category: 'campaign', title: 'Spring Campaign Update', meta: '6 fundraisers', subject: 'A new chapter for our campaign', paragraphs: ['Our spring campaign is underway, and your support matters.', 'Together, we can reach more students this year.'], closing: 'Thank you for being part of the journey.', button: 'View Campaign', assigned: true },
  { id: 'followup', category: 'followup', title: 'Donor Conversation Follow-Up', meta: '11 fundraisers', subject: 'Great connecting with you', paragraphs: ['It was a pleasure speaking with you.', 'We appreciate your interest in our work and look forward to staying in touch.'], closing: 'Thank you for your time.', button: 'Explore More', assigned: true },
];

const categories: { id: CategoryId; label: string; count: number }[] = [
  { id: 'annual', label: 'Annual Giving', count: 12 },
  { id: 'stewardship', label: 'Stewardship', count: 9 },
  { id: 'campaign', label: 'Campaign Updates', count: 6 },
  { id: 'followup', label: 'Donor Follow-Up', count: 11 },
];

const fundraisers = [
  { id: 'maya', name: 'Maya Rodriguez', avatar: avatar1 },
  { id: 'daniel', name: 'Daniel Brooks', avatar: avatar2 },
  { id: 'sofia', name: 'Sofia Martinez', avatar: avatar3 },
  { id: 'alex', name: 'Alex Chen', avatar: avatar4 },
];

const initialAssigned = ['maya', 'daniel', 'sofia', 'alex'];
const stageDurations = [1500, 750, 850, 1400, 850, 850, 950, 1050, 650, 650, 950, 1300];

const AssetIcon: React.FC<{ src: string; label?: string; className?: string }> = ({ src, label, className = '' }) => (
  <img src={src} alt={label || ''} className={`tm-icon ${className}`} aria-hidden={label ? undefined : true} />
);

export type TemplatesManagerPreviewProps = {
  variant: 'studio' | 'portfolio';
  isActive: boolean;
  isTransitionComplete: boolean;
};

const TemplatesManagerPreview: React.FC<TemplatesManagerPreviewProps> = ({ variant, isActive, isTransitionComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const assignmentAnchorRef = useRef<HTMLDivElement>(null);
  const remainingRef = useRef(stageDurations[0]);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manual, setManual] = useState(false);
  const [stage, setStage] = useState(0);
  const [openCategory, setOpenCategory] = useState<CategoryId | null>('annual');
  const [selectedId, setSelectedId] = useState<TemplateId>('year-end');
  const [assignedIds, setAssignedIds] = useState<string[]>(initialAssigned);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [subject, setSubject] = useState(templates[0].subject);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('Library');
  const [actionsOpen, setActionsOpen] = useState(false);
  const selected = templates.find(template => template.id === selectedId) || templates[0];

  const reset = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (saveTimeoutRef.current !== null) window.clearTimeout(saveTimeoutRef.current);
    timerRef.current = null;
    saveTimeoutRef.current = null;
    remainingRef.current = stageDurations[0];
    setStage(0);
    setOpenCategory('annual');
    setSelectedId('year-end');
    setAssignedIds(initialAssigned);
    setAssignmentOpen(false);
    setSubject(templates[0].subject);
    setSaveStatus('saved');
    setSearchValue('');
    setActiveTab('Library');
    setActionsOpen(false);
  };

  useEffect(() => {
    if (isActive) return;
    reset();
    setManual(false);
    setHovered(false);
    setFocused(false);
  }, [isActive]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.45), { threshold: [0, 0.45, 0.75] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => () => {
    if (saveTimeoutRef.current !== null) window.clearTimeout(saveTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!assignmentOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!assignmentAnchorRef.current?.contains(event.target as Node)) setAssignmentOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [assignmentOpen]);

  const canAutoplay = isActive && isTransitionComplete && visible && documentVisible && !reducedMotion && !hovered && !focused && !manual;

  useEffect(() => {
    if (!canAutoplay) return;
    const started = performance.now();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const next = (stage + 1) % stageDurations.length;
      if (next === 0) reset();
      else if (next === 1) setOpenCategory(null);
      else if (next === 2) setOpenCategory('stewardship');
      else if (next === 3) { setOpenCategory('annual'); setSelectedId('first-time'); setSubject(templates[1].subject); setAssignedIds(['maya', 'daniel']); }
      else if (next === 4) setAssignmentOpen(true);
      else if (next === 5) setAssignedIds(['maya', 'daniel', 'sofia']);
      else if (next === 6) setAssignmentOpen(false);
      else if (next === 7) { setSubject('Thank you for making a difference'); setSaveStatus('unsaved'); }
      else if (next === 8) setSaveStatus('saving');
      else if (next === 9) setSaveStatus('success');
      else if (next === 10) setSaveStatus('saved');
      remainingRef.current = stageDurations[next];
      setStage(next);
    }, remainingRef.current);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
        remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - started));
      }
    };
  }, [canAutoplay, stage]);

  const onManual = () => setManual(true);
  const selectTemplate = (template: Template) => {
    onManual();
    setSelectedId(template.id);
    setOpenCategory(template.category);
    setSubject(template.subject);
    setAssignedIds(template.id === 'year-end' ? initialAssigned : ['maya', 'daniel']);
    setSaveStatus('saved');
    setAssignmentOpen(false);
  };
  const toggleFundraiser = (id: string) => {
    onManual();
    setAssignedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setSaveStatus('unsaved');
  };
  const save = () => {
    onManual();
    setAssignmentOpen(false);
    setSaveStatus('saving');
    if (saveTimeoutRef.current !== null) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      saveTimeoutRef.current = null;
      setSaveStatus('success');
    }, 500);
  };
  const filteredCategories = categories.map(category => ({
    ...category,
    matches: templates.filter(template => template.category === category.id && template.title.toLowerCase().includes(searchValue.toLowerCase())),
  })).filter(category => !searchValue || category.matches.length > 0);
  const statusLabel = saveStatus === 'saving'
    ? 'Saving…'
    : saveStatus === 'success' || (saveStatus === 'saved' && stage > 9)
      ? 'All changes saved'
      : saveStatus === 'unsaved'
        ? 'Unsaved changes'
        : 'Last saved 2 min ago';

  return (
    <div
      ref={rootRef}
      className={`tm-preview tm-preview--${variant}`}
      data-demo-stage={stage}
      data-playback={canAutoplay ? 'playing' : manual ? 'interacting' : 'paused'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
      aria-label="Interactive Templates Manager preview"
    >
      <div className="tm-appbar">
        <div className="tm-brand"><span className="tm-brand-mark"><AssetIcon src={grid} /></span><strong>Templates Manager</strong></div>
        <div className="tm-tabs" aria-label="Template views">
          {['Library', 'Shared with me', 'Archived'].map(tab => <button type="button" key={tab} className={activeTab === tab ? 'is-active' : ''} aria-pressed={activeTab === tab} onClick={() => { onManual(); setActiveTab(tab); }}>{tab}</button>)}
        </div>
        <div className="tm-account"><span>Advancement Office</span><span className="tm-account-avatar">DW</span></div>
      </div>
      <div className="tm-body">
        <aside className="tm-library" aria-label="Template library">
          <div className="tm-library-heading"><div><strong>All templates</strong><span>38</span></div><button type="button" className="tm-new-button" onClick={onManual}><AssetIcon src={newPlus} /> New</button></div>
          <label className="tm-search"><AssetIcon src={search} /><input value={searchValue} onChange={event => { onManual(); setSearchValue(event.target.value); }} placeholder="Search templates" aria-label="Search templates" /><kbd>/</kbd></label>
          <div className="tm-categories">
            {filteredCategories.map(category => {
              const expanded = searchValue ? true : openCategory === category.id;
              return <div className="tm-category" key={category.id}>
                <button type="button" className="tm-category-button" aria-expanded={expanded} onClick={() => { onManual(); setOpenCategory(expanded ? null : category.id); }}><AssetIcon src={expanded ? chevronDown : chevronRight} /><strong>{category.label}</strong><span>· {category.count}</span></button>
                <div className={`tm-template-list ${expanded ? 'is-expanded' : ''}`} inert={!expanded}>
                  {category.matches.map(template => <button type="button" key={template.id} className={`tm-template-row ${selectedId === template.id ? 'is-selected' : ''}`} aria-current={selectedId === template.id ? 'true' : undefined} onClick={() => selectTemplate(template)}>
                    <span className="tm-template-text"><strong>{template.title}</strong><small>{template.meta}</small></span>
                    <span className="tm-row-indicators" aria-hidden="true">{template.default && <AssetIcon src={star} />}{template.highEngagement && <AssetIcon src={trending} />}{template.shared && <AssetIcon src={share} />}{template.assigned && <AssetIcon src={users} />}{template.update && <AssetIcon src={refresh} />}</span>
                  </button>)}
                  {category.id === 'annual' && !searchValue && <button type="button" className="tm-show-more" onClick={onManual}>Show 7 more</button>}
                </div>
              </div>;
            })}
          </div>
        </aside>
        <section className="tm-workspace" aria-label="Template workspace">
          <div className="tm-workspace-header">
            <div className="tm-workspace-info">
              <span className="tm-breadcrumb">{categories.find(category => category.id === selected.category)?.label}</span>
              <div className="tm-title-row"><h3>{selected.title}</h3><AssetIcon src={pencil} />{selected.default && <span className="tm-indicator tm-indicator--default"><AssetIcon src={statusStar} />Default template</span>}{selected.highEngagement && <span className="tm-indicator tm-indicator--engagement"><AssetIcon src={statusTrending} />High engagement</span>}{selected.shared && <span className="tm-indicator"><AssetIcon src={share} />Shared with team</span>}</div>
              <div className="tm-assignment-line"><span>Assigned to</span><div className="tm-avatars">{assignedIds.slice(0, 4).map(id => { const person = fundraisers.find(item => item.id === id); return person && <img key={id} src={person.avatar} alt={person.name} />; })}</div>{selected.id === 'year-end' && <span className="tm-more-count">+{Math.max(0, 12 - assignedIds.length)}</span>}
                <div className="tm-assignment-anchor" ref={assignmentAnchorRef}><button type="button" className="tm-manage" aria-expanded={assignmentOpen} onClick={() => { onManual(); setAssignmentOpen(value => !value); }}><AssetIcon src={plus} /> Manage</button>
                  {assignmentOpen && <div className="tm-assignment-popover" role="group" aria-label="Assign fundraisers"><strong>Assign fundraisers</strong>{fundraisers.map(person => <label key={person.id}><input type="checkbox" checked={assignedIds.includes(person.id)} onChange={() => toggleFundraiser(person.id)} /><img src={person.avatar} alt="" /><span>{person.name}</span></label>)}</div>}
                </div><span className="tm-owner">Owned by Dana Whitfield</span>
              </div>
            </div>
            <div className="tm-actions-anchor"><button type="button" className="tm-actions" aria-label="Template actions" aria-expanded={actionsOpen} onClick={() => { onManual(); setActionsOpen(value => !value); }}><AssetIcon src={more} /></button>{actionsOpen && <div className="tm-actions-menu"><button type="button" onClick={() => setActionsOpen(false)}>Duplicate template</button><button type="button" onClick={() => setActionsOpen(false)}>View details</button></div>}</div>
          </div>
          <div className="tm-divider" />
          <label className="tm-subject"><span>Subject</span><input value={subject} onChange={event => { onManual(); setSubject(event.target.value); setSaveStatus('unsaved'); }} /></label>
          <div className="tm-editor">
            <div className="tm-toolbar" aria-label="Editor toolbar"><button type="button" className="tm-paragraph" onClick={onManual}>Paragraph <AssetIcon src={toolbarDown} /></button><span className="tm-toolbar-separator" />
              {[['Bold', bold], ['Italic', italic], ['Underline', underline]].map(([label, src]) => <button type="button" className="tm-tool" title={label} aria-label={label} key={label} onClick={onManual}><AssetIcon src={src} /></button>)}<span className="tm-toolbar-separator" />
              {[['Align left', alignLeft], ['Align center', alignCenter], ['Align right', alignRight]].map(([label, src], index) => <button type="button" className={`tm-tool ${index === 0 ? 'is-active' : ''}`} title={label} aria-label={label} key={label} onClick={onManual}><AssetIcon src={src} /></button>)}<span className="tm-toolbar-separator" />
              {[['Bulleted list', list], ['Numbered list', orderedList], ['Insert link', link], ['Insert image', image]].map(([label, src], index) => <React.Fragment key={label}>{index === 2 && <span className="tm-toolbar-separator" />}<button type="button" className="tm-tool" title={label} aria-label={label} onClick={onManual}><AssetIcon src={src} /></button></React.Fragment>)}<span className="tm-toolbar-separator" />
              <button type="button" className="tm-merge-button" onClick={() => { onManual(); setSaveStatus('unsaved'); }}><AssetIcon src={braces} /> Merge field <AssetIcon src={toolbarDown} /></button><span className="tm-toolbar-spacer" /><button type="button" className="tm-tool" aria-label="Undo" onClick={onManual}><AssetIcon src={undo} /></button><button type="button" className="tm-tool" aria-label="Redo" onClick={onManual}><AssetIcon src={redo} /></button>
            </div>
            <div className="tm-editor-canvas" aria-label="Email content preview">
              <p>Hi <span className="tm-merge-token">{'{{First Name}}'}</span>,</p>
              {selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <span className="tm-email-button">{selected.button}</span>
              <p>{selected.closing}</p><p>— <span className="tm-merge-token">{'{{Fundraiser Name}}'}</span><br />The Advancement Team</p>
            </div>
            <div className="tm-editor-status"><span>p</span><span>2 merge fields</span></div>
          </div>
          <div className="tm-savebar"><button type="button" className="tm-replay" onClick={event => { reset(); setManual(false); event.currentTarget.blur(); }} aria-label="Replay Templates Manager demo"><Icon icon="lucide:rotate-ccw" /> Replay demo</button><span className="tm-save-status" role="status">{statusLabel}</span><button type="button" className={`tm-save-button ${saveStatus === 'saving' ? 'is-saving' : ''}`} onClick={save} disabled={saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'success' ? 'Saved' : 'Save Changes'}</button></div>
        </section>
      </div>
    </div>
  );
};

export default TemplatesManagerPreview;
