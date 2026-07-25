import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/theme";
import { AppText } from "./AppText";

interface AppButtonProps extends TouchableOpacityProps {
  title?: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

/**
 * Reusable AppButton component with touch feedback and loading state.
 */
export const AppButton: React.FC<AppButtonProps> = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  style,
  children,
  ...props
}) => {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} size="small" />
      ) : children ? (
        children
      ) : (
        <AppText style={styles.buttonText}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: Colors.backgroundSelected,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundElement,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
