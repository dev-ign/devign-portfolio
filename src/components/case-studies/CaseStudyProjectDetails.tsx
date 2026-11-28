import './CaseStudyEditorial.css';

export type CaseStudyProjectDetail = {
  label: string;
  value?: string | null;
};

type CaseStudyProjectDetailsProps = {
  items?: readonly CaseStudyProjectDetail[];
  'data-testid'?: string;
};

export default function CaseStudyProjectDetails({
  items = [], 'data-testid': testId,
}: CaseStudyProjectDetailsProps) {
  const details = items.filter(({ value }) => value?.trim());
  if (!details.length) return null;

  return (
    <dl className="case-study-project-details" aria-label="Project details" data-testid={testId}>
      {details.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
