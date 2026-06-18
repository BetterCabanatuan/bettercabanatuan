import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        url="/404"
        noindex
      />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-8xl font-bold text-white/20 mb-2">404</p>
            <Heading className="text-white mb-3">Page Not Found</Heading>
            <Text className="text-white/85 max-w-lg mx-auto mb-0">
              Sorry, the page you are looking for doesn&apos;t exist or has been
              moved. Try going back to the homepage or using the search.
            </Text>
          </div>
        </section>

        <Section className="p-3 mb-12 pt-10">
          <div className="max-w-md mx-auto space-y-4">
            <Link
              to="/"
              className="flex items-center gap-3 min-h-[44px] px-5 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Go to Homepage
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-3 min-h-[44px] px-5 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors duration-200"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search the portal
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 min-h-[44px] px-5 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors duration-200 w-full"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Go back
            </button>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <Heading level={3} className="mb-4 text-center">
              Popular Pages
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Government', href: '/government' },
                { label: 'Barangays', href: '/government/barangays' },
                { label: 'Departments', href: '/government/departments' },
                { label: 'Public Officials', href: '/government/officials' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center min-h-[44px] px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
