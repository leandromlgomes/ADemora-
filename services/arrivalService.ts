import { supabase } from "@/lib/supabase";
import { Arrival } from "@/types/arrival";

export async function getArrivals(sessionId: string): Promise<Arrival[]> {
  const { data, error } = await supabase
    .from("arrivals")
    .select(`
      id,
      arrival_order,
      created_at,
      players (
        id,
        name,
        active
      )
    `)
    .eq("session_id", sessionId)
    .order("arrival_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.id,
    arrival_order: item.arrival_order,
    created_at: item.created_at,
    player: item.players,
  }));
}

export async function registerArrival(
  sessionId: string,
  playerId: string
) {
  const arrivals = await getArrivals(sessionId);

  const nextOrder = arrivals.length + 1;

  const { error } = await supabase.from("arrivals").insert({
    session_id: sessionId,
    player_id: playerId,
    arrival_order: nextOrder,
  });

  if (error) throw error;
}