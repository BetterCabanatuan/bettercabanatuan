import GovernmentActivitySection from '../../components/home/GovernmentActivitySection';
import SEO from '../../components/SEO';
import { governmentCategories } from '../../data/yamlLoader';
import { siteConfig } from '../../lib/siteConfig';

export default function GovernmentIndexPage() {
  const pageTitle = governmentCategories.title ?? 'Government';
  const pageDescription =
    governmentCategories.description ??
    `Government activity and information for ${siteConfig.governmentName}. Explore departments, officials, barangays, and more.`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords="government, local government, departments, officials, barangays"
      />
      <GovernmentActivitySection
        title={governmentCategories.title}
        description={governmentCategories.description}
      />
    </>
  );
}
