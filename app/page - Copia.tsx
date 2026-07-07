"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Player = {
  id: string;
  name: string;
  active: boolean;
};

type GameSession = {
  id: string;
  game_date: string;
  status: "OPEN" | "CLOSED";
};

type Arrival = {
  id: string;
  arrival_order: number;
  created_at: string;
  player: Player;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [session, setSession] = useState<GameSession | null>(null);

  const [newPlayer, setNewPlayer] = useState("");

  const [loading, setLoading] = useState(false);
  const [savingPlayer, setSavingPlayer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const today = new Date().toISOString().split("T")[0];

    // procura sessão

    let { data: session } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("game_date", today)
      .single();

    if (!session) {
      const { data } = await supabase
        .from("game_sessions")
        .insert({
          game_date: today,
        })
        .select()
        .single();

      session = data;
    }

    setSession(session);

    // jogadores

    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .eq("active", true)
      .order("name");

    setPlayers(playersData ?? []);

    // chegadas

    const { data: arrivalsData } = await supabase
      .from("arrivals")
      .select(`
        id,
        arrival_order,
        created_at,
        players(
          id,
          name,
          active
        )
      `)
      .eq("session_id", session.id)
      .order("arrival_order");

    const ranking =
      arrivalsData?.map((a: any) => ({
        id: a.id,
        arrival_order: a.arrival_order,
        created_at: a.created_at,
        player: a.players,
      })) ?? [];

    setArrivals(ranking);
  }

  async function registerPlayer() {
    if (!newPlayer.trim()) return;

    setSavingPlayer(true);

    const { error } = await supabase.from("players").insert({
      name: newPlayer.trim(),
    });

    if (error) {
      alert(error.message);
      setSavingPlayer(false);
      return;
    }

    setNewPlayer("");

    await loadData();

    setSavingPlayer(false);
  }

  async function registerArrival(playerId: string) {
    if (!session) return;

    setLoading(true);

    const nextOrder = arrivals.length + 1;

    const { error } = await supabase.from("arrivals").insert({
      session_id: session.id,
      player_id: playerId,
      arrival_order: nextOrder,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await loadData();

    setLoading(false);
  }

  const availablePlayers = players.filter(
    (p) => !arrivals.some((a) => a.player.id === p.id)
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center">
          🐢 A Demora É...
        </h1>

        <p className="text-center text-slate-400 mt-3">
          Sessão {session?.game_date}
        </p>

        <div className="mt-10 bg-slate-800 rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            ➕ Cadastrar Jogador
          </h2>

          <div className="flex gap-3">

            <input
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Nome do jogador"
              className="flex-1 rounded-lg p-3 text-black"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  registerPlayer();
              }}
            />

            <button
              onClick={registerPlayer}
              disabled={savingPlayer}
              className="bg-green-600 hover:bg-green-700 px-6 rounded-lg font-bold"
            >
              Cadastrar
            </button>

          </div>

        </div>

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-5">
            Quem chegou?
          </h2>

          {availablePlayers.length == 0 ? (

            <div className="bg-green-700 rounded-xl p-5 text-center">
              🎉 Todos chegaram!
            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {availablePlayers.map((player) => (

                <button
                  key={player.id}
                  disabled={loading}
                  onClick={() => registerArrival(player.id)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl p-5 text-xl font-bold"
                >
                  {player.name}
                </button>

              ))}

            </div>

          )}

          <div className="mt-14">

            <h2 className="text-3xl font-bold mb-5">
              🏆 Ranking da Noite
            </h2>

            {arrivals.length === 0 ? (

              <div className="bg-slate-800 rounded-xl p-5 text-center text-slate-400">
                Ninguém chegou ainda.
              </div>

            ) : (

              <div className="space-y-3">

                {arrivals.map((arrival) => {

                  let medal = `${arrival.arrival_order}º`;

                  if (arrival.arrival_order === 1) medal = "🥇";
                  if (arrival.arrival_order === 2) medal = "🥈";
                  if (arrival.arrival_order === 3) medal = "🥉";

                  return (

                    <div
                      key={arrival.id}
                      className="bg-slate-800 rounded-xl p-5 flex justify-between items-center"
                    >

                      <div className="text-xl font-semibold">
                        {medal} {arrival.player.name}
                      </div>

                      <div className="text-slate-400">
                        {new Date(arrival.created_at).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

          {arrivals.length > 0 && (

            <div className="mt-14 rounded-2xl bg-yellow-400 text-black p-10 text-center">

              <div className="text-7xl">
                🐢
              </div>

              <h2 className="text-5xl font-bold mt-4">
                A DEMORA É...
              </h2>

              <div className="text-6xl font-extrabold mt-6">
                {arrivals[arrivals.length - 1].player.name.toUpperCase()}
              </div>

              <p className="text-xl mt-6">
                Até o momento...
              </p>

            </div>

          )}

        </div>

      </div>

    </main>

  );

}