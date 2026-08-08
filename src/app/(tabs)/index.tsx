import DownloadModelPopup from "@/components/popup/DownloadModelPopup";
import { Colors } from "@/constants/theme";
import GPTService from "@/services/GPTService";
import { Button, Host, ModalBottomSheetRef, Text } from "@expo/ui/jetpack-compose";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MODEL_URL = process.env.EXPO_PUBLIC_MODEL_URL || "";

export default function HomeScreen() {
  const router = useRouter();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isDownloadPopupVisible, setDownloadPopupVisible] = useState(false);
  const bottomSheetRef = useRef<ModalBottomSheetRef>(null);

  const toggleBottomSheet = () => {
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.hide();
    } else {
      bottomSheetRef.current?.expand();
    }
    setBottomSheetVisible(!isBottomSheetVisible);
  };

  const initModel = async () => {
    const gptServiceInstance = GPTService.getInstance();
    try {
      await gptServiceInstance.initializeLlamaRuntime();
      const response = await gptServiceInstance.chatCompletion(
        "What is the capital of France?",
      );
      console.log("Chat completion response:", response);
    } catch (error) {
      console.error("Error loading model info:", error);
      setDownloadPopupVisible(true);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const runInit = async () => {
      if (isMounted) {
        await initModel();
      }
    };
    runInit();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: 20, gap: 16 }}>
        <Host matchContents>

          <Text color="yellow" style={{ background: "black" }}>
            Welcome to OfflineGPT
          </Text>
        </Host>
        <Host matchContents>

          <Button onClick={() => router.push("/chat")} >
            <Text>
              Open Chat Screen
            </Text>
          </Button>

        </Host>
      </View>

      <DownloadModelPopup
        visible={isDownloadPopupVisible}
        modelUrl={MODEL_URL}
        onDownloaded={() => {
          setDownloadPopupVisible(false);
          initModel();
        }}
      />
    </SafeAreaView >
  );
}
