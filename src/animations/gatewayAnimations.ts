import { gsap } from 'gsap';

export function runGatewayEntrance(
  wordmark: HTMLElement,
  tagline: HTMLElement,
  leftCard: HTMLElement,
  rightCard: HTMLElement
) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .from(wordmark, { autoAlpha: 0, y: 14, duration: 0.75 })
    .from(tagline, { autoAlpha: 0, y: 10, duration: 0.6 }, '-=0.45')
    .from(leftCard, { autoAlpha: 0, x: -48, duration: 0.75 }, '-=0.35')
    .from(rightCard, { autoAlpha: 0, x: 48, duration: 0.75 }, '<');
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
