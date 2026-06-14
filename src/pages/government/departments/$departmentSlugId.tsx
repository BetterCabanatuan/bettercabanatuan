import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { createMarkdownComponents } from '../../../lib/markdownComponents';
import { getTypographyTheme } from '../../../lib/typographyThemes';
import { Card, CardContent, CardHeader } from '@bettergov/kapwa/card';
import { Heading } from '../../../components/ui/Heading';

export default function DepartmentDetailPage() {
  const { departmentSlugId } = useParams();
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

    loadMarkdownContent(departmentSlugId, 'departments', 'government')
      .then(setMarkdownContent)
      .catch(() => setMarkdownContent(null));
  }, [departmentSlugId, department]);

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
