import { MODEL_URI_LIST } from "@/constants/global";
import { ModelURIConfig } from "@/types/StoreModelURI-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
// this singeleton service will handle all the logic related to storing and retrieving model URIs in the app. This service will use AsyncStorage to store the model URIs in the app.
class StoreModelURI {
  // Implementation for storing and retrieving model URIs
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
      if (
        !uriList.some((uriConfig) => uriConfig.modelURI === config.modelURI)
      ) {
        uriList.push(config);
        await AsyncStorage.setItem(MODEL_URI_LIST, JSON.stringify(uriList));
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
    } catch (error) {
      console.error("Error removing model URI:", error);
    }
  }
  public static async clearAllModelURIs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MODEL_URI_LIST);
    } catch (error) {
      console.error("Error clearing model URIs:", error);
    }
  }
  public async getCurrentModel(): Promise<ModelURIConfig | null> {
    if (!this.currentModel) {
      const storedModels = await StoreModelURI.getStoredModelURIs();
      if (storedModels.length > 0) {
        StoreModelURI.instance.currentModel =
          storedModels.filter((model) => model.active)[0] || null;
        return this.currentModel;
      }
      return null;
    }
    return this.currentModel;
  }
}

export default StoreModelURI;
