import yaml from 'js-yaml';
import { normalizeBarangayDescription } from '../lib/barangayText';

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
  /** Section is planned but has no published content yet (see P2-1). */
  comingSoon?: boolean;
  /** Section-specific wording for the empty state. */
  comingSoonNote?: string;
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
import aboutYamlContent from './about.yaml?raw';
import transparencyYamlContent from './transparency.yaml?raw';
import floodControlsYamlContent from './flood-controls.yaml?raw';
import nationalProjectsYamlContent from './national-projects.yaml?raw';
import legislationYamlContent from './legislation.yaml?raw';
import electionResultsYamlContent from './election-results.yaml?raw';

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

export interface AboutFastFact {
  label: string;
  value: string;
}

export interface AboutHistory {
  title: string;
  description?: string;
  paragraphs: string[];
  fastFacts?: AboutFastFact[];
}

export interface AboutData {
  history: AboutHistory;
}

export const aboutData: AboutData = yaml.load(aboutYamlContent) as AboutData;

export interface TransparencyResource {
  title: string;
  description: string;
  href: string;
  icon?: string;
  external?: boolean;
}

export interface TransparencySection {
  id: string;
  title: string;
  description: string;
  resources: TransparencyResource[];
}

export interface TransparencyData {
  description: string;
  sections: TransparencySection[];
}

export const transparencyData: TransparencyData = yaml.load(
  transparencyYamlContent
) as TransparencyData;

export interface FloodControlProject {
  slug: string;
  title: string;
  location: string;
  contractor: string;
  cost: string;
  completionDate: string;
  reportUrl?: string;
  /** DPWH contract identifier from the flood-control projects index */
  contractId?: string;
  status?: string;
  /** Program name, e.g. 'Regular Infra' */
  program?: string;
  /** Funding source, e.g. 'Regular Infra - GAA 2024 OO-2' */
  sourceOfFunds?: string;
  /** Infrastructure year of the GAA that funded the project */
  year?: number;
  latitude?: number;
  longitude?: number;
}

export interface FloodControlsData {
  title: string;
  description: string;
  projects: FloodControlProject[];
}

export const floodControlsData: FloodControlsData = yaml.load(
  floodControlsYamlContent
) as FloodControlsData;

export const allFloodControlProjects: FloodControlProject[] =
  floodControlsData.projects || [];

export interface NationalProject {
  slug: string;
  name: string;
  department: string;
  category: string;
  location: string;
  /** GAA fiscal years that funded this project */
  years: number[];
  /** Total amount in exact PHP pesos */
  amount: number;
  amountLabel: string;
}

export interface NationalProjectsData {
  title: string;
  description: string;
  projects: NationalProject[];
}

export const nationalProjectsData: NationalProjectsData = yaml.load(
  nationalProjectsYamlContent
) as NationalProjectsData;

export const allNationalProjects: NationalProject[] =
  nationalProjectsData.projects || [];

export interface RepublicAct {
  raNumber: string;
  title: string;
  year: number;
  summary: string;
  tags: string[];
  url: string;
  pdfUrl?: string;
}

export interface CaseLaw {
  caseNumber: string;
  title: string;
  year: number;
  decisionDate?: string;
  summary?: string;
  disposition?: string;
  url: string;
}

export interface PendingBill {
  number: string;
  congress: number;
  title: string;
  status: string;
  filedAt?: string;
  authors: string[];
  committee?: string;
  url: string;
}

export interface LegislationData {
  title: string;
  description: string;
  republicActs: RepublicAct[];
  jurisprudence: CaseLaw[];
  pendingBills: PendingBill[];
}

export const legislationData: LegislationData = yaml.load(
  legislationYamlContent
) as LegislationData;

export interface ElectionCandidate {
  name: string;
  party: string;
  votes: number;
  won: boolean;
}

export interface ElectionContest {
  position: string;
  seats: number;
  totalVotes?: number;
  margin?: number;
  note?: string;
  candidates: ElectionCandidate[];
}

export interface ElectionResultsData {
  title: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  electionDate: string;
  contests: ElectionContest[];
}

export const electionResultsData: ElectionResultsData = yaml.load(
  electionResultsYamlContent
) as ElectionResultsData;

export const allDepartments: Department[] = departmentsData.departments || [];
export const allProjects: Project[] = projectsData.projects || [];

export function getDepartmentBySlug(slug: string): Department | undefined {
  return allDepartments.find(d => d.slug === slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(p => p.slug === slug);
}

export const allBarangays: Barangay[] = normalizeBarangays(barangaysData);

export function getBarangayBySlug(slug: string): Barangay | undefined {
  return allBarangays.find(b => b.slug === slug);
}

/** Population figures for a barangay, omitting years with no verified data. */
export function getBarangayPopulationTrend(
  barangay: Barangay
): Array<{ year: BarangayPopulationYear; population: number }> {
  return BARANGAY_POPULATION_YEARS.flatMap(year => {
    const value = barangay.population[year];
    return typeof value === 'number' ? [{ year, population: value }] : [];
  });
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
  /**
   * Population by census year. A year is `null` when the figure could not be
   * verified against a PSA source and must not be guessed — see P3-2.
   */
  population: {
    2015: number | null;
    2020: number | null;
    2024: number | null;
  };
}

export interface BarangaysData {
  description?: string;
  /** Source attribution for the figures in `barangays`. */
  source?: string;
  sourceUrl?: string;
  retrieved?: string;
  barangays: Barangay[];
}

/** Census years present in the barangay population series. */
export const BARANGAY_POPULATION_YEARS = [2015, 2020, 2024] as const;
export type BarangayPopulationYear = (typeof BARANGAY_POPULATION_YEARS)[number];

/**
 * Applies the shared description grammar fix and exposes only verified
 * population figures. See `src/lib/barangayText.ts`.
 */
function normalizeBarangays(data: BarangaysData): Barangay[] {
  return (data.barangays ?? []).map(barangay => ({
    ...barangay,
    description: normalizeBarangayDescription(
      barangay.description,
      barangay.classification
    ),
    population: {
      2015: barangay.population?.['2015'] ?? null,
      2020: barangay.population?.['2020'] ?? null,
      2024: barangay.population?.['2024'] ?? null,
    },
  }));
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

export const KNOWN_PROJECT_STATUSES = [
  'ongoing',
  'planned',
  'completed',
] as const;

export type KnownProjectStatus = (typeof KNOWN_PROJECT_STATUSES)[number];

export interface Project {
  name: string;
  slug: string;
  status?: string;
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
