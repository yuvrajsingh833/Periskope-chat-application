'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabase } from '@/providers/supabase-provider';
import { useChatStore } from '@/stores/chat-store';
import { get, set } from 'idb-keyval';
import { Database } from '@/lib/supabase/schema';
import { FiPaperclip, FiSmile, FiSend, FiClock, FiCheck, FiMic, FiImage, FiPaperclip as FiAttachment } from 'react-icons/fi';

type Message = Database['public']['Tables']['messages']['Row'];

interface ChatMessagesProps {
  selectedChatId: string | null;
}

export default function ChatMessages({ selectedChatId }: ChatMessagesProps) {
  const { supabase, session } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentTab, setCurrentTab] = useState('whatsapp');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chats, profile } = useChatStore();
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  
  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    defaultValues: { message: '' }
  });

  useEffect(() => {
    if (selectedChatId && session) {
      setIsLoading(true);
      
      // First try to get messages from IndexedDB
      get(`chat_messages_${selectedChatId}`).then((cachedMessages) => {
        if (cachedMessages) {
          setMessages(cachedMessages);
          setIsLoading(false);
        }
        
        // Then fetch from Supabase to get the latest
        fetchMessages();
      }).catch(() => {
        // If IndexedDB fails, just fetch from Supabase
        fetchMessages();
      });
    } else {
      setMessages([]);
    }
  }, [selectedChatId, session]);

  const fetchMessages = async () => {
    if (!selectedChatId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            id, 
            display_name,
            avatar_url
          )
        `)
        .eq('chat_id', selectedChatId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
        // Cache in IndexedDB
        set(`chat_messages_${selectedChatId}`, data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: { message: string }) => {
    if (!selectedChatId || !session || !data.message.trim()) return;
    
    setIsSending(true);
    
    try {
      const newMessage = {
        content: data.message,
        chat_id: selectedChatId,
        sender_id: session.user.id,
        is_read: false,
      };
      
      const { error } = await supabase.from('messages').insert(newMessage);
      
      if (error) throw error;
      
      // Update chat's last message
      await supabase
        .from('chats')
        .update({
          last_message: data.message,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', selectedChatId);
      
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedChatId || !selectedChat) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">Select a chat to start messaging</h3>
          <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getChatName = () => {
    if (selectedChat.name) return selectedChat.name;
    
    const participants = selectedChat.chat_participants || [];
    return participants
      .map((p: any) => p.profiles?.display_name || 'Unknown User')
      .join(', ');
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={undefined} />
            <AvatarFallback>{getInitials(getChatName().split(',')[0] || 'Chat')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{getChatName()}</h2>
            <div className="text-xs text-muted-foreground">
              {selectedChat.chat_participants?.map((p: any) => 
                p.profiles?.display_name).join(', ')}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="whatsapp" className="w-auto" onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="cvfer">CVFER</TabsTrigger>
              <TabsTrigger value="cdert">CDERT</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="private_note">Private Note</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center py-8 text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === session?.user.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'rounded-br-none bg-green-100 text-green-900'
                        : 'rounded-bl-none bg-white text-black'
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="mb-1 text-xs font-medium text-blue-600">
                        {(message.sender as any)?.display_name || 'Unknown User'}
                      </div>
                    )}
                    <p>{message.content}</p>
                    <div className="mt-1 flex items-center justify-end space-x-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), 'HH:mm')}
                      </span>
                      {isOwnMessage && (
                        <FiCheck className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0">
            <FiPaperclip className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="shrink-0">
            <FiSmile className="h-5 w-5" />
          </Button>
          <Input
            {...register('message')}
            placeholder="Message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="icon" 
            className="shrink-0 bg-green-600 text-white hover:bg-green-700"
            disabled={isSending}
          >
            <FiSend className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}