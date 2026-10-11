import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDepartmentBySlug } from '../../../data/yamlLoader';
import DepartmentDetail, {
  DepartmentNotFound,
} from '../../../components/government/departments/DepartmentDetail';
import {
  loadMarkdownContent,
  type MarkdownContent,
} from '../../../lib/markdownLoader';
import {
  createMarkdownComponents,
  contentUrlTransform,
} from '../../../lib/markdownComponents';
import { getTypographyTheme } from '../../../lib/typographyThemes';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Heading } from '../../../components/ui/Heading';

export default function DepartmentDetailPage() {
  const { departmentSlugId } = useParams();
  const { i18n } = useTranslation('common');
  const lang = i18n.language;
  const department = departmentSlugId
    ? getDepartmentBySlug(departmentSlugId)
    : undefined;
  const [markdownContent, setMarkdownContent] =
    useState<MarkdownContent | null>(null);

  const markdownComponents = createMarkdownComponents(
    getTypographyTheme('default')
  );

  useEffect(() => {
    if (!departmentSlugId || !department) return;

    /*
     * `lang` is a dependency so switching the UI language reloads the page
     * and picks up `<slug>.<lang>.md` when one exists. A switch fires a second
     * load for the same slug while the first may still be in flight; the flag
     * stops the slower, stale one from overwriting the newer result.
     */
    let cancelled = false;
    loadMarkdownContent(departmentSlugId, 'departments', 'government', lang)
      .then(content => {
        if (!cancelled) setMarkdownContent(content);
      })
      .catch(() => {
        if (!cancelled) setMarkdownContent(null);
      });
    return () => {
      cancelled = true;
    };
  }, [departmentSlugId, department, lang]);

  if (!department) {
    return <DepartmentNotFound />;
  }

  return (
    <>
      <DepartmentDetail department={department} />
      {markdownContent && (
        <div className="container mx-auto px-4 -mt-6 mb-12">
          <Card className="markdown-content">
            <CardHeader>
              <Heading level={2} className="px-6 pt-6">
                Additional Information
              </Heading>
              {markdownContent.description && (
                <CardContent>{markdownContent.description}</CardContent>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
                urlTransform={contentUrlTransform}
              >
                {markdownContent.content}
              </ReactMarkdown>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
}
