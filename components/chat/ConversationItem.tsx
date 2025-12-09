import type { Conversation } from "@/types/chat";
import { formatTime } from "@/utils/date";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConversationItemProps {
    conversation: Conversation;
    currentUserId: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
    const otherUser = conversation.other_user;
    const lastMessage = conversation.last_message;

    const avatarUrl = otherUser?.avatar_url ||
        `https://ui-avatars.com/api/?name=${otherUser?.name || "User"}&background=0D8ABC&color=fff`;

    return (
        <Link href={`/chat/${conversation.id}`} asChild>
            <TouchableOpacity style={styles.container}>
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name} numberOfLines={1}>
                            {otherUser?.name || "Unknown User"}
                        </Text>
                        {lastMessage && (
                            <Text style={styles.time}>
                                {formatTime(lastMessage.created_at)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.messageRow}>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {lastMessage?.content || "No messages yet"}
                        </Text>
                        {/* Optional: Add unread badge here if we had that data */}
                    </View>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#C4C4C4" />
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: "#E1E1E1",
    },
    content: {
        flex: 1,
        marginRight: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#012333",
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: "#6C7A89",
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageText: {
        fontSize: 14,
        color: "#6C7A89",
        flex: 1,
    },
});
