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
  nextSectionStartY?: string;
  nextSectionEndY?: string;
}

// Scroll-driven video scrub: maps the pinned hero scroll range to full video duration.
// Uses one ScrollTrigger timeline so video time, parallax movement, and fade stay
// locked to the same scroll progress.
export function initVideoScrub(
  heroEl: HTMLElement,
  videoEl: HTMLVideoElement,
  mediaEl: HTMLElement,
  contentEl?: HTMLElement,
  nextSectionEl?: HTMLElement,
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
    const mediaFadeDuration = options.mediaFadeDuration ?? 0.36;
    const mediaYPercent = options.mediaYPercent ?? -9;
    const mediaStartScale = options.mediaStartScale ?? 1.08;
    const mediaEndScale = options.mediaEndScale ?? 1.01;
    const contentExitAt = options.contentExitAt ?? 0.96;
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

    if (nextSectionEl) {
      gsap.set(nextSectionEl, {
        y: options.nextSectionStartY ?? '18vh',
        force3D: true,
        willChange: 'transform',
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
      },
    });

    const contentTargets = contentEl ? Array.from(contentEl.children) : [];

    timeline
      .to(proxy, {
        duration: 0.95,
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
        duration: 0.95,
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
        stagger: 0.08,
        duration: 0.52,
        ease: 'power2.inOut',
      }, contentExitAt);
    }

    if (nextSectionEl) {
      timeline.to(nextSectionEl, {
        y: options.nextSectionEndY ?? '-62vh',
        duration: 0.9,
        ease: 'power2.out',
      }, 1.12);
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
  nextSectionEl?: HTMLElement,
  options: ScrubOptions = {}
): () => void {
  const end = options.end ?? '+=170%';
  const pin = options.pin ?? true;
  const pinSpacing = options.pinSpacing ?? true;
  const mediaFadeStart = options.mediaFadeStart ?? 0.68;
  const mediaFadeDuration = options.mediaFadeDuration ?? 0.36;
  const mediaYPercent = options.mediaYPercent ?? -9;
  const mediaStartScale = options.mediaStartScale ?? 1.05;
  const mediaEndScale = options.mediaEndScale ?? 1;
  const contentExitAt = options.contentExitAt ?? 0.96;
  const contentExitY = options.contentExitY ?? -42;

  gsap.set(mediaEl, {
    autoAlpha: 1,
    scale: mediaStartScale,
    yPercent: 0,
    force3D: true,
    transformOrigin: '50% 50%',
    willChange: 'transform, opacity',
  });

  if (contentEl) {
    gsap.set(contentEl, { autoAlpha: 1, yPercent: 0, force3D: true });
  }

  if (nextSectionEl) {
    gsap.set(nextSectionEl, {
      y: options.nextSectionStartY ?? '18vh',
      force3D: true,
      willChange: 'transform',
    });
  }

  const timeline = gsap.timeline({
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
    },
  });

  const contentTargets = contentEl ? Array.from(contentEl.children) : [];

  timeline
    .to(mediaEl, { yPercent: mediaYPercent, scale: mediaEndScale, duration: 0.95 }, 0)
    .to(mediaEl, {
      autoAlpha: 0,
      duration: mediaFadeDuration,
      ease: 'power2.inOut',
    }, mediaFadeStart);

  if (contentTargets.length) {
    timeline.to(contentTargets, {
      autoAlpha: 0,
      y: contentExitY,
      stagger: 0.08,
      duration: 0.52,
      ease: 'power2.inOut',
    }, contentExitAt);
  }

  if (nextSectionEl) {
    timeline.to(nextSectionEl, {
      y: options.nextSectionEndY ?? '-62vh',
      duration: 0.9,
      ease: 'power2.out',
    }, 1.12);
  }

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

export function initScrollRevealEntrance(triggerEl: HTMLElement, contentEl: HTMLElement): () => void {
  const targets = Array.from(contentEl.children);

  gsap.set(targets, {
    autoAlpha: 0,
    y: 18,
    willChange: 'transform, opacity',
  });

  const trigger = ScrollTrigger.create({
    trigger: triggerEl,
    start: 'top 72%',
    once: true,
    onEnter: () => {
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.72,
        ease: 'power3.out',
        clearProps: 'willChange',
      });
    },
  });

  ScrollTrigger.refresh();

  return () => {
    trigger.kill();
    gsap.killTweensOf(targets);
  };
}

export function initPosterParallax(sectionEl: HTMLElement, mediaEl: HTMLElement): () => void {
  gsap.set(mediaEl, {
    autoAlpha: 1,
    scale: 1.08,
    yPercent: 4,
    force3D: true,
    transformOrigin: '50% 50%',
    willChange: 'transform',
  });

  const tween = gsap.to(mediaEl, {
    yPercent: -4,
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

  const enterDuration = 0.8;
  const driftDuration = 4;
  const exitDuration = 0.6;
  const pauseDuration = 0.3;
  const wordDuration = enterDuration + driftDuration + exitDuration + pauseDuration;
  const cycleDuration = wordDuration * words.length;
  const peakOpacity = 0.1;
  const getStartX = () => Math.min(window.innerWidth * 0.18, 96);
  const getDriftX = () => -Math.min(window.innerWidth * 0.1, 48);
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

  const timelines = words.map((word, index) => {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: cycleDuration - wordDuration,
      delay: index * wordDuration,
    });

    tl.fromTo(
      word,
      { x: getStartX, autoAlpha: 0 },
      { x: 0, autoAlpha: peakOpacity, duration: enterDuration, ease: 'power3.out' },
      0
    );
    tl.to(word, {
      x: getDriftX,
      autoAlpha: peakOpacity,
      duration: driftDuration,
      ease: 'none',
    });
    tl.to(word, {
      x: getExitX,
      autoAlpha: 0,
      duration: exitDuration,
      ease: 'power3.in',
    });
    tl.to(word, { autoAlpha: 0, duration: pauseDuration, ease: 'none' });

    return tl;
  });

  return () => {
    timelines.forEach((timeline) => timeline.kill());
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
