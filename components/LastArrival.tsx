type Arrival = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  arrival?: Arrival;
};

export default function LastArrival({ arrival }: Props) {
  if (!arrival) return null;

  return (
    <div className="mt-12 bg-yellow-400 text-black rounded-xl p-8 text-center">
      <div className="text-6xl">
        🐢
      </div>

      <h2 className="text-4xl font-bold mt-3">
        A DEMORA É...
      </h2>

      <div className="text-5xl mt-5 font-extrabold">
        {arrival.name.toUpperCase()}
      </div>

      <p className="mt-4 text-xl">
        Chegou às{" "}
        {new Date(arrival.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}