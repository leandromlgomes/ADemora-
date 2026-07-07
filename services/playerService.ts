import { supabase } from "@/lib/supabase";
import { Player } from "@/types/player";

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw error;

  return data as Player[];
}