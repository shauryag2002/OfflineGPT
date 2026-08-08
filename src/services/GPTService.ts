import { downloadFile } from "@/helpers/downloadFile";
import LlamaRuntimeService from "@/services/LlamaRuntimeService";
import { ModelURIConfig } from "@/types/StoreModelURI-types";
import { Directory, DownloadProgress, File, Paths } from "expo-file-system";
import StoreModelURI from "./StoreModelURI";

export interface ChatMessagePayload {
  role: "system" | "user" | "assistant";
  content: string;
}

// This is a singleton class which handles all offline GPT logic like model management, initialization, and chat completions.
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
      let modelURIConfig = await this.getCurrentModel();
      if (!modelURIConfig) {
        throw new Error("No active model found. Please download an AI model first.");
      }

      let activeURI = modelURIConfig.modelURI;
      let modelFile = new File(activeURI);

      // Handle iOS/Expo app container UUID changes across updates
      if (!modelFile.exists || !modelFile.size || modelFile.size === 0) {
        const fileName = activeURI.split("/").pop() || "model.bin";
        const currentModelsDir = new Directory(Paths.document, "models");
        const fallbackFile = new File(currentModelsDir, fileName);

        if (fallbackFile.exists && fallbackFile.size && fallbackFile.size > 0) {
          activeURI = fallbackFile.uri;
          modelURIConfig = { ...modelURIConfig, modelURI: activeURI };
          await StoreModelURI.addModelURI(modelURIConfig);
          modelFile = fallbackFile;
        }
      }

      if (!modelFile.exists || !modelFile.size || modelFile.size === 0) {
        await StoreModelURI.removeModelURI(modelURIConfig);
        throw new Error("Model file missing or corrupted. Please redownload.");
      }

      await this.llamaRuntimeService.initializeLlamaRuntime(activeURI);
    } catch (error) {
      console.error("Error initializing Llama runtime:", error);
      throw error;
    }
  }

  public async chatCompletion(
    messages: string | ChatMessagePayload[],
    onProgress?: (token: string) => void,
  ): Promise<string> {
    const formattedMessages: ChatMessagePayload[] =
      typeof messages === "string"
        ? [{ role: "user", content: messages }]
        : messages;

    const payloadWithSystem: ChatMessagePayload[] =
      formattedMessages[0]?.role === "system"
        ? formattedMessages
        : [
            {
              role: "system",
              content: "You are a helpful, friendly offline AI assistant.",
            },
            ...formattedMessages,
          ];

    const response = await this.llamaRuntimeService.chatCompletion(
      payloadWithSystem,
      onProgress,
    );
    return response;
  }

  public async unloadModel(): Promise<void> {
    await this.llamaRuntimeService.unloadModel();
  }

  public async stopCompletion(): Promise<void> {
    await this.llamaRuntimeService.stopCompletion();
  }

  public async downloadModelToMobile(
    modelUrl: string,
    isActive: boolean = true,
    onProgress?: (progress: DownloadProgress) => void,
  ): Promise<void> {
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
