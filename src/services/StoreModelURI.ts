import { MODEL_URI_LIST } from "@/constants/global";
import { ModelURIConfig } from "@/types/StoreModelURI-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// This singleton service handles storing and retrieving model URIs using AsyncStorage.
class StoreModelURI {
  private static instance: StoreModelURI;
  private currentModel: ModelURIConfig | null = null;

  private constructor() {}

  public static getInstance(): StoreModelURI {
    if (!StoreModelURI.instance) {
      StoreModelURI.instance = new StoreModelURI();
    }
    return StoreModelURI.instance;
  }

  public static async getStoredModelURIs(): Promise<ModelURIConfig[]> {
    try {
      const existingURIs = await AsyncStorage.getItem(MODEL_URI_LIST);
      return existingURIs ? JSON.parse(existingURIs) : [];
    } catch (error) {
      console.error("Error retrieving model URIs:", error);
      return [];
    }
  }

  public static async addModelURI(config: ModelURIConfig): Promise<void> {
    try {
      const existingURIs = await AsyncStorage.getItem(MODEL_URI_LIST);
      let uriList: ModelURIConfig[] = existingURIs
        ? JSON.parse(existingURIs)
        : [];

      // If new config is active, mark all existing models as inactive
      if (config.active) {
        uriList = uriList.map((item) => ({ ...item, active: false }));
      }

      const existingIndex = uriList.findIndex(
        (item) => item.modelURI === config.modelURI,
      );

      if (existingIndex >= 0) {
        uriList[existingIndex] = config;
      } else {
        uriList.push(config);
      }

      await AsyncStorage.setItem(MODEL_URI_LIST, JSON.stringify(uriList));

      // Update cached instance model if active
      if (config.active) {
        StoreModelURI.getInstance().currentModel = config;
      }
    } catch (error) {
      console.error("Error storing model URI:", error);
    }
  }

  public static async removeModelURI(config: ModelURIConfig): Promise<void> {
    try {
      const existingURIs = await AsyncStorage.getItem(MODEL_URI_LIST);
      let uriList: ModelURIConfig[] = existingURIs
        ? JSON.parse(existingURIs)
        : [];
      uriList = uriList.filter(
        (uriConfig) => uriConfig.modelURI !== config.modelURI,
      );
      await AsyncStorage.setItem(MODEL_URI_LIST, JSON.stringify(uriList));

      if (StoreModelURI.getInstance().currentModel?.modelURI === config.modelURI) {
        StoreModelURI.getInstance().currentModel = null;
      }
    } catch (error) {
      console.error("Error removing model URI:", error);
    }
  }

  public static async clearAllModelURIs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MODEL_URI_LIST);
      StoreModelURI.getInstance().currentModel = null;
    } catch (error) {
      console.error("Error clearing model URIs:", error);
    }
  }

  public async getCurrentModel(): Promise<ModelURIConfig | null> {
    const storedModels = await StoreModelURI.getStoredModelURIs();
    if (storedModels.length > 0) {
      const activeModel = storedModels.find((model) => model.active) || storedModels[0];
      this.currentModel = activeModel;
      return activeModel;
    }
    this.currentModel = null;
    return null;
  }
}

export default StoreModelURI;
