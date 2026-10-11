export const APP_ROUTE_PATHS = [
  '/',
  '/studio',
  '/portfolio',
  '/projects',
  '/projects/:slug',
  '/work-with-me',
  '/case-studies',
  '/case-studies/:slug',
] as const;

export type AppRoutePath = (typeof APP_ROUTE_PATHS)[number];
