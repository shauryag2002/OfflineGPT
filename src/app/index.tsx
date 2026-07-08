import GPTService from "@/services/GPTService";
import { Host, ModalBottomSheetRef, Text } from "@expo/ui/jetpack-compose";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<ModalBottomSheetRef>(null);
  const toggleBottomSheet = () => {
    // setBottomSheetVisible(!isBottomSheetVisible);
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.hide(); // Hide the bottom sheet
    } else {
      bottomSheetRef.current?.expand(); // Show the bottom sheet
    }
    setBottomSheetVisible(!isBottomSheetVisible);
  };
  useEffect(() => {
    const letsTry = async () => {
      const gptServiceInstance = GPTService.getInstance();
      try {
        await gptServiceInstance.downloadModelToMobile(
          process.env.EXPO_PUBLIC_MODEL_URL || "",
        );
        const modelInfo = await gptServiceInstance.loadModelInfo();
        console.log("Model Info:", modelInfo);
      } catch (error) {
        console.error("Error loading model info:", error);
      }
    };

    letsTry();
  }, []);

  return (
    <SafeAreaView>
      <Host matchContents>
        <Text color="yellow" style={{ background: "black" }}>
          Welcome to OfflineGPT
        </Text>
        {/* <Button onClick={toggleBottomSheet}>
          <Text>Open fking bottom sheet.</Text>
        </Button> */}
        {/* <LoadingIndicator /> */}
        {/* <ModalBottomSheet
          properties={{ shouldDismissOnClickOutside: false }}
          ref={bottomSheetRef}
          onDismissRequest={toggleBottomSheet}
        >
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}
          >
            <Text>Hello from bottom sheet!</Text>
            <Text>You can add more content here.</Text>
            <Button onClick={toggleBottomSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet> */}
      </Host>
    </SafeAreaView>
  );
}
