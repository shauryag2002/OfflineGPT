import { Directory, DownloadProgress, File, Paths } from "expo-file-system";

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

  // If the complete final file already exists and is non-empty, return its URI
  if (finalFile.exists && finalFile.size && finalFile.size > 0) {
    return finalFile.uri;
  }

  // If target file exists but is 0-byte or corrupted, delete it
  if (finalFile.exists) {
    try {
      finalFile.delete();
    } catch (e) {
      console.warn("Failed to delete corrupted final model file:", e);
    }
  }

  // Always delete any existing .tmp file to ensure a clean download from 0%
  if (tempFile.exists) {
    try {
      tempFile.delete();
    } catch (e) {
      console.warn("Failed to delete temporary download file:", e);
    }
  }

  try {
    // Download into temporary file from scratch
    await File.downloadFileAsync(fileUrl, tempFile, { onProgress });

    // Move completed temp file to target model destination
    await tempFile.move(finalFile);

    return finalFile.uri;
  } catch (error) {
    // On any error or interruption, delete the incomplete .tmp file so next attempt starts from 0%
    if (tempFile.exists) {
      try {
        tempFile.delete();
      } catch (e) {
        console.warn("Failed to clean up temp file after download error:", e);
      }
    }
    throw error;
  }
};
