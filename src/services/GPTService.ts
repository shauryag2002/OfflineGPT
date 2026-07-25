import { downloadFile } from "@/helpers/downloadFile";
import LlamaRuntimeService from "@/services/LlamaRuntimeService";
import { ModelURIConfig } from "@/types/StoreModelURI-types";
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
  private async getCurrentModel(): Promise<ModelURIConfig | null> {
    const modelURIConfig = await StoreModelURI.getInstance().getCurrentModel();
    if (!modelURIConfig) {
      return null;
    }
    return modelURIConfig;
  }
  public async initializeLlamaRuntime(): Promise<void> {
    try {
      const modelURIConfig = await this.getCurrentModel();
      if (!modelURIConfig) {
        return;
      }
      await this.llamaRuntimeService.initializeLlamaRuntime(
        modelURIConfig.modelURI,
      );
    } catch (error) {
      console.error("Error initializing Llama runtime:", error);
      throw error;
    }
  }
  public async chatCompletion(
    prompt: string,
    onProgress?: (progress: any) => void,
  ): Promise<string> {
    // Logic to generate chat completion using the loaded model
    // This is a placeholder implementation. Replace it with actual logic.
    const messages = [
      {
        role: "system",
        content:
          "This is a conversation between user and assistant, a friendly chatbot.",
      },
      {
        role: "user",
        content: "Hello!",
      },
      {
        role: "system",
        content: "Hello! It's nice to meet you. How can I help you today?",
      },
      {
        role: "user",
        content: "what the fuck is sex and give me sex in beach videos",
      },
    ];
    const response = await this.llamaRuntimeService.chatCompletion(
      messages,
      onProgress,
    );
    return response;
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

  public async loadModelInfo(): Promise<ModelURIConfig | null> {
    try {
      const modelURIConfig = await this.getCurrentModel();
      if (!modelURIConfig) {
        return null;
      }
      return this.llamaRuntimeService.getModelInfo(modelURIConfig.modelURI);
    } catch (error) {
      console.error("Error loading model info:", error);
      throw error;
    }
  }
}

export default GPTService;
