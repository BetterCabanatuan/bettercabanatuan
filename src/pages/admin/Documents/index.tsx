import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/Card';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import Stack from '../../../components/ui/Stack';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { adminApiService } from '../../../services/admin.api';
import { Content } from '../../../services/api';
import { DocumentDeleteModal } from '../../../components/admin';
import { useContentCrud } from '../../../hooks/useApiData';
import { useAuth } from '../../../hooks/useAuth';
import { ContentCategory } from '../../../types/document';

export default function Documents() {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('auth_token');
  const [documents, setDocuments] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { deleteContent, loading: crudLoading } = useContentCrud(
    token || undefined
  );

  useEffect(() => {
    if (token) {
      loadDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    content: Content | null;
  }>({
    isOpen: false,
    content: null,
  });

  const loadDocuments = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await adminApiService.getAdminContent({}, token);
      setDocuments(response.data);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (content: Content) => {
    if (!isAuthenticated) {
      alert(
        'Authentication required to delete categories. Please log in to the admin panel.'
      );
      return;
    }
    setDeleteModal({ isOpen: true, content });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.content) return;

    try {
      await deleteContent(deleteModal.content.id || '');
      loadDocuments();
      setDeleteModal({ isOpen: false, content: null });
    } catch {
      // Error is handled by the hook
    }
  };

  const getCategoryNames = (doc: Content) => {
    return (doc.categories as unknown as ContentCategory[])
      .map((cat: ContentCategory) => cat.category.name)
      .join(', ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-900 dark:text-gray-100">
            Loading documents...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Stack direction="horizontal" justify="between" align="center">
          <CardTitle>Documents</CardTitle>
          <Link to="/admin/documents/new#editor/document">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </Link>
        </Stack>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No documents found. Create your first document to get
                    started.
                  </td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.categories.length > 0 ? (
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          {getCategoryNames(doc)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-300 opacity-50">
                          No category
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          doc.status === 'PUBLISHED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : doc.status === 'DRAFT'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          title="Edit document"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          disabled={!isAuthenticated}
                          className={`p-1 ${
                            isAuthenticated
                              ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer'
                              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                          title={
                            isAuthenticated
                              ? 'Delete category'
                              : 'Authentication required'
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <DocumentDeleteModal
        content={deleteModal.content}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, content: null })}
        onConfirm={handleConfirmDelete}
        loading={crudLoading}
      />
    </Card>
  );
}
