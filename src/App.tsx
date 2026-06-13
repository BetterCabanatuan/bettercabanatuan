import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import About from './pages/About';
import Barangays from './pages/Barangays';
import BarangayDetail from './pages/BarangayDetail';
import OfficialsPage from './pages/government/officials';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/services/:category/:documentSlug"
                element={<Document categoryType="service" />}
              />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/services" element={<Services />} />
              {/* Officials */}
              <Route path="/government/officials" element={<OfficialsPage />} />
              {/* Barangay */}
              <Route path="/government/barangays" element={<Barangays />} />
              <Route
                path="/government/barangays/:barangaySlug"
                element={<BarangayDetail />}
              />
              {/* Departments */}
              <Route
                path="/government/departments"
                element={<BarangayDetail />}
              />
              <Route
                path="/government/:category/:documentSlug"
                element={<Document categoryType="government" />}
              />
              <Route path="/government" element={<Government />} />
              <Route path="/about" element={<About />} />
              <Route path="/:lang/:documentSlug" element={<Document />} />
              <Route path="/:documentSlug" element={<Document />} />
            </Routes>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
