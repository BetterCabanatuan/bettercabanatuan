import yaml from 'js-yaml';
import departmentContactsYaml from './department-contacts.yaml?raw';
import { getDepartmentBySlug } from './yamlLoader';

export interface DepartmentContactLine {
  name: string;
  phone: string;
  departmentSlug?: string;
}

export interface DepartmentContactsData {
  officeHours: string;
  contacts: DepartmentContactLine[];
}

export const departmentContactsData: DepartmentContactsData = yaml.load(
  departmentContactsYaml
) as DepartmentContactsData;

export function getContactsForDepartment(
  slug: string
): DepartmentContactLine[] {
  return departmentContactsData.contacts.filter(
    contact => contact.departmentSlug === slug
  );
}

/**
 * Resolves a contact line's department to its page href.
 *
 * Returns `undefined` when the line has no slug, or when the slug has no
 * matching entry in the departments dataset. Callers should treat that as
 * "this office has no page" and omit the link rather than rendering a 404.
 * This keeps the contact directory driven by the dataset instead of strings
 * that can drift out of sync.
 */
export function getDepartmentHref(slug?: string): string | undefined {
  if (!slug) return undefined;
  if (!getDepartmentBySlug(slug)) return undefined;
  return `/government/departments/${slug}`;
}

/** Contact lines that point at a department slug missing from the dataset. */
export function getUnresolvedDepartmentSlugs(): string[] {
  const slugs = departmentContactsData.contacts
    .map(contact => contact.departmentSlug)
    .filter((slug): slug is string => Boolean(slug));

  return [...new Set(slugs.filter(slug => !getDepartmentBySlug(slug)))];
}
