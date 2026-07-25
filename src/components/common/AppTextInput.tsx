import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

/**
 * Reusable AppTextInput component styled with default theme colors.
 */
export const AppTextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      placeholderTextColor={Colors.textSecondary}
      style={[styles.input, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.backgroundElement,
    color: Colors.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
  },
});
