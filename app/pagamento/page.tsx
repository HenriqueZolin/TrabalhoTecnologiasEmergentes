"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SimulationBadge } from "@/app/components/SimulationBadge";
import { lerPlanoSelecionado, SelectedPlan } from "@/lib/selectedPlan";
import { formatBRL } from "@/lib/format";

function resumoPlano(plano: SelectedPlan) {
  if (plano.tipo === "individual") {
    return {
      titulo: "Plano Individual",
      detalhes: ["1 consultor", "Clientes ilimitados"],
      preco: plano.preco,
    };
  }
  if (plano.tipo === "equipe") {
    return {
      titulo: "Plano Equipe",
      detalhes: [
        `${plano.consultores} consultores`,
        `${plano.clientesEstimados} clientes estimados`,
      ],
      preco: plano.preco,
    };
  }
  return {
    titulo: "Plano Enterprise",
    detalhes: ["10+ consultores", "Preço sob consulta"],
    preco: null,
  };
}

export default function PagamentoPage() {
  const [plano, setPlano] = useState<SelectedPlan | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única de localStorage no mount, não há como evitar o efeito
    setPlano(lerPlanoSelecionado());
    setCarregado(true);
  }, []);

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    setConfirmado(true);
  }

  if (!carregado) return null;

  if (!plano) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Nenhum plano selecionado</h1>
        <p className="text-sm text-slate-600">
          Volte para a tela de planos e escolha uma opção antes de continuar.
        </p>
        <Link
          href="/planos"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Ver planos
        </Link>
      </main>
    );
  }

  const resumo = resumoPlano(plano);

  if (confirmado) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </div>
        <h1 className="text-xl font-semibold">Pagamento confirmado</h1>
        <p className="text-sm text-slate-600">
          {resumo.titulo} contratado com sucesso (simulação).
        </p>
        <SimulationBadge>Simulação — nenhum dado é processado ou salvo</SimulationBadge>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Pagamento</h1>
        <SimulationBadge>Simulação — nenhum dado é processado ou salvo</SimulationBadge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Resumo do plano</h2>
          <p className="mt-1 text-sm text-slate-500">{resumo.titulo}</p>

          <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
            {resumo.detalhes.map((linha) => (
              <li key={linha}>{linha}</li>
            ))}
          </ul>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <span className="text-2xl font-bold">
              {resumo.preco !== null ? formatBRL(resumo.preco) : "Sob consulta"}
            </span>
            {resumo.preco !== null && <span className="text-slate-500">/mês</span>}
          </div>
        </section>

        <form
          onSubmit={confirmar}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Dados de pagamento</h2>

          <div>
            <label htmlFor="numero-cartao" className="text-sm font-medium text-slate-700">
              Número do cartão
            </label>
            <input
              id="numero-cartao"
              type="text"
              placeholder="0000 0000 0000 0000"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="validade" className="text-sm font-medium text-slate-700">
                Validade
              </label>
              <input
                id="validade"
                type="text"
                placeholder="MM/AA"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="text-sm font-medium text-slate-700">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                placeholder="123"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Confirmar
          </button>
        </form>
      </div>
    </main>
  );
}
