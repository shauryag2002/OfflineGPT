import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppButton, AppTextInput } from "../common";

interface ChatInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isGenerating?: boolean;
}

/**
 * ChatInputBox component representing the footer of the Chat page.
 * Contains the text input field and the send button.
 */
export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChangeText,
  onSend,
  isGenerating = false,
}) => {
  const canSend = value.trim().length > 0 && !isGenerating;

  return (
    <View style={styles.footerContainer}>
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask OfflineGPT something..."
        style={styles.textInput}
        multiline
        maxLength={1000}
      />
      <AppButton
        title="Send"
        onPress={onSend}
        disabled={!canSend}
        loading={isGenerating}
        style={styles.sendButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElement,
    backgroundColor: Colors.background,
    gap: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 18,
    height: 44,
  },
});
