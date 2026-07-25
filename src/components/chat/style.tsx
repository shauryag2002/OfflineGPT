import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    chatContainer: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
    chatTitle: { color: Colors.text, fontSize: 20, fontWeight: "600" },
    chatDescription: { color: Colors.textSecondary, marginTop: 8 },
});

export default styles;