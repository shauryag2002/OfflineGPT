import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./style";

const ChatScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chatContainer}>
                <Text style={styles.chatTitle}>
                    Chat Screen
                </Text>
                <Text style={styles.chatDescription}>
                    This screen opens outside the bottom tab bar.
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default ChatScreen; 