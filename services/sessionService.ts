import { supabase } from "@/lib/supabase";
import { GameSession } from "@/types/session";

export async function getOrCreateTodaySession(): Promise<GameSession> {

  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("game_date", today)
    .single();

  if (data) {
    return data;
  }

  const { data: created, error } = await supabase
    .from("game_sessions")
    .insert({
      game_date: today
    })
    .select()
    .single();

  if (error) throw error;

  return created;
}