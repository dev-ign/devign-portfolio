import type { InquiryFormData } from './inquiryFormEmail';

export type InquirySubmissionResult =
  | { ok: true }
  | { ok: false; message: string };

export const submitInquiry = async (
  formData: InquiryFormData,
  resourceFiles: File[]
): Promise<InquirySubmissionResult> => {
  const payload = new FormData();

  payload.append('name', formData.name.trim());
  payload.append('email', formData.email.trim());
  payload.append('businessName', formData.businessName.trim());
  payload.append('website', formData.website.trim());
  payload.append('projectTypes', JSON.stringify(formData.projectTypes));
  payload.append('budget', formData.budget);
  payload.append('timeline', formData.timeline);
  payload.append('details', formData.details.trim());

  resourceFiles.forEach(file => {
    payload.append('assets', file, file.name);
  });

  const response = await fetch('/api/inquiry', {
    method: 'POST',
    body: payload,
  });

  let data: { error?: string } = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      message: data.error || 'Your inquiry could not be sent right now. Please try again in a moment.',
    };
  }

  return { ok: true };
};
