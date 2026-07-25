import { stopWords } from "@/constants/global";
import { initLlama, LlamaContext, loadLlamaModelInfo } from "llama.rn";

// In this service, This is a singleton class which will handle all the offline llama logic like downloading the model, loading the model to memory, unloading etc. This singleton class contains all app related llama Runtime logic functions.

class LlamaRuntimeService {
  private static instance: LlamaRuntimeService;
  private context: LlamaContext | null = null;

  private constructor() {}

  public static getInstance(): LlamaRuntimeService {
    if (!LlamaRuntimeService.instance) {
      LlamaRuntimeService.instance = new LlamaRuntimeService();
    }
    return LlamaRuntimeService.instance;
  }

  public async initializeLlamaRuntime(modelPath: string): Promise<void> {
    try {
      if (this.context) {
        return;
      }
      this.context = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 99, // number of layers to store in GPU memory (Metal/OpenCL)
      });
      console.log("Llama runtime initialized successfully.");
    } catch (error) {
      console.error("Error initializing Llama runtime:", error);
      throw error;
    }
  }

  public async chatCompletion(
    messages: { role: string; content: string }[],
    onProgress?: (progress: string) => void,
  ): Promise<string> {
    if (!this.context) {
      throw new Error("Llama runtime not initialized. Please load a model first.");
    }
    const msgResult = await this.context.completion(
      {
        messages,
        n_predict: 512,
        stop: stopWords,
        enable_thinking: false,
        n_threads: 4,
        temperature: 0.7,
      },
      (data) => {
        const { token } = data;
        onProgress?.(token);
      },
    );
    return msgResult.text;
  }

  public async unloadModel(): Promise<void> {
    if (this.context) {
      try {
        await this.context.release();
        this.context = null;
        console.log("Llama model released and memory freed.");
      } catch (error) {
        console.error("Error releasing Llama model:", error);
      }
    }
  }

  public async stopCompletion(): Promise<void> {
    if (this.context) {
      try {
        await this.context.stopCompletion();
      } catch (error) {
        console.error("Error stopping completion:", error);
      }
    }
  }

  public async getModelInfo(modelPath: string): Promise<any> {
    try {
      const modelInfo = await loadLlamaModelInfo(modelPath);
      return modelInfo;
    } catch (error) {
      console.error("Error getting model info:", error);
      throw error;
    }
  }
}

export default LlamaRuntimeService;
