const mockTimelineInstances = [];
const mockSet = jest.fn();

function mockCreateTimeline(config = {}) {
  const timeline = {
    config,
    steps: [],
    labels: {},
    scrollTrigger: { kill: jest.fn() },
    addLabel: jest.fn(function addLabel(name, position) {
      this.labels[name] = position;
      return this;
    }),
    fromTo: jest.fn(function fromTo(target, fromVars, toVars, position) {
      this.steps.push({ type: 'fromTo', target, fromVars, toVars, position });
      return this;
    }),
    to: jest.fn(function to(target, vars, position) {
      this.steps.push({ type: 'to', target, vars, position });
      return this;
    }),
    kill: jest.fn(),
  };
  mockTimelineInstances.push(timeline);
  return timeline;
}

jest.mock('gsap', () => ({
  gsap: {
    set: (...args) => mockSet(...args),
    timeline: (config) => mockCreateTimeline(config),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: jest.fn(),
  },
}));

const {
  initGatewayIntroExperience,
  initGatewayServicesTypography,
  initPosterScroll,
  getGatewayIntroScrollDistance,
} = require('./gatewayAnimations');

beforeEach(() => {
  mockTimelineInstances.length = 0;
  mockSet.mockClear();
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});

test('gateway intro uses one pinned timeline for hero, capability words, and the real services surface', () => {
  document.body.innerHTML = `
    <section class="gateway-intro-experience">
      <div class="gateway-intro-media"></div>
      <div class="gateway-intro-shade"></div>
      <div class="gateway-intro-atmosphere"></div>
      <div class="gateway-hero-content">
        <div>Headline</div>
        <div>Paragraph</div>
        <div>Actions</div>
      </div>
      <div class="gateway-capability-stage">
        <div class="gateway-capability-word" data-direction="from-left">Websites.</div>
        <div class="gateway-capability-word" data-direction="diagonal-up-right">Apps.</div>
        <div class="gateway-capability-word" data-direction="from-right">Marketing.</div>
        <div class="gateway-capability-word" data-direction="from-left">Motion.</div>
        <div class="gateway-capability-word" data-direction="diagonal-up-left">Branding.</div>
        <div class="gateway-capability-summary"><strong>Everything Digital.</strong><span>Strategy, design, and technology—working as one.</span></div>
      </div>
    </section>
    <div class="gateway-sections"><div class="gateway-services-surface"><section id="services"><div class="services-intro">Services intro</div></section></div></div>
  `;

  const intro = document.querySelector('.gateway-intro-experience');
  const media = document.querySelector('.gateway-intro-media');
  const content = document.querySelector('.gateway-hero-content');
  const stage = document.querySelector('.gateway-capability-stage');
  const servicesSurface = document.querySelector('.gateway-services-surface');
  const servicesIntro = document.querySelector('.services-intro');
  const cleanup = initGatewayIntroExperience(intro, media, content, stage, servicesSurface);

  expect(mockTimelineInstances).toHaveLength(1);
  const timeline = mockTimelineInstances[0];
  expect(timeline.config.scrollTrigger).toMatchObject({
    trigger: intro,
    pin: true,
    pinSpacing: true,
    scrub: 0.75,
  });
  expect(timeline.config.scrollTrigger.end()).toBe(
    `+=${getGatewayIntroScrollDistance(5, false)}`
  );

  const wordEntrances = timeline.steps.filter(
    (step) => step.type === 'fromTo' && step.target.classList?.contains('gateway-capability-word')
  );
  expect(wordEntrances).toHaveLength(5);
  expect(wordEntrances.map((step) => step.position)).toEqual([
    'capability-1',
    'capability-2',
    'capability-3',
    'capability-4',
    'capability-5',
  ]);
  expect(timeline.labels['capability-1']).toBe(1.36);
  expect(timeline.labels['capability-2'] - timeline.labels['capability-1']).toBeCloseTo(1.56);
  expect(timeline.steps.some((step) => step.target.textContent === 'Everything Digital.')).toBe(true);
  expect(timeline.steps.some((step) => step.target === servicesSurface)).toBe(true);

  const conclusionSteps = timeline.steps.filter(
    (step) => step.type === 'to' && step.target.textContent === 'Everything Digital.'
  );
  const restrainedSummaryExit = conclusionSteps.find(
    (step) => step.vars.autoAlpha === 0 && step.vars.scale === 1.05
  );
  const supportExit = timeline.steps.find(
    (step) => step.target.textContent === 'Strategy, design, and technology—working as one.'
      && step.vars.autoAlpha === 0
  );
  const servicesSteps = timeline.steps.filter((step) => step.target === servicesSurface);
  const servicesPreview = servicesSteps.find((step) => step.vars.yPercent === 0);
  const brandingExit = timeline.steps.find(
    (step) => step.type === 'to'
      && step.target.textContent === 'Branding.'
      && step.vars.xPercent === 0
  );
  const servicesIntroReveal = timeline.steps.find((step) => step.target === servicesIntro);

  expect(restrainedSummaryExit).toBeDefined();
  expect(restrainedSummaryExit.vars.yPercent).toBe(-9);
  expect(restrainedSummaryExit.vars.filter).toBe('blur(1px)');
  expect(restrainedSummaryExit.vars.ease).toBe('power2.inOut');
  expect(supportExit.position).toBe(restrainedSummaryExit.position);
  expect(brandingExit).toMatchObject({
    vars: {
      xPercent: 0,
      yPercent: -5,
      scale: 1.015,
      duration: 0.72,
      ease: 'power2.inOut',
    },
  });
  expect(servicesPreview.position).toBe('services-preview');
  expect(servicesPreview.vars.duration).toBe(0.88);
  expect(servicesSteps).toHaveLength(1);
  expect(timeline.labels['services-preview']).toBeLessThan(timeline.labels['everything-digital']);
  expect(servicesIntroReveal).toMatchObject({
    vars: {
      autoAlpha: 1,
      y: 0,
      duration: 0.88,
      ease: 'power2.out',
    },
  });
  expect(servicesIntroReveal.position).toBeGreaterThan(
    timeline.labels['everything-digital']
  );

  cleanup();
  expect(timeline.kill).toHaveBeenCalled();
  expect(timeline.scrollTrigger.kill).toHaveBeenCalled();
});

