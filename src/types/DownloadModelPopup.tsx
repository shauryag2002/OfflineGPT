export interface DownloadModelPopupProps {
  visible: boolean;
  modelUrl: string;
  onDownloaded: () => void;
  onDismiss: () => void;
}
