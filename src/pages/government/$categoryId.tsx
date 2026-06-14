import { Navigate, useParams } from 'react-router-dom';
import GovernmentCategoryPage from '../../components/government/GovernmentCategoryPage';

const dedicatedRoutes: Record<string, string> = {
  officials: '/government/officials',
  barangays: '/government/barangays',
  departments: '/government/departments',
  projects: '/government/projects',
};

export default function GovernmentCategoryRoute() {
  const { categoryId } = useParams();

  if (categoryId && dedicatedRoutes[categoryId]) {
    return <Navigate to={dedicatedRoutes[categoryId]} replace />;
  }

  return <GovernmentCategoryPage />;
}
