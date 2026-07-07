type Arrival = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  arrivals: Arrival[];
};

export default function Ranking({ arrivals }: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-5">
        🏆 Ranking
      </h2>

      {arrivals.length === 0 && (
        <p>Ninguém chegou ainda.</p>
      )}

      {arrivals.map((player, index) => {
        const medal =
          index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : `${index + 1}º`;

        return (
          <div
            key={player.id}
            className="bg-slate-800 rounded-lg p-4 mb-3 flex justify-between"
          >
            <span>
              {medal} {player.name}
            </span>

            <span>
              {new Date(player.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}