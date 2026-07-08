import { Directory, DownloadProgress, File, Paths } from "expo-file-system";

export const downloadFile = async (
  fileUrl: string,
  onProgress?: (progress: DownloadProgress) => void,
) => {
  const modelsDir = new Directory(Paths.document, "models");

  if (!modelsDir.exists) {
    modelsDir.create({ intermediates: true });
  }
  const fileName = fileUrl.split("/").pop() || "model.bin";
  const file = new File(modelsDir, fileName);

  if (file.exists) {
    return file.uri;
  }

  await File.downloadFileAsync(fileUrl, file, { onProgress });

  return file.uri;
};
