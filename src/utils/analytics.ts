export type AnalyticsEventName =
  | 'contact_cta_click'
  | 'inquiry_open'
  | 'inquiry_start'
  | 'generate_lead'
  | 'email_click'
  | 'project_view'
  | 'case_study_view'
  | 'outbound_click'
  | 'social_click';

type EventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

let leadTracked = false;
const hasGtm = Boolean(process.env.REACT_APP_GTM_ID?.trim());
const googleAdsId = process.env.REACT_APP_GOOGLE_ADS_CONVERSION_ID?.trim();
const googleAdsLabel = process.env.REACT_APP_GOOGLE_ADS_CONVERSION_LABEL?.trim();

export const trackEvent = (
  eventName: AnalyticsEventName,
  parameters: EventParameters = {}
) => {
  if (typeof window === 'undefined') return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined)
  );

  if (hasGtm && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...safeParameters });
  } else if (window.gtag) {
    window.gtag('event', eventName, safeParameters);
  }

  if (
    eventName === 'generate_lead' &&
    !hasGtm &&
    googleAdsId &&
    googleAdsLabel &&
    window.gtag
  ) {
    window.gtag('event', 'conversion', {
      send_to: `${googleAdsId}/${googleAdsLabel}`,
    });
  }

  if (eventName === 'generate_lead' && window.fbq) {
    window.fbq('track', 'Lead');
  }
};

export const trackGenerateLeadOnce = () => {
  if (leadTracked) return;
  leadTracked = true;
  trackEvent('generate_lead', { form: 'project_inquiry' });
};
