import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_ROUTE_PATHS } from '@/appRoutes';
import { AudienceProvider } from '@/context/AudienceContext';
import { ThemeProvider } from '@/context/ThemeContext';
import GatewayPage from '@/pages/GatewayPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ProjectsPage from '@/pages/ProjectsPage';
import StoryPage from '@/pages/StoryPage';
import WorkWithMePage from '@/pages/WorkWithMePage';

const App: React.FC = () => (
  <ThemeProvider>
    <AudienceProvider>
      <BrowserRouter>
        <Routes>
          <Route path={APP_ROUTE_PATHS[0]} element={<GatewayPage />} />
          <Route path={APP_ROUTE_PATHS[1]} element={<StoryPage />} />
          <Route path={APP_ROUTE_PATHS[2]} element={<ProjectsPage />} />
          <Route path={APP_ROUTE_PATHS[3]} element={<ProjectDetailPage />} />
          <Route path={APP_ROUTE_PATHS[4]} element={<WorkWithMePage />} />
        </Routes>
      </BrowserRouter>
    </AudienceProvider>
  </ThemeProvider>
);

export default App;
