import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="chat">
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          headerTitle: "Chat",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
