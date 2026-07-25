import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { AppText } from "../common";

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * ChatHeader component displayed at the top of the Chat page.
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "OfflineGPT",
  subtitle = "Local AI Engine",
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <AppText style={styles.backText}>← Back</AppText>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <AppText variant="subtitle">{title}</AppText>
        <AppText variant="caption">{subtitle}</AppText>
      </View>

      {/* Spacer to align title centrally */}
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElement,
    backgroundColor: Colors.background,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: Colors.backgroundElement,
  },
  backText: {
    fontSize: 13,
    fontWeight: "500",
  },
  titleContainer: {
    alignItems: "center",
  },
  spacer: {
    width: 60,
  },
});
