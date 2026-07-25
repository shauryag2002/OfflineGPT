import { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../common";
import { ChatHeader } from "./ChatHeader";
import { ChatInputBox } from "./ChatInputBox";
import { ChatMessage, ChatMessageItem } from "./ChatMessageItem";
import styles from "./style";

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: "1",
        role: "assistant",
        content: "Hello! I am OfflineGPT running locally on your device. How can I help you today?",
    },
];

/**
 * ChatScreen component — Modular UI for the simple chat page.
 * Displays the ChatHeader, a scrollable list of message bubbles, and ChatInputBox footer.
 */
const ChatScreen = () => {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [isGenerating, setIsGenerating] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!inputText.trim() || isGenerating) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: inputText.trim(),
        };

        // Add user message to conversation
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Simulate / placeholder for offline AI response generation (token-by-token integration)
        setIsGenerating(true);
        setTimeout(() => {
            const botResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "This is a local response demonstration. Real token streaming will connect here via GPTService!",
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsGenerating(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Header */}
            <ChatHeader title="OfflineGPT" subtitle="Local AI Assistant" />

            {/* 2. Conversation Message List */}
            <FlatList
                ref={flatListRef}
                data={messages}
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

            {/* 3. Footer Input Box */}
            <ChatInputBox
                value={inputText}
                onChangeText={setInputText}
                onSend={handleSend}
                isGenerating={isGenerating}
            />
        </SafeAreaView>
    );
};

export default ChatScreen;