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
  initGatewayServicesTypography,
  initPosterScroll,
} = require('./gatewayAnimations');

beforeEach(() => {
  mockTimelineInstances.length = 0;
  mockSet.mockClear();
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
