import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { LoadingSpinner } from '../src/components/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

