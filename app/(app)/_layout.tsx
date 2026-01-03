import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";

export default function RootLayout() {
   const router = useRouter()

   const [user, setUser] = useState<User | null>(null);
   useEffect(() => {
      async function getUser() {
         const { data: { user } } = await supabase.auth.getUser();
         setUser(user);
      }
      getUser();
   }, [user]);

   return <Stack >
      <Stack.Screen name="index" options={{
         title: 'Posi News', headerRight: () => <Pressable onPress={() => router.push("/settings")}><Ionicons name="settings" size={28}></Ionicons></Pressable>,
         headerLeft: () => null,
         headerBackVisible: false,
         gestureEnabled: false,
      }} />
      <Stack.Screen
         name="article"
         options={{
            title: "Back to Uplifting Stories",
            headerBackTitle: 'Back to Uplifting Stories',
         }}
      />
      <Stack.Screen
         name="settings"
         options={{
            title: "Settings",
         }}
      />
   </Stack>;
}


