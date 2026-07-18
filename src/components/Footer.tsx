import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import {
  footerNavigation,
  footerServices,
  siteConfig,
  socialLinks,
} from '@/config/site';
import { trackEvent } from '@/utils/analytics';

type FooterProps = {
  onScrollTo: (id: string) => void;
};

const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    event.preventDefault();
    onScrollTo(target);
    window.history.replaceState(null, '', target === 'top' ? '/' : `#${target}`);
  };

  return (
    <footer className="relative overflow-hidden bg-gateway px-[clamp(20px,6vw,88px)] pb-7 pt-[clamp(72px,10vw,128px)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] [background:radial-gradient(ellipse_64%_46%_at_50%_0%,rgba(190,151,237,0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid gap-12 pb-[clamp(64px,8vw,96px)] sm:grid-cols-2 lg:grid-cols-[minmax(280px,1.6fr)_minmax(130px,0.65fr)_minmax(180px,0.8fr)_minmax(260px,1fr)] lg:gap-[clamp(36px,5vw,76px)]">
          <div>
            <a
              href="#top"
              onClick={event => handleSectionClick(event, 'top')}
              aria-label="DevignUX home"
              className="inline-flex min-h-11 items-center rounded-sm no-underline"
            >
              <BrandLogo markSize={30} textSize={16} gap={9} />
            </a>
            <p className="mb-0 mt-7 max-w-[390px] font-body text-[clamp(14px,1.2vw,16px)] font-light leading-[1.75] text-white/48">
              Thoughtful design, modern development, and creative production for businesses building a stronger digital presence.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-white/32">
              Navigate
            </h2>
            <ul className="m-0 list-none p-0">
              {footerNavigation.map(item => (
                <li key={item.target}>
                  <a
                    href={item.target === 'top' ? '/' : `#${item.target}`}
                    onClick={event => handleSectionClick(event, item.target)}
                    className="inline-flex min-h-10 items-center font-body text-[14px] font-light text-white/62 no-underline transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-services-title">
            <h2 id="footer-services-title" className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-white/32">
              Services
            </h2>
            <ul className="m-0 list-none p-0">
              {footerServices.map(service => (
                <li key={service} className="flex min-h-10 items-center font-body text-[14px] font-light text-white/52">
                  {service}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title" className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-white/32">
              Contact
            </h2>
            <address className="not-italic">
              <a
                href={`mailto:${siteConfig.publicEmail}`}
                onClick={() => trackEvent('email_click', { email_type: 'general' })}
                className="break-all font-body text-[clamp(17px,1.55vw,21px)] font-medium text-white/88 underline decoration-white/18 underline-offset-[7px] transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-white/60"
              >
                {siteConfig.publicEmail}
              </a>
              <p className="mb-0 mt-7 max-w-[300px] font-body text-[14px] font-light leading-[1.7] text-white/48">
                Working remotely with clients worldwide.
                <br />
                Available for select projects and ongoing partnerships.
              </p>
            </address>

            {socialLinks.length > 0 && (
              <nav aria-label="Social links" className="mt-6 flex flex-wrap gap-5">
                {socialLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.accessibleLabel} (opens in a new tab)`}
                    onClick={() => trackEvent('social_click', { platform: link.label.toLowerCase() })}
                    className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.12em] text-white/48 no-underline transition-colors duration-200 hover:text-white"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </nav>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/8 pt-6 font-mono text-[9px] uppercase tracking-[0.1em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-5">
            <span>© 2026 DevignUX. All rights reserved.</span>
            <span>Designed and developed by DevignUX.</span>
          </div>
          <a
            href="#top"
            onClick={event => handleSectionClick(event, 'top')}
            aria-label="Back to top"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-white/42 no-underline transition-colors duration-200 hover:text-white"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
