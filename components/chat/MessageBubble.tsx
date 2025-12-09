import type { Message } from "@/types/chat";
import { formatTime } from "@/utils/date";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
    return (
        <View
            style={[
                styles.container,
                isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
                ]}
            >
                <Text style={[styles.text, isOwnMessage ? styles.myText : styles.theirText]}>
                    {message.content}
                </Text>
            </View>
            <Text style={[styles.time, isOwnMessage ? styles.myTime : styles.theirTime]}>
                {formatTime(message.created_at)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: "80%",
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    ownMessageContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#50FFA1",
        borderBottomRightRadius: 4,
    },
    otherMessageContainer: {
        alignSelf: "flex-start",
        backgroundColor: "#081F2C",
        borderBottomLeftRadius: 4,
    },
    bubble: {
        marginBottom: 4,
    },
    ownMessageBubble: {
        // Additional styles for own message bubble if needed
    },
    otherMessageBubble: {
        // Additional styles for other message bubble if needed
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
    },
    myText: {
        color: "#012333",
    },
    theirText: {
        color: "#EFFFF7",
    },
    time: {
        fontSize: 11,
        marginTop: 2,
    },
    myTime: {
        color: "rgba(1, 35, 51, 0.7)",
        alignSelf: "flex-end",
    },
    theirTime: {
        color: "#6C7A89",
        alignSelf: "flex-start",
    },
});
