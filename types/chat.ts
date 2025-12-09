export interface Message {
    id: string;
    conversation_id: string;
    sender: string;
    content: string;
    created_at: string;
}

export interface Conversation {
    id: string;
    user1: string;
    user2: string;
    created_at: string;
    last_message?: Message;
    other_user?: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
}