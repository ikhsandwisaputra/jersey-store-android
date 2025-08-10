// app/_layout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

// Import Provider kita
import { CartProvider } from '@/src/context/CartContext';
import { WishlistProvider } from '@/src/context/WishlistContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext'; // <-- IMPORT INI

import { useColorScheme } from '@/hooks/useColorScheme';

// Komponen ini akan menangani logika redirect
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Jika masih loading, jangan lakukan apa-apa
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (
      // Jika user TIDAK terautentikasi dan...
      !isAuthenticated &&
      // ...mencoba mengakses grup (tabs) yang dilindungi
      inAuthGroup
    ) {
      // Redirect ke halaman login.
      router.replace('/auth');
    } else if (isAuthenticated && !inAuthGroup) {
      // Jika user TERAUTENTIKASI dan berada di luar grup (tabs),
      // (misalnya baru selesai login dari halaman /login)
      // redirect ke halaman utama di dalam tabs.
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Selama loading, kita bisa tampilkan splash screen atau null
  if (isLoading) {
    // Anda bisa membuat dan menampilkan komponen SplashScreen di sini
    return null; 
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth"
       options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    // Bungkus semuanya dengan AuthProvider
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </ThemeProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}