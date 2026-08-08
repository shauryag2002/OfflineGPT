import GPTService from "@/services/GPTService";
import { DownloadModelPopupProps } from "@/types/DownloadModelPopup";
import {
  BasicAlertDialog,
  Button,
  Column,
  Host,
  LinearProgressIndicator,
  Surface,
  Text,
} from "@expo/ui/jetpack-compose";
import {
  padding,
  width,
  wrapContentHeight,
  wrapContentWidth,
} from "@expo/ui/jetpack-compose/modifiers";
import React, { useState } from "react";

const DEFAULT_MODEL_URL =
  process.env.EXPO_PUBLIC_MODEL_URL ||
  "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf";

const DownloadModelPopup: React.FC<DownloadModelPopupProps> = ({
  visible,
  modelUrl,
  onDownloaded,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Downloading AI Model...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!visible) {
    return null;
  }

  const handleDownload = async () => {
    const targetUrl = modelUrl || DEFAULT_MODEL_URL;
    setError(null);
    setIsDownloading(true);
    setProgress(0);
    setStatusMessage("Downloading model file...");

    try {
      const gptService = GPTService.getInstance();
      await gptService.downloadModelToMobile(targetUrl, true, (data) => {
        if (data.totalBytes > 0) {
          const calculatedProgress = data.bytesWritten / data.totalBytes;
          setProgress(calculatedProgress);
          setStatusMessage(
            calculatedProgress > 0 ? "Downloading AI model..." : "Resuming download...",
          );
        }
      });

      setStatusMessage("Initializing AI engine...");
      setProgress(1);

      // Wait for parent component to complete LLM initialization before closing modal
      await onDownloaded();
    } catch (err) {
      console.error("Error downloading or initializing model:", err);
      setError(
        "Download paused or interrupted. Click Resume Download to continue.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Host matchContents>
      <BasicAlertDialog
        properties={{
          dismissOnBackPress: false,
          dismissOnClickOutside: false,
        }}
      >
        <Surface
          tonalElevation={6}
          modifiers={[width(320), wrapContentHeight(), wrapContentWidth()]}
        >
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[padding(20, 20, 20, 20)]}
          >
            <Text style={{ typography: "titleLarge" }}>
              Download AI Model
            </Text>

            <Text>
              An offline GGUF model is required to run OfflineGPT locally.
              Click Download to store and initialize it on your device.
            </Text>

            {(isDownloading || progress > 0) && (
              <Column verticalArrangement={{ spacedBy: 4 }}>
                <LinearProgressIndicator
                  progress={progress}
                  modifiers={[width(280)]}
                />
                <Text>{statusMessage} ({Math.round(progress * 100)}%)</Text>
              </Column>
            )}

            {error && <Text color="red">{error}</Text>}

            <Button onClick={handleDownload} enabled={!isDownloading}>
              <Text>
                {isDownloading
                  ? "Processing..."
                  : progress > 0
                    ? "Resume Download"
                    : "Download Model"}
              </Text>
            </Button>
          </Column>
        </Surface>
      </BasicAlertDialog>
    </Host>
  );
};

export default DownloadModelPopup;
