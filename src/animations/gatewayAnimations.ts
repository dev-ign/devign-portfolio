import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll-driven video scrub: maps the pinned hero scroll range to full video duration.
// Uses one ScrollTrigger timeline so video time, parallax movement, and fade stay
// locked to the same scroll progress.
export function initVideoScrub(
  heroEl: HTMLElement,
  videoEl: HTMLVideoElement,
  mediaEl: HTMLElement,
  contentEl?: HTMLElement,
  nextSectionEl?: HTMLElement
): () => void {
  const proxy = { currentTime: 0 };
  let timeline: gsap.core.Timeline | null = null;

  const setup = () => {
    if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;

    videoEl.pause();
    videoEl.currentTime = 0.001;

    gsap.set(mediaEl, {
      autoAlpha: 1,
      scale: 1.08,
      yPercent: 0,
      force3D: true,
      transformOrigin: '50% 50%',
      willChange: 'transform, opacity',
    });

    if (contentEl) {
      gsap.set(contentEl, {
        autoAlpha: 1,
        yPercent: 0,
        force3D: true,
      });
    }

    if (nextSectionEl) {
      gsap.set(nextSectionEl, {
        y: '10vh',
        force3D: true,
        willChange: 'transform',
      });
    }

    timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: '+=140%',
        scrub: 0.45,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const contentTargets = contentEl ? Array.from(contentEl.children) : [];

    timeline
      .to(proxy, {
        currentTime: Math.max(videoEl.duration - 0.04, 0),
        onUpdate() {
          const nextTime = proxy.currentTime;
          if (Math.abs(videoEl.currentTime - nextTime) > 0.015) {
            videoEl.currentTime = nextTime;
          }
        },
      }, 0)
      .to(mediaEl, {
        yPercent: -9,
        scale: 1.01,
        autoAlpha: 0,
        duration: 0.52,
      }, 0);

    if (contentTargets.length) {
      timeline.to(contentTargets, {
        autoAlpha: 0,
        y: -22,
        stagger: 0.05,
        duration: 0.32,
        ease: 'power2.inOut',
      }, 0.62);
    }

    if (nextSectionEl) {
      timeline.to(nextSectionEl, {
        y: 0,
        duration: 0.58,
        ease: 'power2.out',
      }, 0);
    }

    ScrollTrigger.refresh();
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const onCanPlay = () => {
    if (timeline) return;
    setup();
  };

  const onError = () => {
    gsap.set(mediaEl, {
      autoAlpha: 0,
    });
  };

  videoEl.addEventListener('canplaythrough', onCanPlay, { once: true });
  videoEl.addEventListener('error', onError);

  if (videoEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
    setup();
    if (videoEl.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
      videoEl.load();
    }
  } else {
    videoEl.addEventListener('loadedmetadata', setup, { once: true });
    videoEl.load();
  }

  return () => {
    videoEl.removeEventListener('loadedmetadata', setup);
    videoEl.removeEventListener('canplaythrough', onCanPlay);
    videoEl.removeEventListener('error', onError);
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
  };
}

export function runGatewayEntrance(contentEl: HTMLElement) {
  const targets = Array.from(contentEl.children);
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  gsap.set(targets, {
    autoAlpha: 0,
    y: 24,
    willChange: 'transform, opacity',
  });
  tl.fromTo(
    targets,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.78,
      clearProps: 'willChange',
    }
  );
  return tl;
}

// Returns a cleanup function. Uses gsap.quickTo for smooth orb interpolation —
// the orb follows cursor lag rather than snapping, giving a fluid liquid feel.
export function attachOrbHover(card: HTMLElement, orb: HTMLElement) {
  const xTo = gsap.quickTo(orb, 'x', { duration: 0.8, ease: 'power3.out' });
  const yTo = gsap.quickTo(orb, 'y', { duration: 0.8, ease: 'power3.out' });

  const onMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    xTo(e.clientX - rect.left - rect.width / 2);
    yTo(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);

  return () => {
    card.removeEventListener('mousemove', onMove);
    card.removeEventListener('mouseleave', onLeave);
  };
}
