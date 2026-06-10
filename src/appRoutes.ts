export const APP_ROUTE_PATHS = [
  '/',
  '/portfolio',
  '/projects',
  '/projects/:slug',
  '/work-with-me',
] as const;

export type AppRoutePath = (typeof APP_ROUTE_PATHS)[number];