test('gateway intro scroll distance reserves a viewport-sized beat for each capability', () => {
  expect(getGatewayIntroScrollDistance(5, false, 1000)).toBe(7350);
  expect(getGatewayIntroScrollDistance(6, false, 1000)).toBe(8250);
  expect(getGatewayIntroScrollDistance(5, true, 1000)).toBe(5950);
  expect(getGatewayIntroScrollDistance(6, true, 1000)).toBe(6670);
});

test('service typography uses one continuous looping timeline without repeat delays', () => {
  document.body.innerHTML = `
    <section class="gateway-services-typography">
      <div class="gateway-services-typography-track">
        <span class="gateway-service-typography-word">Apps.</span>
        <span class="gateway-service-typography-word">Web.</span>
        <span class="gateway-service-typography-word">Design.</span>
      </div>
    </section>
  `;

  const cleanup = initGatewayServicesTypography(
    document.querySelector('.gateway-services-typography')
  );

  expect(mockTimelineInstances).toHaveLength(1);
  expect(mockTimelineInstances[0].config).toMatchObject({ repeat: -1 });
  expect(mockTimelineInstances[0].config.repeatDelay).toBeUndefined();
  expect(mockTimelineInstances[0].steps).toHaveLength(9);

  cleanup();
  expect(mockTimelineInstances[0].kill).toHaveBeenCalled();
});

test('poster scroll does not pin touch layouts by default so native mobile scrolling stays available', () => {
  const hero = document.createElement('section');
  const media = document.createElement('div');
  const content = document.createElement('div');
  content.append(document.createElement('h1'));

  initPosterScroll(hero, media, content);

  expect(mockTimelineInstances).toHaveLength(1);
  expect(mockTimelineInstances[0].config.scrollTrigger).toMatchObject({
    trigger: hero,
    end: 'bottom top',
    pin: false,
    pinSpacing: false,
  });

  const animatedTargets = mockTimelineInstances[0].steps.map((step) => step.target);
  expect(animatedTargets).toContain(media);
  expect(animatedTargets).not.toContain(content.firstElementChild);
});
