import yaml from 'js-yaml';
import departmentContactsYaml from './department-contacts.yaml?raw';

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
