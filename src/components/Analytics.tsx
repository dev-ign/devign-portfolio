import { useEffect } from 'react';

const GTM_ID = process.env.REACT_APP_GTM_ID?.trim();
const GA4_ID = process.env.REACT_APP_GA4_MEASUREMENT_ID?.trim();
const GOOGLE_ADS_ID = process.env.REACT_APP_GOOGLE_ADS_CONVERSION_ID?.trim();
const META_PIXEL_ID = process.env.REACT_APP_META_PIXEL_ID?.trim();
const CLARITY_ID = process.env.REACT_APP_CLARITY_PROJECT_ID?.trim();

const appendScript = (id: string, src?: string, content?: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  if (src) {
    script.src = src;
    script.async = true;
  }
  if (content) script.text = content;
  document.head.appendChild(script);
};

const Analytics = () => {
  useEffect(() => {
    if (GTM_ID) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': Date.now(),
        event: 'gtm.js',
      });
      appendScript(
        'devignux-gtm',
        `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
      );
      return;
    }

    const googleDestination = GA4_ID || GOOGLE_ADS_ID;
    if (googleDestination) {
      appendScript(
        'devignux-google-tag',
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleDestination)}`
      );
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag('js', new Date());
      if (GA4_ID) window.gtag('config', GA4_ID);
      if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID);
    }

    if (META_PIXEL_ID) {
      appendScript(
        'devignux-meta-pixel',
        undefined,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
          `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
          `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
          `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}` +
          `(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
          `fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`
      );
    }

    if (CLARITY_ID) {
      appendScript(
        'devignux-clarity',
        undefined,
        `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[])` +
          `.push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;` +
          `y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);` +
          `})(window,document,'clarity','script','${CLARITY_ID}');`
      );
    }
  }, []);

  return null;
};

export default Analytics;
