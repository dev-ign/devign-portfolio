import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTE_PATHS } from '@/appRoutes';
import { AudienceProvider } from '@/context/AudienceContext';
import { ThemeProvider } from '@/context/ThemeContext';
import GatewayPage from '@/pages/GatewayPage';
import WelcomePage from '@/pages/WelcomePage';
import CaseStudyDetailPage from '@/pages/CaseStudyDetailPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ProjectsPage from '@/pages/ProjectsPage';
import PortfolioPage from '@/pages/PortfolioPage';
import WorkWithMePage from '@/pages/WorkWithMePage';
import Analytics from '@/components/Analytics';
import PageMetadata from '@/components/PageMetadata';
import SkipLink from '@/components/SkipLink';

const App: React.FC = () => (
  <ThemeProvider>
    <AudienceProvider>
      <BrowserRouter>
        <SkipLink />
        <PageMetadata />
        <Analytics />
        <Routes>
          <Route path={APP_ROUTE_PATHS[0]} element={<WelcomePage />} />
          <Route path={APP_ROUTE_PATHS[1]} element={<GatewayPage />} />
          <Route path={APP_ROUTE_PATHS[2]} element={<PortfolioPage />} />
          <Route path={APP_ROUTE_PATHS[3]} element={<ProjectsPage />} />
          <Route path={APP_ROUTE_PATHS[4]} element={<ProjectDetailPage />} />
          <Route path={APP_ROUTE_PATHS[5]} element={<WorkWithMePage />} />
          <Route path={APP_ROUTE_PATHS[6]} element={<Navigate to="/portfolio" replace />} />
          <Route path="/case-studies/gravyty-donor-directory" element={<Navigate to="/case-studies/donor-directory" replace />} />
          <Route path={APP_ROUTE_PATHS[7]} element={<CaseStudyDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AudienceProvider>
  </ThemeProvider>
);

export default App;
