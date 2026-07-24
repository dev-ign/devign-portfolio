import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/utils/deviceDetect';

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
  if (prefersReducedMotion()) {
    gsap.set([mediaEl, contentEl].filter(Boolean), { clearProps: 'all', autoAlpha: 1 });
    return () => undefined;
  }

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
  if (prefersReducedMotion()) {
    gsap.set([mediaEl, contentEl].filter(Boolean), { clearProps: 'all', autoAlpha: 1 });
    return () => undefined;
  }

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

type CapabilityDirection =
  | 'from-left'
  | 'from-right'
  | 'diagonal-up-right'
  | 'diagonal-up-left';

interface CapabilityMotion {
  startX: number;
  startY: number;
  exitX: number;
  exitY: number;
}

const getCapabilityMotion = (direction: CapabilityDirection): CapabilityMotion => {
  switch (direction) {
    case 'from-right':
      return { startX: 62, startY: 2, exitX: -74, exitY: -5 };
    case 'diagonal-up-right':
      return { startX: -56, startY: 9, exitX: 68, exitY: -10 };
    case 'diagonal-up-left':
      return { startX: 56, startY: 9, exitX: -68, exitY: -10 };
    case 'from-left':
    default:
      return { startX: -62, startY: 3, exitX: 74, exitY: -6 };
  }
};

