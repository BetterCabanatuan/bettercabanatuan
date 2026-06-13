import PublicOfficials from '../../../components/sections/PublicOfficials';
import Section from '../../../components/ui/Section';
import Breadcrumbs from '../../../components/ui/Breadcrumbs';
import SEO from '../../../components/SEO';

export default function OfficialsPage() {
  return (
    <>
      <SEO
        title="Public Officials"
        description={`Meet the elected officials of ${import.meta.env.VITE_GOVERNMENT_NAME}. View the Mayor, Vice Mayor, and all Sangguniang Panlungsod (City Council) members for the 2025-2028 term.`}
        keywords="public officials, city council, mayor, vice mayor, sangguniang panlungsod, Cabanatuan City"
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <PublicOfficials />
      </Section>
    </>
  );
}
