'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/supabase-provider';
import ChatSidebar from './chat-sidebar';
import ChatNavigation from './chat-navigation';
import ChatMessages from './chat-messages';
import ChatDetails from './chat-details';
import { useChatStore } from '@/stores/chat-store';
import { set, get } from 'idb-keyval';
import { Database } from '@/lib/supabase/schema';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Chat = {
  chat_id: string;
  chats: {
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
      };
    }[];
    chat_participants: {
      profiles: {
        id: string;
        display_name: string | null;
        avatar_url: string | null;
        phone_number: string | null;
      };
    }[];
  };
};

interface ChatLayoutProps {
  initialProfile: Profile | null;
  initialChats: Chat[] | null;
}

export default function ChatLayout({ initialProfile, initialChats }: ChatLayoutProps) {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { setProfile, setChats, addMessage } = useChatStore();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
    
    if (initialChats) {
      setChats(initialChats.map(chat => ({
        ...chat.chats
      })));
      
      if (initialChats.length > 0 && !selectedChatId) {
        setSelectedChatId(initialChats[0].chat_id);
      }
    }
  }, [initialProfile, initialChats, setProfile, setChats, selectedChatId]);

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Database['public']['Tables']['messages']['Row'];
          get(`chat_messages_${newMessage.chat_id}`).then((messages) => {
            const existingMessages = messages || [];
            set(`chat_messages_${newMessage.chat_id}`, [...existingMessages, newMessage]);
          });
          
          addMessage(newMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, addMessage]);

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatNavigation />
      <ChatSidebar selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
      <ChatMessages selectedChatId={selectedChatId} />
      <ChatDetails selectedChatId={selectedChatId} />
    </div>
  );
}