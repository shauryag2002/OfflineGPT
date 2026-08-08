import DownloadModelPopup from "@/components/popup/DownloadModelPopup";
import ChatStorageService from "@/services/ChatStorageService";
import GPTService, { ChatMessagePayload } from "@/services/GPTService";
import { useEffect, useRef, useState } from "react";
import { FlatList, Platform, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../common";
import { ChatHeader } from "./ChatHeader";
import { ChatInputBox } from "./ChatInputBox";
import { ChatMessage, ChatMessageItem } from "./ChatMessageItem";
import styles from "./style";

const MODEL_URL = process.env.EXPO_PUBLIC_MODEL_URL || "";

const WELCOME_MESSAGE: ChatMessage = {
    id: "welcome-1",
    role: "assistant",
    content: "Hello! I am OfflineGPT running locally on your device. How can I help you today?",
};

/**
 * ChatScreen component — Connected with GPTService and ChatStorageService.
 * Handles persistent chat history, local LLM token streaming, download popup, and model lifecycle.
 */
const ChatScreen = () => {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [isDownloadPopupVisible, setDownloadPopupVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const gptService = GPTService.getInstance();
    const storageService = ChatStorageService.getInstance();

    const initModelRuntime = async () => {
        try {
            await gptService.initializeLlamaRuntime();
            setModelLoaded(true);
            setDownloadPopupVisible(false);
        } catch (error) {
            console.log("No active model found or runtime error:", error);
            setModelLoaded(false);
            setDownloadPopupVisible(true);
            throw error;
        }
    };

    // 1. Load chat history and initialize LLM runtime on mount
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            // Load saved messages
            const savedMessages = await storageService.getChatMessages();
            if (isMounted && savedMessages.length > 0) {
                setMessages(savedMessages);
            }

            // Initialize local Llama runtime
            try {
                await initModelRuntime();
            } catch {
                // Handled inside initModelRuntime
            }
        };

        loadData();

        // Cleanup: stop any ongoing generation when screen unmounts
        return () => {
            isMounted = false;
            gptService.stopCompletion().catch(() => { });
        };
    }, []);

    // 2. Handle sending user message & streaming LLM completion
    const handleSend = async () => {
        const trimmedInput = inputText.trim();
        if (!trimmedInput || isGenerating || !modelLoaded) {
            return;
        }

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: trimmedInput,
        };

        // Add user message to state & save to AsyncStorage
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputText("");
        await storageService.saveChatMessages(updatedMessages);

        // Prepare placeholder assistant message for token-by-token streaming
        const assistantMsgId = (Date.now() + 1).toString();
        const assistantPlaceholder: ChatMessage = {
            id: assistantMsgId,
            role: "assistant",
            content: "",
        };

        const messagesWithPlaceholder = [...updatedMessages, assistantPlaceholder];
        setMessages(messagesWithPlaceholder);
        setIsGenerating(true);

        try {
            // Build payload for GPTService
            const payload: ChatMessagePayload[] = updatedMessages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            let accumulatedContent = "";

            // Stream tokens real-time from llama.rn engine
            const fullResponse = await gptService.chatCompletion(
                payload,
                (token: string) => {
                    accumulatedContent += token;
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, content: accumulatedContent }
                                : msg,
                        ),
                    );
                },
            );

            // Finalize completed message and save to storage
            const finalAssistantMsg: ChatMessage = {
                id: assistantMsgId,
                role: "assistant",
                content: fullResponse || accumulatedContent || "No response received.",
            };

            const finalMessagesList = [...updatedMessages, finalAssistantMsg];
            setMessages(finalMessagesList);
            await storageService.saveChatMessages(finalMessagesList);
        } catch (error) {
            console.error("Chat completion error:", error);
            const errorMsg: ChatMessage = {
                id: assistantMsgId,
                role: "assistant",
                content: "Sorry, an error occurred while processing offline. Please check if model is downloaded.",
            };
            const finalMessagesList = [...updatedMessages, errorMsg];
            setMessages(finalMessagesList);
            await storageService.saveChatMessages(finalMessagesList);
        } finally {
            setIsGenerating(false);
        }
    };

    const clearHistory = async () => {
        setMessages([WELCOME_MESSAGE]);
        await storageService.clearChatMessages();
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
            {/* Header (Back button hidden by default) */}
            <ChatHeader
                title="OfflineGPT"
                subtitle={modelLoaded ? "Model Ready (Offline)" : "Initializing Model..."}
                showBackButton={false}
                clearHistory={clearHistory}
            />

            {/* Keyboard-aware Container */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                {/* Message List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    style={{ flex: 1 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ChatMessageItem message={item} />}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <AppText style={styles.emptyTitle}>No messages yet</AppText>
                            <AppText style={styles.emptyText}>
                                Start a conversation with your offline AI assistant.
                            </AppText>
                        </View>
                    }
                />

                {/* Footer Input Box */}
                <ChatInputBox
                    value={inputText}
                    onChangeText={setInputText}
                    onSend={handleSend}
                    isGenerating={isGenerating}
                    isModelLoaded={modelLoaded}
                />
            </KeyboardAvoidingView>

            {/* Download AI Model Popup */}
            <DownloadModelPopup
                visible={isDownloadPopupVisible}
                modelUrl={MODEL_URL}
                onDownloaded={async () => {
                    await initModelRuntime();
                    setDownloadPopupVisible(false);
                }}
            />
        </SafeAreaView>
    );
};

export default ChatScreen;