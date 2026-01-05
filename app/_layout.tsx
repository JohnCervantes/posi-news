import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import MobileAds, { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

export default function RootLayout() {
  //mobileAds().initialize();
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();

        //debuging purposes
        // await AdsConsent.reset();
        // const consentInfo = await AdsConsent.requestInfoUpdate({
        //   debugGeography: AdsConsentDebugGeography.EEA,
        //   testDeviceIdentifiers: [process.env.EXPO_PUBLIC_DEVICE_ID as string],
        // });

        if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
          await AdsConsent.loadAndShowConsentFormIfRequired();
        }

        await MobileAds().initialize();

        setIsReady(true);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized, segments]);

  if (!isReady) return null;

  return (<Stack>
    <Stack.Screen name="(app)" options={{
      headerShown: false
    }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
  </Stack>
  );
}