// Master homepage introduction. One pinned ScrollTrigger owns the complete
// hero → capability words → real Services surface sequence, preventing seams between
// separately-timed sections while keeping Lenis synchronization global.
export function initGatewayIntroExperience(
  introEl: HTMLElement,
  mediaEl: HTMLElement,
  contentEl: HTMLElement,
  capabilityStageEl: HTMLElement,
  servicesSurfaceEl: HTMLElement,
  videoEl?: HTMLVideoElement
): () => void {
  const shade = introEl.querySelector<HTMLElement>('.gateway-intro-shade');
  const atmosphere = introEl.querySelector<HTMLElement>('.gateway-intro-atmosphere');
  const summary = capabilityStageEl.querySelector<HTMLElement>('.gateway-capability-summary');
  const summaryTitle = summary?.querySelector<HTMLElement>('strong');
  const summarySupport = summary?.querySelector<HTMLElement>('span');
  const sectionsEl = servicesSurfaceEl.closest<HTMLElement>('.gateway-sections');
  const allWords = Array.from(
    capabilityStageEl.querySelectorAll<HTMLElement>('.gateway-capability-word')
  );

  if (!shade || !atmosphere || !summary || !summaryTitle || !summarySupport || !sectionsEl || allWords.length === 0) {
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    gsap.set([mediaEl, contentEl, capabilityStageEl, sectionsEl, servicesSurfaceEl], { clearProps: 'all', autoAlpha: 1 });
    return () => undefined;
  }

  let timeline: gsap.core.Timeline | null = null;
  let disposed = false;
  const proxy = { currentTime: 0 };

  const setup = () => {
    if (timeline || disposed) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const words = allWords.filter(
      word => !(mobile && word.dataset.mobileHidden === 'true')
    );
    const contentTargets = Array.from(contentEl.children) as HTMLElement[];
    const headline = contentTargets[0];
    const earlyExitTargets = contentTargets.slice(1);
    const entranceBlur = mobile ? 4 : 5;
    const exitBlur = mobile ? 5 : 6;
    const wordStart = 0.72;
    const wordStep = mobile ? 0.68 : 0.56;
    const approachDuration = mobile ? 0.4 : 0.38;
    const readableHold = mobile ? 0.12 : 0;
    const exitDuration = mobile ? 0.42 : 0.4;
    const summaryStart = wordStart
      + Math.max(0, words.length - 1) * wordStep
      + approachDuration
      + readableHold
      + exitDuration;
    const scaleStart = summaryStart + 1.06;
    const scaleDuration = mobile ? 2.25 : 2.45;
    const servicesStart = scaleStart + (mobile ? 0.72 : 0.82);
    const serviceRiseDuration = mobile ? 1.8 : 2;
    const titleAtmosphereStart = scaleStart + (mobile ? 1.45 : 1.38);
    const titleAtmosphereDuration = scaleDuration - (titleAtmosphereStart - scaleStart);
    const videoDuration = videoEl && Number.isFinite(videoEl.duration)
      ? Math.max(videoEl.duration - 0.04, 0)
      : 0;

    if (videoEl && videoDuration > 0) {
      videoEl.pause();
      videoEl.currentTime = 0.001;
    }

    gsap.set(mediaEl, {
      autoAlpha: 1,
      scale: mobile ? 1.04 : 1.08,
      yPercent: 0,
      force3D: true,
      transformOrigin: '50% 50%',
      willChange: 'transform, opacity',
    });
    gsap.set(shade, { autoAlpha: 0.16 });
    gsap.set(atmosphere, { autoAlpha: 0.12 });
    gsap.set(contentTargets, {
      autoAlpha: 1,
      y: 0,
      yPercent: 0,
      force3D: true,
      willChange: 'transform, opacity',
    });
    gsap.set(allWords, {
      autoAlpha: 0,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      filter: 'blur(0px)',
      force3D: true,
      willChange: 'transform, opacity, filter',
    });
    gsap.set(summary, { autoAlpha: 1 });
    gsap.set(summaryTitle, {
      autoAlpha: 0,
      yPercent: 0,
      scale: 0.96,
      filter: 'blur(5px)',
      transformOrigin: '50% 55%',
      force3D: true,
      willChange: 'transform, opacity, filter',
    });
    gsap.set(summarySupport, { autoAlpha: 0, y: 10 });
    gsap.set(servicesSurfaceEl, {
      autoAlpha: 1,
      yPercent: mobile ? 28 : 35,
      force3D: true,
      willChange: 'transform',
    });

    timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: introEl,
        start: 'top top',
        end: () => mobile ? '+=230%' : '+=300%',
        scrub: mobile ? 0.38 : 0.75,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10,
      },
    });
    gsap.set(sectionsEl, { autoAlpha: 1 });

    if (videoEl && videoDuration > 0) {
      timeline.to(proxy, {
        currentTime: videoDuration,
        duration: scaleStart,
        onUpdate() {
          const nextTime = proxy.currentTime;
          if (Math.abs(videoEl.currentTime - nextTime) > 0.015) {
            videoEl.currentTime = nextTime;
          }
        },
      }, 0);
    }

    timeline
      .to(mediaEl, {
        yPercent: mobile ? -4 : -8,
        scale: 1.01,
        duration: scaleStart,
      }, 0)
      .fromTo(earlyExitTargets, {
        autoAlpha: 1,
        y: 0,
      }, {
        autoAlpha: 0,
        y: mobile ? -16 : -24,
        duration: 0.5,
        stagger: 0.035,
        ease: 'power2.inOut',
        immediateRender: false,
      }, 0.28)
      .fromTo(headline, {
        autoAlpha: 1,
        y: 0,
      }, {
        autoAlpha: 0,
        y: mobile ? -28 : -46,
        duration: 0.92,
        ease: 'power2.inOut',
        immediateRender: false,
      }, 0.42)
      .to(shade, {
        autoAlpha: 0.46,
        duration: Math.max(1.2, summaryStart - 2.65),
        ease: 'power2.inOut',
      }, 2)
      .to(shade, {
        autoAlpha: 0.92,
        duration: 0.92,
        ease: 'power2.inOut',
      }, summaryStart - 0.65)
      .to(atmosphere, {
        autoAlpha: 0.78,
        duration: Math.max(1.4, summaryStart - 2.5),
        ease: 'power2.out',
      }, 1.85)
      .to(atmosphere, {
        autoAlpha: 0.94,
        duration: 0.8,
        ease: 'power1.out',
      }, summaryStart - 0.5)
      .to(mediaEl, {
        autoAlpha: 0.66,
        duration: Math.max(1.2, summaryStart - 2.65),
        ease: 'power2.inOut',
      }, 2)
      .to(mediaEl, {
        autoAlpha: 0.08,
        duration: 0.92,
        ease: 'power2.inOut',
      }, summaryStart - 0.65);

    words.forEach((word, index) => {
      const direction = (word.dataset.direction ?? 'from-left') as CapabilityDirection;
      const motion = getCapabilityMotion(direction);
      const start = wordStart + index * wordStep;

      timeline!
        .fromTo(
          word,
          {
            xPercent: mobile ? Math.sign(motion.startX) * 32 : motion.startX,
            yPercent: mobile ? Math.sign(motion.startY) * 3 : motion.startY,
            scale: mobile ? 1.018 : 1.025,
            autoAlpha: 0,
            filter: `blur(${entranceBlur}px)`,
          },
          {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: approachDuration,
            ease: 'power2.out',
          },
          start
        )
        .to(word, {
          xPercent: mobile ? Math.sign(motion.exitX) * 38 : motion.exitX,
          yPercent: mobile ? Math.sign(motion.exitY) * 4 : motion.exitY,
          scale: mobile ? 1.025 : 1.035,
          filter: `blur(${exitBlur}px)`,
          duration: exitDuration,
          ease: 'power3.in',
        }, start + approachDuration + readableHold)
        .to(word, {
          autoAlpha: 0,
          duration: 0.28,
          ease: 'power1.in',
        }, start + approachDuration + readableHold);
    });

    timeline
      .to(summaryTitle, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.56,
        ease: 'power2.out',
      }, summaryStart)
      .to(summarySupport, {
        autoAlpha: 0.68,
        y: 0,
        duration: 0.38,
        ease: 'power2.out',
      }, summaryStart + 0.34)
      .to(summarySupport, {
        autoAlpha: 0,
        y: -8,
        duration: 0.36,
        ease: 'power1.in',
      }, scaleStart + 0.24)
      .to(summaryTitle, {
        yPercent: mobile ? -16 : -22,
        scale: mobile ? 2.9 : 4.2,
        duration: scaleDuration,
        ease: 'power1.in',
      }, scaleStart)
      .to(summaryTitle, {
        autoAlpha: 0,
        filter: 'blur(1.1px)',
        duration: titleAtmosphereDuration,
        ease: 'power2.out',
      }, titleAtmosphereStart)
      .to(servicesSurfaceEl, {
        yPercent: 0,
        duration: serviceRiseDuration,
        ease: 'none',
      }, servicesStart);

    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    window.requestAnimationFrame(refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
  };

  const onMetadata = () => setup();
  const onVideoError = () => setup();

  if (videoEl && videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
    videoEl.addEventListener('loadedmetadata', onMetadata, { once: true });
    videoEl.addEventListener('error', onVideoError, { once: true });
    videoEl.load();
  } else {
    setup();
  }

  return () => {
    disposed = true;
    videoEl?.removeEventListener('loadedmetadata', onMetadata);
    videoEl?.removeEventListener('error', onVideoError);
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    gsap.set(
      [mediaEl, contentEl, shade, atmosphere, ...allWords, summary, summaryTitle, summarySupport, sectionsEl, servicesSurfaceEl],
      { clearProps: 'all' }
    );
  };
}

export function runGatewayEntrance(contentEl: HTMLElement) {
  const targets = Array.from(contentEl.children);
  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: 'all', autoAlpha: 1, y: 0 });
    return gsap.timeline();
  }
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
  if (prefersReducedMotion()) {
    gsap.set(mediaEl, { clearProps: 'all', autoAlpha: 1 });
    return () => undefined;
  }

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
  if (prefersReducedMotion()) {
    gsap.set([track, ...words], { clearProps: 'all' });
    return () => undefined;
  }

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
  if (prefersReducedMotion()) return () => undefined;
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
