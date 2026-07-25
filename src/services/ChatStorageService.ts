import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "@/components/chat/ChatMessageItem";

const CHAT_MESSAGES_STORAGE_KEY = "@offline_gpt_chat_messages";

/**
 * ChatStorageService — Handles persisting and retrieving chat conversation history
 * using AsyncStorage.
 */
class ChatStorageService {
  private static instance: ChatStorageService;

  private constructor() {}

  public static getInstance(): ChatStorageService {
    if (!ChatStorageService.instance) {
      ChatStorageService.instance = new ChatStorageService();
    }
    return ChatStorageService.instance;
  }

  /**
   * Retrieves stored chat messages from AsyncStorage.
   */
  public async getChatMessages(): Promise<ChatMessage[]> {
    try {
      const data = await AsyncStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading chat history from storage:", error);
      return [];
    }
  }

  /**
   * Saves current chat messages array to AsyncStorage.
   */
  public async saveChatMessages(messages: ChatMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CHAT_MESSAGES_STORAGE_KEY,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error("Error saving chat history to storage:", error);
    }
  }

  /**
   * Clears saved chat messages from AsyncStorage.
   */
  public async clearChatMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing chat history from storage:", error);
    }
  }
}

export default ChatStorageService;
