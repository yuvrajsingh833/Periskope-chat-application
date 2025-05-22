'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useChatStore } from '@/stores/chat-store';
import { FiSearch, FiFilter, FiPlus, FiChevronDown, FiCheck } from 'react-icons/fi';

interface ChatSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const { chats } = useChatStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getChatName = (chat: any) => {
    if (chat.name) return chat.name;
    
    const participants = chat.chat_participants || [];
    return participants
      .map((p: any) => p.profiles?.display_name || 'Unknown User')
      .join(', ');
  };

  const getBadgeColor = (labelName: string) => {
    const colorMap: Record<string, string> = {
      'Demo': 'bg-orange-100 text-orange-800 border-orange-200',
      'Internal': 'bg-green-100 text-green-800 border-green-200',
      'Content': 'bg-blue-100 text-blue-800 border-blue-200',
      'Dont Send': 'bg-red-100 text-red-800 border-red-200',
      'Signup': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    
    return colorMap[labelName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const allLabels = Array.from(
    new Set(
      chats.flatMap(chat => 
        (chat.chat_labels || []).map(cl => cl.labels?.name || '')
      ).filter(Boolean)
    )
  );

  const filteredChats = chats.filter(chat => {
    // Search filter
    const chatName = getChatName(chat);
    const matchesSearch = searchTerm === '' || 
      chatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.last_message || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Label filter
    const matchesLabels = selectedLabels.length === 0 || 
      (chat.chat_labels || []).some(cl => 
        selectedLabels.includes(cl.labels?.name || '')
      );
    
    return matchesSearch && matchesLabels;
  });

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex h-full w-[320px] flex-col border-r bg-background">
      <div className="flex items-center justify-between p-4">
        <h2 className="flex items-center text-lg font-medium">
          <FiMessageCircle className="mr-2 h-5 w-5" />
          Chats
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <FiPlus className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 px-4 pb-2">
        <Button variant="outline" size="sm" className="flex w-full items-center justify-between">
          <span className="flex items-center">
            <FiFilter className="mr-2 h-3.5 w-3.5" />
            Custom filter
          </span>
          <FiChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
        <Button variant="outline" size="sm">Save</Button>
      </div>
      
      <div className="relative px-4 pb-4">
        <FiSearch className="absolute left-7 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-6 top-[7px]"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter className={`h-4 w-4 ${selectedLabels.length > 0 ? 'text-primary' : ''}`} />
          <span className="ml-1 text-xs">Filtered</span>
        </Button>
        
        {showFilters && (
          <div className="absolute left-4 right-4 top-12 z-10 mt-1 rounded-md border bg-background p-2 shadow-md">
            <div className="mb-2 text-sm font-medium">Filter by label:</div>
            <div className="flex flex-wrap gap-1">
              {allLabels.map(label => (
                <Badge 
                  key={label} 
                  variant="outline"
                  className={`cursor-pointer ${selectedLabels.includes(label) ? 'bg-primary/10' : ''}`}
                  onClick={() => toggleLabel(label)}
                >
                  {selectedLabels.includes(label) && (
                    <FiCheck className="mr-1 h-3 w-3" />
                  )}
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredChats.map((chat) => {
            const chatName = getChatName(chat);
            const chatLabels = (chat.chat_labels || []).map(cl => cl.labels?.name || '');
            const lastMessageDate = chat.last_message_at 
              ? new Date(chat.last_message_at)
              : new Date(chat.created_at);
            
            return (
              <button
                key={chat.id}
                className={`flex w-full items-start space-x-3 rounded-lg px-3 py-3 text-left hover:bg-accent ${
                  selectedChatId === chat.id ? 'bg-accent' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <Avatar className="mt-1 h-10 w-10">
                  <AvatarImage src={chat.is_group ? undefined : chat.chat_participants?.[0]?.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(chatName.split(',')[0] || 'Chat')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate font-medium">{chatName}</h3>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {format(lastMessageDate, 'HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-muted-foreground">
                      {chat.last_message || 'No messages yet'}
                    </p>
                  </div>
                  {chatLabels.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {chatLabels.map(label => (
                        <Badge 
                          key={label} 
                          variant="outline" 
                          className={`text-xs ${getBadgeColor(label)}`}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}