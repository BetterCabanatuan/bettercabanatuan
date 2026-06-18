import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function readYaml(filePath) {
  const fullPath = resolve(rootDir, filePath);
  if (!existsSync(fullPath)) return null;
  return yaml.load(readFileSync(fullPath, 'utf-8'));
}

function readJson(filePath) {
  const fullPath = resolve(rootDir, filePath);
  if (!existsSync(fullPath)) return null;
  return JSON.parse(readFileSync(fullPath, 'utf-8'));
}

const SITE_URL =
  process.env.VITE_SITE_URL ||
  process.env.VITE_PROD_ORIGIN ||
  'https://bettercabanatuan.org';

function makeUrl(path) {
  return `${SITE_URL}${path}`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/statistics', priority: '0.6', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.5', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/government', priority: '0.9', changefreq: 'weekly' },
  { path: '/government/officials', priority: '0.8', changefreq: 'monthly' },
  { path: '/government/barangays', priority: '0.9', changefreq: 'monthly' },
  { path: '/government/departments', priority: '0.8', changefreq: 'monthly' },
  { path: '/government/projects', priority: '0.7', changefreq: 'weekly' },
  { path: '/transparency', priority: '0.7', changefreq: 'monthly' },
  {
    path: '/transparency/flood-controls',
    priority: '0.7',
    changefreq: 'weekly',
  },
];

const urls = [...staticPages];

// Service categories and pages
const servicesData = readYaml('src/data/services.yaml');
if (servicesData?.categories) {
  for (const cat of servicesData.categories) {
    urls.push({
      path: `/services/${cat.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    });

    // Load category index for sub-pages
    const indexPath = `content/services/${cat.slug}/index.yaml`;
    const indexData = readYaml(indexPath);
    if (indexData?.pages) {
      for (const page of indexData.pages) {
        urls.push({
          path: `/services/${cat.slug}/${page.slug}`,
          priority: '0.6',
          changefreq: 'monthly',
        });
      }
    }
  }
}

// Government categories and pages
const governmentData = readYaml('src/data/government.yaml');
if (governmentData?.categories) {
  for (const cat of governmentData.categories) {
    if (
      ['officials', 'barangays', 'departments', 'projects'].includes(cat.slug)
    )
      continue;

    urls.push({
      path: `/government/${cat.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    });

    const indexData = readYaml(`content/government/${cat.slug}/index.yaml`);
    if (indexData?.pages) {
      for (const page of indexData.pages) {
        urls.push({
          path: `/government/${cat.slug}/${page.slug}`,
          priority: '0.6',
          changefreq: 'monthly',
        });
      }
    }
  }
}

// Barangays
const barangaysData = readYaml('src/data/barangays.yaml');
if (barangaysData?.barangays) {
  for (const brgy of barangaysData.barangays) {
    urls.push({
      path: `/government/barangays/${brgy.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
    });
  }
}

// Departments
const departmentsData = readYaml('src/data/departments.yaml');
if (departmentsData?.departments) {
  for (const dept of departmentsData.departments) {
    urls.push({
      path: `/government/departments/${dept.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
    });
  }
}

// Projects
const projectsData = readYaml('src/data/projects.yaml');
if (projectsData?.projects) {
  for (const proj of projectsData.projects) {
    urls.push({
      path: `/government/projects/${proj.slug}`,
      priority: '0.5',
      changefreq: 'weekly',
    });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    u => `  <url>
    <loc>${makeUrl(u.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${makeUrl(u.path)}?lang=en"/>
    <xhtml:link rel="alternate" hreflang="fil" href="${makeUrl(u.path)}?lang=fil"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${makeUrl(u.path)}"/>
  </url>`
  )
  .join('\n')}
</urlset>`;

const outputPath = resolve(rootDir, 'public/sitemap.xml');
writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${urls.length} URLs → ${outputPath}`);
