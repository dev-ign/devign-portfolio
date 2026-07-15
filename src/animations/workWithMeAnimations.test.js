const mockSet = jest.fn();
const mockTo = jest.fn();
const mockCreate = jest.fn((config) => ({ config, kill: jest.fn() }));

jest.mock('gsap', () => ({
  gsap: {
    set: (...args) => mockSet(...args),
    to: (...args) => mockTo(...args),
    from: jest.fn(),
    fromTo: jest.fn(),
    matchMedia: jest.fn(),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: (config) => mockCreate(config),
  },
}));

const { initScrollEnterExit } = require('./workWithMeAnimations');

beforeEach(() => {
  mockSet.mockClear();
  mockTo.mockClear();
  mockCreate.mockClear();
  Object.defineProperty(window, 'innerHeight', { value: 850, configurable: true });
});

test('touch reveals use one early one-shot trigger and never register a global scroll handler', () => {
  window.matchMedia = jest.fn(() => ({ matches: true }));
  const element = document.createElement('article');

  const triggers = initScrollEnterExit([element], { start: 'top 20%' });

  expect(triggers).toHaveLength(1);
  expect(mockCreate).toHaveBeenCalledTimes(1);
  expect(mockCreate.mock.calls[0][0]).toMatchObject({
    trigger: element,
    start: 'top 88%',
    once: true,
  });
  expect(mockCreate.mock.calls[0][0].onUpdate).toBeUndefined();

  mockCreate.mock.calls[0][0].onEnter();
  expect(mockTo).toHaveBeenCalledWith(
    [element],
    expect.objectContaining({ autoAlpha: 1, y: 0 })
  );
});

test('desktop reveals use one bounded reversible trigger', () => {
  window.matchMedia = jest.fn(() => ({ matches: false }));
  const element = document.createElement('article');

  const triggers = initScrollEnterExit([element], { start: 'top 64%' });

  expect(triggers).toHaveLength(1);
  expect(mockCreate).toHaveBeenCalledTimes(1);
  const config = mockCreate.mock.calls[0][0];
  expect(config).toMatchObject({
    trigger: element,
    start: 'top 64%',
  });
  expect(config.end()).toBe('clamp(bottom 10%)');
  expect(config.onUpdate).toBeUndefined();
});

test('default reveal and exit bands adapt to short and tall viewport heights', () => {
  window.matchMedia = jest.fn(() => ({ matches: false }));
  const element = document.createElement('article');

  Object.defineProperty(window, 'innerHeight', { value: 650, configurable: true });
  initScrollEnterExit([element]);
  let config = mockCreate.mock.calls[0][0];
  expect(config.start()).toBe('clamp(top 88%)');
  expect(config.end()).toBe('clamp(bottom 6%)');

  mockCreate.mockClear();
  Object.defineProperty(window, 'innerHeight', { value: 1100, configurable: true });
  initScrollEnterExit([element]);
  config = mockCreate.mock.calls[0][0];
  expect(config.start()).toBe('clamp(top 80%)');
  expect(config.end()).toBe('clamp(bottom 14%)');
});
