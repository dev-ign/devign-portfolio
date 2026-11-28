import { useLayoutEffect, useRef, useState } from 'react';
import { mirembeServices } from '@/data/mirembeCleaningCaseStudy';

type Service = (typeof mirembeServices)[number];

export default function MirembeServiceJourney() {
  const [service, setService] = useState<Service | null>(null);
  const [request, setRequest] = useState<Service | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const lastService = useRef<string | null>(null);
  const requestHeading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const panel = dialog.current;
    if (!service || !panel) return;

    panel.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      panel.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [service]);

  useLayoutEffect(() => {
    if (request) requestHeading.current?.focus();
    else if (!service && lastService.current)
      triggers.current.get(lastService.current)?.focus({ preventScroll: true });
  }, [request, service]);

  return (
    <div className="mirembe-journey" aria-label="Service discovery walkthrough">
      <div className="mirembe-demo-bar">
        <span>Service discovery walkthrough</span>
        <span>Portfolio demo</span>
      </div>
      <div className="mirembe-demo-content">
        {request ? (
          <div className="mirembe-demo-request">
            <h4 ref={requestHeading} tabIndex={-1}>
              Request a Cleaning
            </h4>
            <p>
              You explored <strong>{request.name}</strong>. On Mirembe’s site, the next step opens a
              booking form where customers can describe their home and request a date.
            </p>
            <button className="mirembe-action" type="button" onClick={() => setRequest(null)}>
              Back to services
            </button>
          </div>
        ) : (
          <div className="mirembe-service-options">
            {mirembeServices.map((option) => (
              <button
                className="mirembe-service-option"
                key={option.name}
                ref={(button) => {
                  if (button) triggers.current.set(option.name, button);
                  else triggers.current.delete(option.name);
                }}
                type="button"
                aria-haspopup="dialog"
                aria-label={`See what’s included in ${option.name}`}
                onClick={() => {
                  lastService.current = option.name;
                  setService(option);
                }}
              >
                <img
                  src={option.image}
                  alt=""
                  width={480}
                  height={320}
                  loading="lazy"
                  decoding="async"
                />
                <span className="mirembe-service-text">
                  <strong>{option.name}</strong>
                  <span>{option.summary}</span>
                  <span className="mirembe-service-open">
                    What’s included <span aria-hidden="true">→</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {service && (
        <dialog
          ref={dialog}
          className="mirembe-service-dialog"
          aria-labelledby="mirembe-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            setService(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setService(null);
          }}
        >
          <div className="mirembe-service-dialog-inner">
            <div className="mirembe-dialog-top">
              <p className="case-study-editorial-label">Service details</p>
              <button
                ref={closeButton}
                type="button"
                aria-label="Close service details"
                onClick={() => setService(null)}
              >
                ×
              </button>
            </div>
            <h3 id="mirembe-dialog-title">{service.name}</h3>
            <p>{service.summary}</p>
            <h4>Selected inclusions</h4>
            <ul>
              {service.inclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              className="mirembe-action mirembe-action--filled"
              type="button"
              onClick={() => {
                setRequest(service);
                setService(null);
              }}
            >
              Preview booking handoff <span aria-hidden="true">→</span>
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
