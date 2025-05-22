import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import ChatLayout from '@/components/chat/chat-layout';

export const dynamic = 'force-dynamic';

export default async function ChatsPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: chats } = await supabase
    .from('chat_participants')
    .select(`
      chat_id,
      chats:chat_id(
        id,
        name,
        is_group,
        last_message,
        last_message_at,
        created_at,
        chat_labels(
          labels:label_id(
            id,
            name,
            color
          )
        ),
        chat_participants(
          profiles:user_id(
            id,
            display_name,
            avatar_url,
            phone_number
          )
        )
      )
    `)
    .eq('user_id', session.user.id)
    .order('chats(last_message_at)', { ascending: false, nullsFirst: false });

  return <ChatLayout initialProfile={profile} initialChats={chats} />;
}