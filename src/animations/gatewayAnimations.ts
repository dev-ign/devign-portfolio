import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrubOptions {
  end?: string;
  pin?: boolean;
  pinSpacing?: boolean;
  mediaFadeStart?: number;
  mediaFadeDuration?: number;
  mediaYPercent?: number;
  mediaStartScale?: number;
  mediaEndScale?: number;
  contentExitAt?: number;
  contentExitY?: number;
}

// Scroll-driven video scrub: maps the pinned hero scroll range to full video duration.
// Uses one ScrollTrigger timeline so video time, parallax movement, and fade stay
// locked to the same scroll progress.
export function initVideoScrub(
  heroEl: HTMLElement,
  videoEl: HTMLVideoElement,
  mediaEl: HTMLElement,
  contentEl?: HTMLElement,
  options: ScrubOptions = {}
): () => void {
  const proxy = { currentTime: 0 };
  let timeline: gsap.core.Timeline | null = null;

  const setup = () => {
    if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;

    const end = options.end ?? '+=170%';
    const pin = options.pin ?? true;
    const pinSpacing = options.pinSpacing ?? true;
    const mediaFadeStart = options.mediaFadeStart ?? 0.68;
    const mediaFadeDuration = options.mediaFadeDuration ?? 0.32;
    const mediaYPercent = options.mediaYPercent ?? -9;
    const mediaStartScale = options.mediaStartScale ?? 1.08;
    const mediaEndScale = options.mediaEndScale ?? 1.01;
    const contentExitAt = options.contentExitAt ?? 0.74;
    const contentExitY = options.contentExitY ?? -42;

    videoEl.pause();
    videoEl.currentTime = 0.001;

    gsap.set(mediaEl, {
      autoAlpha: 1,
      scale: mediaStartScale,
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

    timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end,
        scrub: 0.65,
        pin,
        pinSpacing,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10,
      },
    });

    const contentTargets = contentEl ? Array.from(contentEl.children) : [];

    timeline
      .to(proxy, {
        duration: 1,
        currentTime: Math.max(videoEl.duration - 0.04, 0),
        onUpdate() {
          const nextTime = proxy.currentTime;
          if (Math.abs(videoEl.currentTime - nextTime) > 0.015) {
            videoEl.currentTime = nextTime;
          }
        },
      }, 0)
      .to(mediaEl, {
        yPercent: mediaYPercent,
        scale: mediaEndScale,
        duration: 1,
      }, 0)
      .to(mediaEl, {
        autoAlpha: 0,
        duration: mediaFadeDuration,
        ease: 'power2.inOut',
      }, mediaFadeStart);

    if (contentTargets.length) {
      timeline.to(contentTargets, {
        autoAlpha: 0,
        y: contentExitY,
        stagger: 0.04,
        duration: 0.18,
        ease: 'power2.inOut',
      }, contentExitAt);
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

// Poster-image scroll animation for touch/tablet devices.
// Mirrors initVideoScrub's timeline structure and pacing without any video API.
export function initPosterScroll(
  heroEl: HTMLElement,
  mediaEl: HTMLElement,
  contentEl?: HTMLElement,
  options: ScrubOptions = {}
): () => void {
  // Touch devices use the document's native flow. Moving the following section
  // with transforms makes its visual position diverge from its layout position,
  // which creates seams and stale ScrollTrigger measurements on mobile Safari.
  const end = options.end ?? 'bottom top';
  const mediaFadeStart = options.mediaFadeStart ?? 0.12;
  const mediaFadeDuration = options.mediaFadeDuration ?? 0.7;
  const mediaYPercent = options.mediaYPercent ?? -4;
  const mediaStartScale = options.mediaStartScale ?? 1.04;
  const mediaEndScale = options.mediaEndScale ?? 1;

  gsap.set(mediaEl, {
    autoAlpha: 1,
    scale: mediaStartScale,
    yPercent: 0,
    force3D: true,
    transformOrigin: '50% 50%',
    willChange: 'transform, opacity',
  });

  if (contentEl) {
    // Keep hero copy readable over the dark canvas as the poster fades away.
    gsap.set(contentEl, { autoAlpha: 1, y: 0, yPercent: 0, force3D: true });
  }

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: heroEl,
      start: 'top top',
      end,
      scrub: 0.28,
      pin: false,
      pinSpacing: false,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .to(mediaEl, { yPercent: mediaYPercent, scale: mediaEndScale, duration: 1 }, 0)
    .to(mediaEl, {
      autoAlpha: 0,
      duration: mediaFadeDuration,
      ease: 'power2.inOut',
    }, mediaFadeStart);

  ScrollTrigger.refresh();
  window.requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
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

export function initPosterParallax(sectionEl: HTMLElement, mediaEl: HTMLElement): () => void {
  gsap.set(mediaEl, {
    autoAlpha: 1,
    scale: 1.1,
    yPercent: 7,
    force3D: true,
    transformOrigin: '50% 50%',
    willChange: 'transform',
  });

  const tween = gsap.to(mediaEl, {
    yPercent: -7,
    scale: 1.03,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.75,
      invalidateOnRefresh: true,
    },
  });

  ScrollTrigger.refresh();
  window.requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function initGatewayServicesTypography(containerEl: HTMLElement): () => void {
  const track = containerEl.querySelector<HTMLElement>('.gateway-services-typography-track');
  const words = Array.from(containerEl.querySelectorAll<HTMLElement>('.gateway-service-typography-word'));

  if (!track || words.length === 0) return () => undefined;

  const fadeInDuration = 0.8;
  const visibleDuration = 4;
  const fadeOutDuration = 0.6;
  const wordDuration = fadeInDuration + visibleDuration + fadeOutDuration;
  const peakOpacity = 0.1;
  const getStartX = () => Math.min(window.innerWidth * 0.18, 96);
  const getExitX = () => -Math.min(window.innerWidth * 0.28, 150);

  gsap.set(track, {
    x: 0,
    force3D: true,
    willChange: 'transform',
  });

  gsap.set(words, {
    autoAlpha: 0,
    x: getStartX,
    force3D: true,
    willChange: 'transform, opacity',
  });

  const timeline = gsap.timeline({ repeat: -1 });

  words.forEach((word, index) => {
    const start = index * wordDuration;

    timeline.fromTo(
      word,
      { x: getStartX },
      { x: getExitX, duration: wordDuration, ease: 'none' },
      start
    );
    timeline.to(word, {
      autoAlpha: peakOpacity,
      duration: fadeInDuration,
      ease: 'power2.out',
    }, start);
    timeline.to(word, {
      autoAlpha: 0,
      duration: fadeOutDuration,
      ease: 'power3.in',
    }, start + fadeInDuration + visibleDuration);
  });

  return () => {
    timeline.kill();
    gsap.set(track, { clearProps: 'all' });
    gsap.set(words, { clearProps: 'all' });
  };
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
