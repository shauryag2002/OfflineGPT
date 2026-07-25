import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { AppText } from "../common";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

/**
 * ChatMessageItem component to render message bubbles.
 * User messages align to the right, Assistant messages align to the left.
 */
export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.row,
        isUser ? styles.userRow : styles.assistantRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <AppText variant="caption" style={styles.roleText}>
          {isUser ? "You" : "OfflineGPT"}
        </AppText>
        <AppText style={styles.messageText}>{message.content}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 6,
    flexDirection: "row",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
  },
  userBubble: {
    backgroundColor: Colors.backgroundSelected,
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: Colors.backgroundElement,
    borderBottomLeftRadius: 2,
  },
  roleText: {
    marginBottom: 4,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  messageText: {
    lineHeight: 20,
  },
});
