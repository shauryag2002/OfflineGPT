import { downloadFile } from "@/helpers/downloadFile";
import LlamaRuntimeService from "@/services/LlamaRuntimeService";
import { DownloadProgress } from "expo-file-system";
import StoreModelURI from "./StoreModelURI";

// This is a singleton class which will handle all the offline gpt logic like downloading the model, loading the model to memory, unloading etc. This singleton class contains all app related gpt logic functions.
class GPTService {
  private static instance: GPTService;
  private llamaRuntimeService: LlamaRuntimeService;

  private constructor() {
    this.llamaRuntimeService = LlamaRuntimeService.getInstance();
  }

  public static getInstance(): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService();
    }
    return GPTService.instance;
  }

  public async downloadModelToMobile(
    modelUrl: string,
    isActive: boolean = true,
    onProgress?: (progress: DownloadProgress) => void,
  ): Promise<void> {
    // Logic to download the model from the specified URL to the mobile device
    const localFileURI = await downloadFile(modelUrl, onProgress);
    console.log(`Model downloaded to: ${localFileURI}`);
    await StoreModelURI.addModelURI({
      modelURI: localFileURI,
      active: isActive,
    });
  }

  public async loadModelInfo(): Promise<any> {
    const modelURIConfig = await StoreModelURI.getInstance().getCurrentModel();
    if (!modelURIConfig) {
      throw new Error("No active model found.");
    }
    console.log("Loading model info for:", modelURIConfig);
    return this.llamaRuntimeService.getModelInfo(modelURIConfig.modelURI);
  }
}

export default GPTService;
