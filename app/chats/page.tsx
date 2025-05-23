"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/supabase-provider";

export default function Home() {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/chats";
      } else {
        window.location.href = "/login";
      }
    };

    checkSession();
  }, [supabase.auth, router]);

  return null;
}
