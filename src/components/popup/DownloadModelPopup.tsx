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

const DownloadModelPopup: React.FC<DownloadModelPopupProps> = ({
  visible,
  modelUrl,
  onDownloaded,
  onDismiss,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!visible) {
    return null;
  }

  const handleDownload = async () => {
    setError(null);
    setIsDownloading(true);
    try {
      const gptService = GPTService.getInstance();
      await gptService.downloadModelToMobile(modelUrl, true, (data) => {
        if (data.totalBytes > 0) {
          setProgress(data.bytesWritten / data.totalBytes);
        }
      });
      onDownloaded();
    } catch (err) {
      console.error("Error downloading model:", err);
      setError("Failed to download the model. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Host matchContents>
      <BasicAlertDialog
        onDismissRequest={onDismiss}
        properties={{
          dismissOnBackPress: !isDownloading,
          dismissOnClickOutside: !isDownloading,
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
              This model will be downloaded and stored on your device so it
              can run fully offline.
            </Text>

            {isDownloading && (
              <Column verticalArrangement={{ spacedBy: 4 }}>
                <LinearProgressIndicator
                  progress={progress}
                  modifiers={[width(280)]}
                />
                <Text>{Math.round(progress * 100)}%</Text>
              </Column>
            )}

            {error && <Text color="red">{error}</Text>}

            <Button onClick={handleDownload} enabled={!isDownloading}>
              <Text>{isDownloading ? "Downloading..." : "Download"}</Text>
            </Button>
          </Column>
        </Surface>
      </BasicAlertDialog>
    </Host>
  );
};

export default DownloadModelPopup;
