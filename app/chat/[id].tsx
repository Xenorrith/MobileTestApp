import { MessageBubble } from "@/components/chat/MessageBubble";
import { useAuth } from "@/hooks/useAuth";
import {
    fetchConversationById,
    fetchMessages,
    sendMessage,
} from "@/lib/chat";
import { supabase } from "@/lib/supabaseClient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Conversation, Message } from "@/types/chat";

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const router = useRouter();

    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [inputText, setInputText] = useState("");

    const flatListRef = useRef<FlatList>(null);

    const loadData = useCallback(async () => {
        if (!user || !id) return;
        try {
            const [convData, msgsData] = await Promise.all([
                fetchConversationById(id, user.id),
                fetchMessages(id),
            ]);
            setConversation(convData);
            setMessages(msgsData);
        } catch (error) {
            console.error("Failed to load chat data", error);
        } finally {
            setLoading(false);
        }
    }, [user, id]);

    useEffect(() => {
        loadData();

        // Set up Realtime subscription
        const channel = supabase
            .channel(`messages:${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${id}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        // Check if message already exists to avoid duplicates
                        if (prev.some(msg => msg.id === newMessage.id)) {
                            return prev;
                        }
                        return [...prev, newMessage];
                    });
                    // Auto-scroll to bottom on new message
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadData, id]);

    const handleSend = async () => {
        if (!user || !inputText.trim() || !conversation?.other_user?.id) return;

        const content = inputText.trim();
        setInputText("");
        setSending(true);

        try {
            await sendMessage(user.id, conversation.other_user.id, content);
            // Refresh messages immediately
            const newMessages = await fetchMessages(id!);
            setMessages(newMessages);
        } catch (error) {
            console.error("Failed to send message", error);
            // Restore text on error
            setInputText(content);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0D8ABC" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#EFFFF7" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {conversation?.other_user?.name || "Chat"}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={styles.keyboardView}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => (
                        <MessageBubble
                            key={item.id}
                            message={item}
                            isOwnMessage={item.sender === user?.id}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <MaterialIcons name="send" size={24} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#012333",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#012333",
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#EFFFF7",
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    keyboardView: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },
    listContent: {
        padding: 16,
        gap: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E1E1E1",
    },
    input: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#0D8ABC",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonDisabled: {
        backgroundColor: "#B0C4DE",
    },
});
