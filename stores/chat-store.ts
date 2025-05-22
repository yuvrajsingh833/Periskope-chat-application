'use client';

import { create } from 'zustand';
import { Database } from '@/lib/supabase/schema';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

type Chat = {
  id: string;
  name: string | null;
  is_group: boolean;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  chat_labels: {
    labels: {
      id: string;
      name: string;
      color: string;
    } | null;
  }[];
  chat_participants: {
    profiles: {
      id: string;
      display_name: string | null;
      avatar_url: string | null;
      phone_number: string | null;
    } | null;
  }[];
};

interface ChatStore {
  profile: Profile | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  setProfile: (profile: Profile) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, data: Partial<Chat>) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  profile: null,
  chats: [],
  messages: {},
  setProfile: (profile) => set({ profile }),
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ 
    chats: [chat, ...state.chats] 
  })),
  updateChat: (chatId, data) => set((state) => ({
    chats: state.chats.map((chat) => 
      chat.id === chatId ? { ...chat, ...data } : chat
    ),
  })),
  setMessages: (chatId, messages) => set((state) => ({
    messages: { ...state.messages, [chatId]: messages },
  })),
  addMessage: (message) => set((state) => {
    // Update messages
    const currentMessages = state.messages[message.chat_id] || [];
    const updatedMessages = [...currentMessages, message];
    
    // Update chat's last message
    const updatedChats = state.chats.map(chat => {
      if (chat.id === message.chat_id) {
        return {
          ...chat,
          last_message: message.content,
          last_message_at: message.created_at,
        };
      }
      return chat;
    });
    
    // Sort chats by last message date
    updatedChats.sort((a, b) => {
      const dateA = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
      const dateB = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return {
      messages: { 
        ...state.messages, 
        [message.chat_id]: updatedMessages 
      },
      chats: updatedChats,
    };
  }),
}));