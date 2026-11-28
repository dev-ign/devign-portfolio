import { useEffect, useRef, useState } from 'react';
import { mirembeCreatives } from '@/data/mirembeVisualAssets';

type Creative = (typeof mirembeCreatives)[number];

function ActiveCreative({ creative }: { creative: Creative }) {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.focus({ preventScroll: true });
    // Native controls remain the fallback if the browser declines the play request.
    if (!document.hidden) void player.play().catch(() => {});
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) player.pause();
          });
    const pauseWhenHidden = () => {
      if (document.hidden) player.pause();
    };
    observer?.observe(player);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      player.pause();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  return (
    <video
      ref={playerRef}
      title={creative.title}
      aria-label={creative.title}
      width={creative.width}
      height={creative.height}
      poster={creative.poster}
      src={creative.file}
      controls
      muted
      playsInline
      preload="none"
      disablePictureInPicture
    />
  );
}

export default function MirembeCreativeShowcase() {
  const [active, setActive] = useState<Creative['id']>();

  return (
    <div className="mirembe-creative-grid">
      {mirembeCreatives.map((creative) => (
        <article key={creative.id} className="mirembe-creative">
          <div className="mirembe-reel">
            {active === creative.id ? (
              <ActiveCreative creative={creative} />
            ) : (
              <button
                type="button"
                onClick={() => setActive(creative.id)}
                aria-label={`Play ${creative.title}`}
              >
                <img
                  src={creative.poster}
                  width={creative.width}
                  height={creative.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="mirembe-play" aria-hidden="true">
                  ▶
                </span>
              </button>
            )}
          </div>
          <div className="mirembe-creative-copy">
            <h3>{creative.title}</h3>
            <p className="case-study-editorial-label">Vertical reel · {creative.duration}</p>
            <p>{creative.description}</p>
            <details>
              <summary>Read video description</summary>
              <p>{creative.transcript}</p>
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
