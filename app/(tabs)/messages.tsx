import { ConversationItem } from "@/components/chat/ConversationItem";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchConversations } from "@/lib/chat";
import type { Conversation } from "@/types/chat";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Messages = () => {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadConversations = useCallback(async () => {
        if (!user) return;
        try {
            const data = await fetchConversations(user.id);
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [loadConversations])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadConversations();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0D8ABC" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTopRow}>
                    <Text style={styles.pageTitle}>Messages</Text>
                </View>
            </View>

            <FlatList
                data={conversations}
                renderItem={({ item }) => (
                    <ConversationItem
                        conversation={item}
                        currentUserId={user?.id || ""}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <EmptyState
                        title="No messages yet"
                        message="Start a conversation from a task offer"
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F5F9",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: "#012333",
        borderBottomWidth: 1,
        borderBottomColor: "#081F2C",
    },
    headerTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#EFFFF7",
    },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
});

export default Messages;
