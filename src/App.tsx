import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CloudContentProvider } from './content/CloudContentProvider.tsx';
import { AdminAuthProvider } from './admin/AdminAuthContext.tsx';
import { AdminAuthGuard } from './admin/AdminAuthGuard.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AppLayout } from './components/layout/AppLayout.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ExperiencePage } from './pages/ExperiencePage.tsx';
import { InfrastructurePage } from './pages/InfrastructurePage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { MetricsPage } from './pages/MetricsPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminAuthCallbackPage } from './pages/admin/AdminAuthCallbackPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminProfilePage } from './pages/admin/AdminProfilePage.tsx';
import { AdminExperiencePage } from './pages/admin/AdminExperiencePage.tsx';
import { AdminInfrastructurePage } from './pages/admin/AdminInfrastructurePage.tsx';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage.tsx';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage.tsx';
import { AdminMetricsPage } from './pages/admin/AdminMetricsPage.tsx';
import { AdminMediaPage } from './pages/admin/AdminMediaPage.tsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <CloudContentProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="sobre" element={<AboutPage />} />
              <Route path="experiencia" element={<ExperiencePage />} />
              <Route path="infraestrutura" element={<InfrastructurePage />} />
              <Route path="projetos" element={<ProjectsPage />} />
              <Route path="projetos/:slug" element={<ProjectDetailPage />} />
              <Route path="metricas" element={<MetricsPage />} />
              <Route path="contato" element={<ContactPage />} />
            </Route>

            {/* Admin Login & Auth Callback Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/auth/callback" element={<AdminAuthCallbackPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminAuthGuard>
                  <AdminLayout />
                </AdminAuthGuard>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="perfil" element={<AdminProfilePage />} />
              <Route path="experiencia" element={<AdminExperiencePage />} />
              <Route path="infraestrutura" element={<AdminInfrastructurePage />} />
              <Route path="competencias" element={<AdminSkillsPage />} />
              <Route path="projetos" element={<AdminProjectsPage />} />
              <Route path="metricas" element={<AdminMetricsPage />} />
              <Route path="media" element={<AdminMediaPage />} />
            </Route>

            {/* Fallback to Public Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </CloudContentProvider>
  );
}
