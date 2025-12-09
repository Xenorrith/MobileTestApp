import type { Conversation, Message } from "@/types/chat";
import { supabase } from "./supabaseClient";

/**
 * Fetches all conversations for a specific user.
 * It also fetches the profile of the "other" user in the conversation.
 */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
        .from("conversations")
        .select(`
            *,
            user1_profile:user1 (id, name, avatar_url),
            user2_profile:user2 (id, name, avatar_url),
            messages (
                id,
                content,
                created_at,
                sender
            )
        `)
        .or(`user1.eq.${userId},user2.eq.${userId}`)
        .order("created_at", { ascending: false })
        .order("created_at", { foreignTable: "messages", ascending: false })
        .limit(1, { foreignTable: "messages" });

    if (error) {
        throw error;
    }

    return data.map((conv: any) => {
        const isUser1 = conv.user1 === userId;
        const otherUserProfile = isUser1 ? conv.user2_profile : conv.user1_profile;
        const lastMessage = conv.messages?.[0] || null;

        return {
            id: conv.id,
            user1: conv.user1,
            user2: conv.user2,
            created_at: conv.created_at,
            last_message: lastMessage,
            other_user: otherUserProfile,
        };
    });
}

/**
 * Fetches a single conversation by ID.
 */
export async function fetchConversationById(conversationId: string, userId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
        .from("conversations")
        .select(`
            *,
            user1_profile:user1 (id, name, avatar_url),
            user2_profile:user2 (id, name, avatar_url)
        `)
        .eq("id", conversationId)
        .single();

    if (error) {
        return null;
    }

    const isUser1 = data.user1 === userId;
    const otherUserProfile = isUser1 ? data.user2_profile : data.user1_profile;

    return {
        id: data.id,
        user1: data.user1,
        user2: data.user2,
        created_at: data.created_at,
        other_user: otherUserProfile,
    };
}

/**
 * Fetches all messages for a specific conversation.
 */
export async function fetchMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }

    return data as Message[];
}

/**
 * Sends a message.
 * If a conversation between the two users already exists, it uses that.
 * Otherwise, it creates a new conversation first.
 */
export async function sendMessage(
    senderId: string,
    receiverId: string,
    content: string
): Promise<Message> {
    // 1. Check if conversation exists
    // We need to check both (user1=sender, user2=receiver) AND (user1=receiver, user2=sender)
    // But since we have a unique index on LEAST(user1, user2), GREATEST(user1, user2),
    // we can normalize our query or just try to find one.

    const { data: existingConvs, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .or(`and(user1.eq.${senderId},user2.eq.${receiverId}),and(user1.eq.${receiverId},user2.eq.${senderId})`)
        .single();

    let conversationId = existingConvs?.id;

    if (!conversationId) {
        // Create new conversation
        // Ensure consistent ordering for user1/user2 to match unique constraint logic if enforced strictly,
        // though the DB constraint uses LEAST/GREATEST so insertion order shouldn't fail uniqueness check
        // as long as we don't try to insert the "same" pair again.
        // However, for the insert, we just put them in.

        const { data: newConv, error: createError } = await supabase
            .from("conversations")
            .insert({
                user1: senderId,
                user2: receiverId,
            })
            .select("id")
            .single();

        if (createError) {
            throw createError;
        }
        conversationId = newConv.id;
    }

    // 2. Insert message
    const { data: newMessage, error: messageError } = await supabase
        .from("messages")
        .insert({
            conversation_id: conversationId,
            sender: senderId,
            content: content,
        })
        .select("*")
        .single();

    if (messageError) {
        throw messageError;
    }

    return newMessage as Message;
}

/**
 * Gets an existing conversation or creates a new one.
 */
export async function getOrCreateConversation(
    senderId: string,
    receiverId: string
): Promise<string> {
    // 1. Check if conversation exists
    const { data: existingConvs, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .or(`and(user1.eq.${senderId},user2.eq.${receiverId}),and(user1.eq.${receiverId},user2.eq.${senderId})`)
        .single();

    if (existingConvs?.id) {
        return existingConvs.id;
    }

    // 2. Create new conversation
    const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
            user1: senderId,
            user2: receiverId,
        })
        .select("id")
        .single();

    if (createError) {
        throw createError;
    }

    return newConv.id;
}
