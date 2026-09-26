import Section from '../ui/Section';
import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Banner } from '@bettergov/kapwa/banner';
import NotFoundGuard from './NotFoundGuard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  loadMarkdownContent,
  type MarkdownContent,
} from '../../lib/markdownLoader';
import {
  createMarkdownComponents,
  contentUrlTransform,
} from '../../lib/markdownComponents';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { getTypographyTheme } from '../../lib/typographyThemes';
import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
  isNestedCategory,
  type Subcategory,
  type CategoryIndex,
} from '../../data/yamlLoader';
import SEO from '../SEO';
import { breadcrumbJsonLd } from '../../lib/structuredData';

interface DocumentPageProps {
  theme?: string;
  categoryType?: 'service' | 'government';
}

export default function DocumentPage({
  theme: initialTheme = 'default',
  categoryType,
}: DocumentPageProps) {
  const { documentSlugId, categoryId } = useParams();
  const [markdownContent, setMarkdownContent] =
    useState<MarkdownContent | null>(null);
  const [nestedIndex, setNestedIndex] = useState<CategoryIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const markdownComponents = createMarkdownComponents(
    getTypographyTheme(initialTheme)
  );

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', href: '/' },
  ]);

  useEffect(() => {
    if (!documentSlugId || !categoryId || !categoryType) {
      setError('No document specified');
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const isGovernment = categoryType === 'government';
        const categories = isGovernment
          ? governmentCategories.categories
          : serviceCategories.categories;
        const sectionLabel = isGovernment ? 'Government' : 'Services';
        const sectionHref = isGovernment ? '/government' : '/services';
        const categoryData = categories.find(c => c.slug === categoryId);

        if (isNestedCategory(documentSlugId)) {
          const index = await getCategorySubcategories(documentSlugId);
          setNestedIndex(index);
          setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: sectionLabel, href: sectionHref },
            {
              label: categoryData?.category ?? categoryId,
              href: `${sectionHref}/${categoryId}`,
            },
            {
              label: documentSlugId,
              href: `${sectionHref}/${categoryId}/${documentSlugId}`,
            },
          ]);
          return;
        }

        const content = await loadMarkdownContent(
          documentSlugId,
          categoryId,
          categoryType
        );
        setMarkdownContent(content);

        setBreadcrumbs([
          { label: 'Home', href: '/' },
          { label: sectionLabel, href: sectionHref },
          {
            label: categoryData?.category ?? categoryId,
            href: `${sectionHref}/${categoryId}`,
          },
          {
            label: content.title ?? documentSlugId,
            href: `${sectionHref}/${categoryId}/${documentSlugId}`,
          },
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load document'
        );
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [documentSlugId, categoryId, categoryType]);

  const canonicalPath =
    categoryType === 'government'
      ? `/government/${categoryId}/${documentSlugId}`
      : `/services/${categoryId}/${documentSlugId}`;

  if (loading) {
    return (
      <Section className="p-3 mb-12">
        <Banner type="info" description="Loading document..." />
      </Section>
    );
  }

  if (error) {
    return (
      <NotFoundGuard
        subject={categoryType === 'service' ? 'service document' : 'document'}
        backHref={categoryType === 'government' ? '/government' : '/services'}
        backLabel={
          categoryType === 'government'
            ? 'Back to all government sections'
            : 'Back to all services'
        }
        breadcrumbs={breadcrumbs}
      />
    );
  }

  if (nestedIndex) {
    const nestedPages: Subcategory[] = nestedIndex.pages;
    return (
      <>
        <SEO
          title={nestedIndex.title || documentSlugId}
          description={
            nestedIndex.description ||
            `${nestedIndex.title || documentSlugId} — ${categoryType === 'government' ? 'government' : 'public service'} information for ${documentSlugId}`
          }
          keywords={`${documentSlugId}, government services, local government`}
          url={canonicalPath}
          jsonLd={breadcrumbJsonLd(
            breadcrumbs.map(b => ({ name: b.label, url: b.href }))
          )}
        />
        <Section className="p-3 mb-12">
          <Breadcrumbs className="mb-8" items={breadcrumbs} />
          {nestedIndex.title && (
            <Heading level={2}>{nestedIndex.title}</Heading>
          )}
          {nestedIndex.description && (
            <Text className="text-gray-600 mb-4">
              {nestedIndex.description}
            </Text>
          )}
          {nestedIndex.layout === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nestedPages.map((page, i) => (
                <Card hoverable key={page.slug ?? i} className="h-full">
                  <CardContent>
                    <h4 className="text-lg font-medium text-gray-900">
                      {page.name}
                    </h4>
                    {page.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {page.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nestedPages.map((page, i) => (
                <Card key={page.slug ?? i} className="mb-4">
                  <CardContent>
                    <h4 className="text-lg font-medium text-gray-900">
                      {page.name}
                    </h4>
                    {page.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {page.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </>
    );
  }

  if (!markdownContent) {
    /*
     * Reached when loading finished with no error, no nested index, and no
     * document — previously `return null`, which rendered a completely blank
     * page: no heading, no message, no way forward, inside a layout that still
     * painted the navbar and footer. A resident would assume the site broke.
     * The loader sets one of the three or throws, so this is a backstop rather
     * than a normal path, which is exactly why it needs a real state.
     */
    return (
      <NotFoundGuard
        subject={categoryType === 'service' ? 'service document' : 'document'}
        backHref={categoryType === 'government' ? '/government' : '/services'}
        backLabel={
          categoryType === 'government'
            ? 'Back to all government sections'
            : 'Back to all services'
        }
        breadcrumbs={breadcrumbs}
      />
    );
  }

  /*
   * The document's own leading `#` heading is its title — 17 of the 18 markdown
   * documents open with one, and `markdownContent.title` is read from it. The
   * page renders that title as its <h1> below, so leaving the heading in the
   * body would print the same words twice, inches apart.
   *
   * Stripped here rather than in the loader, because the pages that render
   * their own heading — department and project details — legitimately keep
   * their `#` sections.
   */
  const bodyContent = markdownContent.content.replace(/^#\s+.*\n+/, '');
  const pageTitle = markdownContent.title || documentSlugId;

  return (
    <>
      <SEO
        title={pageTitle}
        description={
          markdownContent.description ||
          `Government service information for ${documentSlugId}`
        }
        keywords={`${documentSlugId}, government services, public services, local government`}
        url={canonicalPath}
        jsonLd={breadcrumbJsonLd(
          breadcrumbs.map(b => ({ name: b.label, url: b.href }))
        )}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" items={breadcrumbs} />
        <Heading level={1} className="mb-4 text-balance">
          {pageTitle}
        </Heading>
        <Card className="mb-8 markdown-content">
          <CardHeader>
            {markdownContent.description && (
              <CardContent>{markdownContent.description}</CardContent>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
              urlTransform={contentUrlTransform}
            >
              {bodyContent}
            </ReactMarkdown>
          </CardHeader>
        </Card>
      </Section>
    </>
  );
}
