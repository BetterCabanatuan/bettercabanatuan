import { Building2 } from 'lucide-react';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import DepartmentsList from '../../../components/government/departments/DepartmentsList';
import DepartmentsOverview from '../../../components/government/departments/DepartmentsOverview';
import { allDepartments, departmentsData } from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';
import SectionJumpNav from '../../../components/ui/SectionJumpNav';

export default function DepartmentsPage() {
  return (
    <>
      <SEO
        title="Departments"
        description={`Explore ${siteConfig.governmentName} government departments, offices, and contact information.`}
        keywords={`departments, city offices, local government, ${siteConfig.governmentName}`}
        url="/government/departments"
      />
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
        <SectionJumpNav
          items={[
            { id: 'department-overview', label: 'Overview' },
            { id: 'department-directory', label: 'Office directory' },
          ]}
        />
        <div id="department-overview" className="scroll-mt-28">
          <DepartmentsOverview departments={allDepartments} />
        </div>
        <div id="department-directory" className="scroll-mt-28">
          <DepartmentsList departments={allDepartments} />
        </div>
      </Section>
    </>
  );
}
