import { Building2 } from 'lucide-react';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import DepartmentsList from '../../../components/government/departments/DepartmentsList';
import DepartmentsOverview from '../../../components/government/departments/DepartmentsOverview';
import {
  allDepartments,
  departmentsData,
} from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

export default function DepartmentsPage() {
  return (
    <>
      <SEO
        title="Departments"
        description={`Explore ${siteConfig.governmentName} government departments, offices, and contact information.`}
        keywords="departments, city offices, local government, Cabanatuan City"
      />
      <main className="flex-grow">
        <GovernmentPageHero
          eyebrow="City Government"
          title="Departments & Offices"
          description={departmentsData.description}
          icon={Building2}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: 'Departments', href: '/government/departments' },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <DepartmentsOverview departments={allDepartments} />
          <DepartmentsList departments={allDepartments} />
        </Section>
      </main>
    </>
  );
}
