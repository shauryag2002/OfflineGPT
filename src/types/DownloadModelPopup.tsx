export interface DownloadModelPopupProps {
  visible: boolean;
  modelUrl: string;
  onDownloaded: () => Promise<void> | void;
}
