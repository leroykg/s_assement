import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="product" options={{ presentation: 'modal' }} />
      </Stack>
  );
}
