import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

interface AppTextProps extends RNTextProps {
  variant?: "title" | "subtitle" | "body" | "caption";
  color?: string;
  children: React.ReactNode;
}

/**
 * Reusable AppText component to maintain consistent typography across the app.
 */
export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color,
  style,
  children,
  ...props
}) => {
  const textColor = color || (variant === "caption" ? Colors.textSecondary : Colors.text);

  return (
    <RNText style={[styles[variant], { color: textColor }, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
  },
});
