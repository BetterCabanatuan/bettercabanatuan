import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';

import HomePage from '../Home';
import AboutPage from '../About';
import ContactPage from '../contact';
import StatisticsPage from '../statistics';
import ServicesIndexPage from '../services/index';
import ServiceCategoryPage from '../services/$categoryId';
import ServiceDocumentPage from '../services/$categoryId/$documentSlugId';
import GovernmentIndexPage from '../government/index';
import GovernmentCategoryPage from '../government/$categoryId';
import GovernmentDocumentPage from '../government/$categoryId/$documentSlugId';
import OfficialsPage from '../government/officials/index';
import BarangaysPage from '../government/barangays/index';
import BarangayDetailPage from '../government/barangays/$barangaySlugId';
import DepartmentsPage from '../government/departments/index';
import DepartmentDetailPage from '../government/departments/$departmentSlugId';
import ProjectsPage from '../government/projects/index';
import ProjectDetailPage from '../government/projects/$projectSlugId';
import SitemapPage from '../sitemap/index';
import { allBarangays } from '../../data/yamlLoader';

const pages: Array<{
  name: string;
  route: string;
  routePattern?: string;
  Component: React.ComponentType;
  heading?: RegExp | string;
}> = [
  {
    name: 'Home',
    route: '/',
    Component: HomePage,
    heading: /Government, made clear/i,
  },
  {
    name: 'About',
    route: '/about',
    Component: AboutPage,
    heading: /About/i,
  },
  {
    name: 'Contact',
    route: '/contact',
    Component: ContactPage,
    heading: 'Contact Us',
  },
  {
    name: 'Statistics',
    route: '/statistics',
    Component: StatisticsPage,
    heading: /Statistics/i,
  },
  {
    name: 'Services index',
    route: '/services',
    Component: ServicesIndexPage,
    heading: 'All local government services',
  },
  {
    name: 'Service category',
    route: '/services/health-services',
    routePattern: '/services/:categoryId',
    Component: ServiceCategoryPage,
    heading: /Health Services/i,
  },
  {
    name: 'Service document',
    route:
      '/services/health-services/get-free-check-ups-basic-medicines-and-vaccines',
    routePattern: '/services/:categoryId/:documentSlugId',
    Component: ServiceDocumentPage,
  },
  {
    name: 'Government index',
    route: '/government',
    Component: GovernmentIndexPage,
    heading: /Government Activity/i,
  },
  {
    name: 'Government category',
    route: '/government/news',
    routePattern: '/government/:categoryId',
    Component: GovernmentCategoryPage,
  },
  {
    name: 'Government document',
    route: '/government/departments/executive',
    routePattern: '/government/:categoryId/:documentSlugId',
    Component: GovernmentDocumentPage,
  },
  {
    name: 'Officials',
    route: '/government/officials',
    Component: OfficialsPage,
  },
  {
    name: 'Barangays',
    route: '/government/barangays',
    Component: BarangaysPage,
    heading: /Barangays/i,
  },
  {
    name: 'Barangay detail',
    route: `/government/barangays/${allBarangays[0].slug}`,
    routePattern: '/government/barangays/:barangaySlugId',
    Component: BarangayDetailPage,
  },
  {
    name: 'Departments',
    route: '/government/departments',
    Component: DepartmentsPage,
    heading: 'Departments & Offices',
  },
  {
    name: 'Department detail',
    route: '/government/departments/bplo',
    routePattern: '/government/departments/:departmentSlugId',
    Component: DepartmentDetailPage,
    heading: /Business Permits and Licensing Office/i,
  },
  {
    name: 'Projects',
    route: '/government/projects',
    Component: ProjectsPage,
    heading: 'Government Projects',
  },
  {
    name: 'Project detail',
    route: '/government/projects/central-transport-terminal',
    routePattern: '/government/projects/:projectSlugId',
    Component: ProjectDetailPage,
    heading: /Central Transport Terminal Modernization/i,
  },
  {
    name: 'Sitemap',
    route: '/sitemap',
    Component: SitemapPage,
    heading: 'Sitemap',
  },
];

describe('page smoke tests', () => {
  pages.forEach(({ name, route, routePattern, Component, heading }) => {
    it(`renders ${name} at ${route}`, async () => {
      renderWithProviders(<Component />, { route, routePattern });

      if (heading) {
        expect(
          await screen.findByRole('heading', { name: heading })
        ).toBeInTheDocument();
      } else {
        expect(document.body.textContent?.length).toBeGreaterThan(0);
      }
    });
  });
});
