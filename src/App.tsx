import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ContactPage from './pages/contact';
import StatisticsPage from './pages/statistics';

import TransparencyPage from './pages/transparency';
import FloodControlsPage from './pages/transparency/flood-controls';

import ServicesIndexPage from './pages/services/index';
import ServiceCategoryPage from './pages/services/$categoryId';
import ServiceDocumentPage from './pages/services/$categoryId/$documentSlugId';

import GovernmentIndexPage from './pages/government/index';
import GovernmentCategoryPage from './pages/government/$categoryId';
import GovernmentDocumentPage from './pages/government/$categoryId/$documentSlugId';
import OfficialsPage from './pages/government/officials/index';
import BarangaysPage from './pages/government/barangays/index';
import BarangayDetailPage from './pages/government/barangays/$barangaySlugId';
import DepartmentsPage from './pages/government/departments/index';
import DepartmentDetailPage from './pages/government/departments/$departmentSlugId';
import ProjectsPage from './pages/government/projects/index';
import ProjectDetailPage from './pages/government/projects/$projectSlugId';
import SitemapPage from './pages/sitemap/index';
import SearchPage from './pages/search';
import { Hotline } from './components/layout/Hotline';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Hotline />
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/services/:categoryId/:documentSlugId"
                element={<ServiceDocumentPage />}
              />
              <Route
                path="/services/:categoryId"
                element={<ServiceCategoryPage />}
              />
              <Route path="/services" element={<ServicesIndexPage />} />

              <Route path="/government/officials" element={<OfficialsPage />} />
              <Route
                path="/government/barangays/:barangaySlugId"
                element={<BarangayDetailPage />}
              />
              <Route path="/government/barangays" element={<BarangaysPage />} />
              <Route
                path="/government/departments/:departmentSlugId"
                element={<DepartmentDetailPage />}
              />
              <Route
                path="/government/departments"
                element={<DepartmentsPage />}
              />
              <Route
                path="/government/projects/:projectSlugId"
                element={<ProjectDetailPage />}
              />
              <Route path="/government/projects" element={<ProjectsPage />} />
              <Route
                path="/government/:categoryId/:documentSlugId"
                element={<GovernmentDocumentPage />}
              />
              <Route
                path="/government/:categoryId"
                element={<GovernmentCategoryPage />}
              />
              <Route path="/government" element={<GovernmentIndexPage />} />
              <Route
                path="/transparency/flood-controls"
                element={<FloodControlsPage />}
              />
              <Route path="/transparency" element={<TransparencyPage />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
            </Routes>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
