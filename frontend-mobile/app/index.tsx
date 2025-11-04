import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to auth/login by default
  // The _layout will handle the actual routing based on auth state
  return <Redirect href="/(auth)/login" />;
}
