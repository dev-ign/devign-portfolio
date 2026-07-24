const mockTimelineInstances = [];
const mockSet = jest.fn();

function mockCreateTimeline(config = {}) {
  const timeline = {
    config,
    steps: [],
    scrollTrigger: { kill: jest.fn() },
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
        <div class="gateway-capability-word" data-direction="from-right">Products.</div>
        <div class="gateway-capability-word" data-direction="diagonal-up-right">Apps.</div>
        <div class="gateway-capability-summary"><strong>Everything Digital.</strong><span>Built.</span></div>
      </div>
    </section>
    <div class="gateway-sections"><div class="gateway-services-surface"><section id="services">Services</section></div></div>
  `;

  const intro = document.querySelector('.gateway-intro-experience');
  const media = document.querySelector('.gateway-intro-media');
  const content = document.querySelector('.gateway-hero-content');
  const stage = document.querySelector('.gateway-capability-stage');
  const servicesSurface = document.querySelector('.gateway-services-surface');
  const cleanup = initGatewayIntroExperience(intro, media, content, stage, servicesSurface);

  expect(mockTimelineInstances).toHaveLength(1);
  const timeline = mockTimelineInstances[0];
  expect(timeline.config.scrollTrigger).toMatchObject({
    trigger: intro,
    pin: true,
    pinSpacing: true,
    scrub: 0.75,
  });
  expect(timeline.config.scrollTrigger.end()).toBe('+=300%');

  const wordEntrances = timeline.steps.filter(
    (step) => step.type === 'fromTo' && step.target.classList?.contains('gateway-capability-word')
  );
  expect(wordEntrances).toHaveLength(3);
  expect(wordEntrances[0].position).toBe(0.72);
  expect(wordEntrances[1].position - wordEntrances[0].position).toBeCloseTo(0.56);
  expect(timeline.steps.some((step) => step.target.textContent === 'Everything Digital.')).toBe(true);
  expect(timeline.steps.some((step) => step.target === servicesSurface)).toBe(true);

  const conclusionSteps = timeline.steps.filter(
    (step) => step.type === 'to' && step.target.textContent === 'Everything Digital.'
  );
  const cinematicScaleSteps = conclusionSteps.filter((step) => step.vars.scale > 1);
  const cinematicScale = cinematicScaleSteps.find((step) => step.vars.scale === 4.2);
  const atmosphericExit = conclusionSteps.find(
    (step) => step.vars.autoAlpha === 0 && step.vars.filter === 'blur(1.1px)'
  );
  const supportExit = timeline.steps.find(
    (step) => step.target.textContent === 'Built.' && step.vars.autoAlpha === 0
  );
  const servicesRise = timeline.steps.find((step) => step.target === servicesSurface);
  expect(cinematicScaleSteps).toHaveLength(1);
  expect(cinematicScale).toBeDefined();
  expect(cinematicScale.vars.ease).toBe('power1.in');
  expect(cinematicScale.vars.autoAlpha).toBeUndefined();
  expect(cinematicScale.vars.filter).toBeUndefined();
  expect(atmosphericExit).toBeDefined();
  expect(atmosphericExit.vars.ease).toBe('power2.out');
  expect(atmosphericExit.position).toBeGreaterThan(cinematicScale.position);
  expect(atmosphericExit.position + atmosphericExit.vars.duration).toBeCloseTo(
    cinematicScale.position + cinematicScale.vars.duration
  );
  expect(supportExit.position - cinematicScale.position).toBeCloseTo(0.24);
  expect(servicesRise.position).toBeGreaterThan(cinematicScale.position);
  expect(servicesRise.position).toBeLessThan(
    cinematicScale.position + cinematicScale.vars.duration
  );

  cleanup();
  expect(timeline.kill).toHaveBeenCalled();
  expect(timeline.scrollTrigger.kill).toHaveBeenCalled();
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
