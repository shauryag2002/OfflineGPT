import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <KeyboardProvider>
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
    </KeyboardProvider>
  );
}
