'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useChatStore } from '@/stores/chat-store';
import { FiX, FiPlus, FiUser, FiUsers, FiTag, FiRefreshCw } from 'react-icons/fi';

interface ChatDetailsProps {
  selectedChatId: string | null;
}

export default function ChatDetails({ selectedChatId }: ChatDetailsProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddLabelOpen, setIsAddLabelOpen] = useState(false);
  const { chats } = useChatStore();
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  
  if (!selectedChat) {
    return (
      <div className="hidden w-[320px] border-l lg:block">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Select a chat to view details</p>
        </div>
      </div>
    );
  }
  
  const participants = selectedChat.chat_participants || [];
  const labels = (selectedChat.chat_labels || []).map(cl => cl.labels).filter(Boolean);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="hidden w-[280px] border-l lg:block">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-medium">Details</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <FiX className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-65px)] px-4">
        <div className="space-y-6 pb-8">
          {/* Members section */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Members
              </h4>
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p>This functionality would allow adding new members to the chat.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {participants.map((participant: any, i: number) => (
                <div key={i} className="flex items-center space-x-3 rounded-lg p-2 hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(participant.profiles?.display_name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {participant.profiles?.display_name || 'Unknown User'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {participant.profiles?.phone_number || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Labels section */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Labels
              </h4>
              <Dialog open={isAddLabelOpen} onOpenChange={setIsAddLabelOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FiPlus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Label</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p>This functionality would allow adding labels to the chat.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {labels.map((label: any, i: number) => (
                <Badge key={i} variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: label?.color || '#888' }}
                  />
                  <span>{label?.name}</span>
                </Badge>
              ))}
              {labels.length === 0 && (
                <p className="text-sm text-muted-foreground">No labels</p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Photos and files section */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Shared Files
            </h4>
            <p className="text-sm text-muted-foreground">No files shared yet</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}