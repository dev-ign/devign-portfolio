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
  expect(mockCreate.mock.calls[0][0]).toMatchObject({
    trigger: element,
    start: 'top 64%',
    end: 'top top',
  });
  expect(mockCreate.mock.calls[0][0].onUpdate).toBeUndefined();
});
