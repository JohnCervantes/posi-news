import HeaderLoginButton from "@/components/Login";
import HeaderLogoutButton from "@/components/Logout";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
   
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
         title: 'Posi News', headerRight: () => user ? <HeaderLogoutButton /> : <HeaderLoginButton />,
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
   </Stack>;
}


