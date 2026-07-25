import { stopWords } from "@/constants/global";
import { initLlama, LlamaContext, loadLlamaModelInfo } from "llama.rn";
// In this service, This is a singleton class which will handle all the offline llama logic like downloading the model, loading the model to memory, unloading etc. This singleton class contains all app related llama Runtime logic functions.

class LlamaRuntimeService {
  private static instance: LlamaRuntimeService;
  private context: LlamaContext | null = null;
  private constructor() { }

  public static getInstance(): LlamaRuntimeService {
    if (!LlamaRuntimeService.instance) {
      LlamaRuntimeService.instance = new LlamaRuntimeService();
    }
    return LlamaRuntimeService.instance;
  }

  public async initializeLlamaRuntime(modelPath: string): Promise<void> {
    try {
      if (this.context?.model) {
        return;
      }
      this.context = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 99, // number of layers to store in GPU memory (Metal/OpenCL)
        // embedding: true, // use embedding
      });
      console.log("Llama runtime initialized successfully.");
    } catch (error) {
      console.error("Error initializing Llama runtime:", error);
      throw error;
    }
  }
  public async chatCompletion(
    messages: any[],
    onProgress?: (progress: any) => void,
  ): Promise<string> {
    if (!this.context) {
      throw new Error("Llama runtime not initialized.");
    }
    const msgResult = await this.context.completion(
      {
        messages,
        n_predict: 100,
        stop: stopWords,
        enable_thinking: true,
        n_threads: 4,
        temperature: 1,
        // ...other params
      },
      (data) => {
        // This is a partial completion callback
        const { token } = data;
        console.log("Received token:", token);
        onProgress?.(token);
      },
    );
    console.log("Final completion result:", msgResult.text);
    return msgResult.text;
  }

  protected async unloadModel(): Promise<void> {
    // Logic to unload the model from memory
  }

  public async getModelInfo(modelPath: string): Promise<any> {
    // Logic to get model information from the specified path
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
