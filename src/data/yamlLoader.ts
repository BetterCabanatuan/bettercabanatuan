import yaml from 'js-yaml';

// Type definitions for the services data
export interface Subcategory {
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
  subcategories?: Subcategory[]; // Keep for backward compatibility
}

export interface CategoryData {
  categories: Category[];
  title?: string;
  description?: string;
}

export interface CategoryIndexData {
  title?: string;
  description?: string;
  layout?: 'grid' | 'list';
  pages: Subcategory[];
}

// Import the YAML file as raw text
import servicesYamlContent from './services.yaml?raw';
import governmentActivitiesYamlContent from './government.yaml?raw';
import barangaysYamlContent from './barangays.yaml?raw';
import departmentsYamlContent from './departments.yaml?raw';
import projectsYamlContent from './projects.yaml?raw';

// Import all category index files statically
import healthServicesIndex from '../../content/services/health-services/index.yaml?raw';
import educationIndex from '../../content/services/education/index.yaml?raw';
import businessIndex from '../../content/services/business/index.yaml?raw';
import socialWelfareIndex from '../../content/services/social-welfare/index.yaml?raw';
import agricultureFisheriesIndex from '../../content/services/agriculture-fisheries/index.yaml?raw';
import infrastructurePublicWorksIndex from '../../content/services/infrastructure-public-works/index.yaml?raw';
import garbageWasteDisposalIndex from '../../content/services/garbage-waste-disposal/index.yaml?raw';
import environmentIndex from '../../content/services/environment/index.yaml?raw';
import disasterPreparednessIndex from '../../content/services/disaster-preparedness/index.yaml?raw';
import housingLandUseIndex from '../../content/services/housing-land-use/index.yaml?raw';
import governmentDepartmentsIndex from '../../content/government/departments/index.yaml?raw';
import governmentDepartmentsLegislativeIndex from '../../content/government/departments/legislative/index.yaml?raw';

// Create a mapping of category slugs to their YAML content
const categoryIndexMap: { [key: string]: string } = {
  'health-services': healthServicesIndex,
  education: educationIndex,
  business: businessIndex,
  'social-welfare': socialWelfareIndex,
  'agriculture-fisheries': agricultureFisheriesIndex,
  'infrastructure-public-works': infrastructurePublicWorksIndex,
  'garbage-waste-disposal': garbageWasteDisposalIndex,
  environment: environmentIndex,
  'disaster-preparedness': disasterPreparednessIndex,
  'housing-land-use': housingLandUseIndex,
  departments: governmentDepartmentsIndex,
  legislative: governmentDepartmentsLegislativeIndex,
};

// Parse the YAML content
export const serviceCategories: CategoryData = yaml.load(
  servicesYamlContent
) as CategoryData;

export const governmentCategories: CategoryData = yaml.load(
  governmentActivitiesYamlContent
) as CategoryData;

export const barangaysData: BarangaysData = yaml.load(
  barangaysYamlContent
) as BarangaysData;

export const departmentsData: DepartmentsData = (() => {
  try {
    return yaml.load(departmentsYamlContent) as DepartmentsData;
  } catch (error) {
    console.error('Failed to parse departments.yaml:', error);
    return { description: '', departments: [] };
  }
})();

export const projectsData: ProjectsData = yaml.load(
  projectsYamlContent
) as ProjectsData;

export const allDepartments: Department[] = departmentsData.departments || [];
export const allProjects: Project[] = projectsData.projects || [];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return allDepartments.find(d => d.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(p => p.slug === slug);
}

export const allBarangays: Barangay[] = barangaysData.barangays || [];

export function getBarangayBySlug(slug: string): Barangay | undefined {
  return allBarangays.find(b => b.slug === slug);
}

export interface CategoryIndex {
  title?: string;
  description?: string;
  layout: 'grid' | 'list';
  pages: Subcategory[];
}

export interface Barangay {
  name: string;
  slug: string;
  description: string;
  classification: 'Urban' | 'Rural';
  psgc_code: string;
  correspondence_code: string;
  old_name?: string;
  status?: string;
  population: {
    2015: number;
    2020: number;
    2024: number;
  };
}

export interface BarangaysData {
  barangays: Barangay[];
}

export interface Department {
  name: string;
  slug: string;
  acronym: string;
  branch: string;
  description: string;
  head: string;
  phone: string;
  email: string;
  office: string;
  icon: string;
  services: string[];
}

export interface DepartmentsData {
  description: string;
  departments: Department[];
}

export type ProjectStatus = 'ongoing' | 'planned' | 'completed';

export interface Project {
  name: string;
  slug: string;
  status: ProjectStatus;
  category: string;
  description: string;
  department: string;
  location: string;
  budget: string;
  startDate: string;
  endDate: string;
  icon: string;
}

export interface ProjectsData {
  description: string;
  projects: Project[];
}

// Function to load category index data
export async function loadCategoryIndex(
  categorySlug: string
): Promise<CategoryIndex> {
  const yamlContent = categoryIndexMap[categorySlug];
  if (!yamlContent) {
    return { layout: 'list', pages: [] };
  }
  try {
    const indexData: CategoryIndexData = yaml.load(
      yamlContent
    ) as CategoryIndexData;
    return {
      title: indexData.title,
      description: indexData.description,
      layout: indexData.layout ?? 'list',
      pages: indexData.pages || [],
    };
  } catch (parseError) {
    console.warn(
      `Failed to parse YAML content for category ${categorySlug}:`,
      parseError
    );
    return { layout: 'list', pages: [] };
  }
}

// Function to get subcategories for a category (with caching)
const categoryCache = new Map<string, CategoryIndex>();

export async function getCategorySubcategories(
  categorySlug: string
): Promise<CategoryIndex> {
  if (categoryCache.has(categorySlug)) {
    return categoryCache.get(categorySlug)!;
  }

  const result = await loadCategoryIndex(categorySlug);
  categoryCache.set(categorySlug, result);
  return result;
}

/** Returns true if a slug has a registered index in categoryIndexMap */
export function isNestedCategory(slug: string): boolean {
  return slug in categoryIndexMap;
}

/** Synchronously parse pages from a category index YAML (for sitemap, etc.) */
export function getCategoryPagesSync(categorySlug: string): Subcategory[] {
  const yamlContent = categoryIndexMap[categorySlug];
  if (!yamlContent) return [];
  try {
    const indexData = yaml.load(yamlContent) as CategoryIndexData;
    return indexData.pages || [];
  } catch {
    return [];
  }
}
