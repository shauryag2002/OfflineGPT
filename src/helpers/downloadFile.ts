import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, DownloadProgress, File, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import { AppState, AppStateStatus } from "react-native";

const RESUME_DATA_KEY = "MODEL_DOWNLOAD_RESUME_DATA";

export const downloadFile = async (
  fileUrl: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<string> => {
  const modelsDir = new Directory(Paths.document, "models");

  if (!modelsDir.exists) {
    modelsDir.create({ intermediates: true });
  }

  const fileName = fileUrl.split("/").pop() || "model.bin";
  const finalFile = new File(modelsDir, fileName);
  const tempFile = new File(modelsDir, `${fileName}.tmp`);

  // If the target file already exists and is valid (non-empty), return its URI
  if (finalFile.exists && finalFile.size && finalFile.size > 0) {
    await AsyncStorage.removeItem(RESUME_DATA_KEY).catch(() => {});
    return finalFile.uri;
  }

  // If target file exists but is 0-byte/corrupted, delete it
  if (finalFile.exists) {
    try {
      finalFile.delete();
    } catch (e) {
      console.warn("Failed to delete corrupted final model file:", e);
    }
  }

  let downloadResumable: FileSystem.DownloadResumable | null = null;
  let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

  const progressCallback = (data: FileSystem.DownloadProgressData) => {
    if (onProgress && data.totalBytesExpectedToWrite > 0) {
      onProgress({
        bytesWritten: data.totalBytesWritten,
        totalBytes: data.totalBytesExpectedToWrite,
      });
    }
  };

  const savedResumeData = await AsyncStorage.getItem(RESUME_DATA_KEY).catch(() => null);

  if (savedResumeData && tempFile.exists && tempFile.size && tempFile.size > 0) {
    try {
      const resumeState = JSON.parse(savedResumeData);
      downloadResumable = new FileSystem.DownloadResumable(
        resumeState.url || fileUrl,
        resumeState.fileUri || tempFile.uri,
        resumeState.options || {},
        progressCallback,
        resumeState.resumeData,
      );
    } catch {
      downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        tempFile.uri,
        {},
        progressCallback,
      );
    }
  } else {
    // Clean up stale temp file if no valid resume data is available
    if (tempFile.exists) {
      try {
        tempFile.delete();
      } catch (e) {
        console.warn("Failed to delete stale temporary download file:", e);
      }
    }
    downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      tempFile.uri,
      {},
      progressCallback,
    );
  }

  // Listener to pause download and persist resumeData when app goes to background
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if ((nextAppState === "background" || nextAppState === "inactive") && downloadResumable) {
      try {
        const pauseState = await downloadResumable.pauseAsync();
        if (pauseState && pauseState.resumeData) {
          await AsyncStorage.setItem(RESUME_DATA_KEY, JSON.stringify(pauseState));
        }
      } catch (e) {
        console.warn("Error pausing background download:", e);
      }
    }
  };

  appStateSubscription = AppState.addEventListener("change", handleAppStateChange);

  try {
    let result: FileSystem.FileSystemDownloadResult | undefined;

    if (savedResumeData && downloadResumable) {
      try {
        result = await downloadResumable.resumeAsync();
      } catch (e) {
        console.warn("Resume download failed, falling back to fresh download:", e);
        if (tempFile.exists) {
          try {
            tempFile.delete();
          } catch {}
        }
        await AsyncStorage.removeItem(RESUME_DATA_KEY).catch(() => {});
        downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          tempFile.uri,
          {},
          progressCallback,
        );
        result = await downloadResumable.downloadAsync();
      }
    } else {
      result = await downloadResumable.downloadAsync();
    }

    if (result && result.uri && tempFile.exists && tempFile.size && tempFile.size > 0) {
      // Download complete — remove saved resume data
      await AsyncStorage.removeItem(RESUME_DATA_KEY).catch(() => {});
      // Move temporary file to final target destination
      await tempFile.move(finalFile);
      return finalFile.uri;
    } else {
      throw new Error("Download was paused or incomplete.");
    }
  } catch (error) {
    if (downloadResumable) {
      try {
        const pauseState = downloadResumable.savable();
        if (pauseState && pauseState.resumeData) {
          await AsyncStorage.setItem(RESUME_DATA_KEY, JSON.stringify(pauseState));
        }
      } catch (e) {
        console.warn("Failed to save pause state on error:", e);
      }
    }
    throw error;
  } finally {
    if (appStateSubscription) {
      appStateSubscription.remove();
    }
  }
};


