import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Building2 } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import Section from '../../ui/Section';
import Breadcrumbs from '../../ui/Breadcrumbs';
import SEO from '../../SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import type { Department } from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

interface DepartmentDetailProps {
  department: Department;
}

export default function DepartmentDetail({ department }: DepartmentDetailProps) {
  const Icon = (LucideIcons[
    department.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>) || Building2;

  return (
    <>
      <SEO
        title={department.name}
        description={department.description}
        keywords={`${department.name}, ${department.acronym}, Cabanatuan City, local government department`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: 'Departments', href: '/government/departments' },
            { label: department.name, href: `/government/departments/${department.slug}` },
          ]}
        />

        <Link
          to="/government/departments"
          className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all departments
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 mb-2">
                  {department.acronym} · {department.branch}
                </span>
                <Heading className="mb-2">{department.name}</Heading>
                <Text className="text-gray-600 mb-0">{department.description}</Text>
              </div>
            </div>

            {department.services.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Heading level={3} className="text-lg mb-4">
                    Key Services
                  </Heading>
                  <ul className="space-y-2">
                    {department.services.map(service => (
                      <li
                        key={service}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0"
                          aria-hidden="true"
                        />
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          </div>

          <Card className="h-fit border-t-4 border-primary-500">
            <CardContent className="p-6 space-y-4">
              <Heading level={3} className="text-lg mb-2">
                Contact Information
              </Heading>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Department Head
                </p>
                <p className="text-sm text-gray-900">{department.head}</p>
              </div>
              <a
                href={`tel:${department.phone.replace(/\D/g, '')}`}
                className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
              >
                <Phone
                  className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{department.phone}</span>
              </a>
              <a
                href={`mailto:${department.email}`}
                className="flex items-start gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200 break-all"
              >
                <Mail
                  className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{department.email}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin
                  className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm">{department.office}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="p-5">
            <Text className="text-sm text-gray-700 mb-0">
              Contact details are provided for reference through the Better
              Cabanatuan community portal. For official transactions, visit{' '}
              {siteConfig.governmentName} City Hall or the{' '}
              <a
                href={siteConfig.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                official city website
              </a>
              .
            </Text>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}

export function DepartmentNotFound() {
  return (
    <Section className="p-3 mb-12">
      <Breadcrumbs className="mb-8" />
      <Banner
        type="error"
        title="Department not found"
        description="The department you are looking for does not exist."
        icon
      />
    </Section>
  );
}
