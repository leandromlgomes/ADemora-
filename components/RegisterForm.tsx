"use client";

type Props = {
  name: string;
  setName: (value: string) => void;
  onRegister: () => void;
  loading: boolean;
};

export default function RegisterForm({
  name,
  setName,
  onRegister,
  loading,
}: Props) {
  return (
    <div className="mt-10 flex gap-3">
      <input
        className="flex-1 rounded-lg p-3 text-black"
        placeholder="Nome..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onRegister();
        }}
      />

      <button
        onClick={onRegister}
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 rounded-lg"
      >
        Registrar
      </button>
    </div>
  );
}