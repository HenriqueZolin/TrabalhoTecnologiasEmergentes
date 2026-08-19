"use client";

import { useRouter } from "next/navigation";
import { SimulationBadge } from "@/app/components/SimulationBadge";

export default function LoginPage() {
  const router = useRouter();

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    router.push("/pagamento");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar no Synapse</h1>
        <SimulationBadge>Simulação — sem autenticação real</SimulationBadge>
      </div>

      <form
        onSubmit={entrar}
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="senha" className="text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
