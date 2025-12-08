import { Stack } from "expo-router";

export default function RootLayout() {
   return <Stack >
      <Stack.Screen name="index" options={{ title: 'Posi News' }} />
      <Stack.Screen
         name="article"
         options={{
            title: "Back to Uplifting Stories",
            headerBackTitle: 'Back to Uplifting Stories',
         }}
      />
   </Stack>;
}


