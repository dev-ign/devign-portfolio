import { APP_ROUTE_PATHS } from './appRoutes';

test('defines the public app routes', () => {
  expect(APP_ROUTE_PATHS).toEqual([
    '/',
    '/portfolio',
    '/projects',
    '/projects/:slug',
    '/work-with-me',
    '/case-studies',
    '/case-studies/:slug',
  ]);
});
