"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calcularPreco,
  EQUIPE_MAX_CONSULTORES,
  EQUIPE_MIN_CONSULTORES,
} from "@/lib/pricing";
import { salvarPlanoSelecionado } from "@/lib/selectedPlan";
import { formatBRL } from "@/lib/format";

export default function PlanosPage() {
  const router = useRouter();
  const equipeCardRef = useRef<HTMLDivElement>(null);
  const [destacarEquipe, setDestacarEquipe] = useState(false);

  const [consultores, setConsultores] = useState(EQUIPE_MIN_CONSULTORES);
  const [clientesEstimados, setClientesEstimados] = useState(150);

  const precoEquipe = calcularPreco(consultores, clientesEstimados);

  function irParaEquipe() {
    equipeCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setDestacarEquipe(true);
    window.setTimeout(() => setDestacarEquipe(false), 1500);
  }

  function escolherIndividual() {
    salvarPlanoSelecionado({ tipo: "individual", preco: 197 });
    router.push("/login");
  }

  function escolherEquipe() {
    if (precoEquipe.tipo !== "equipe") return;
    salvarPlanoSelecionado({
      tipo: "equipe",
      consultores,
      clientesEstimados,
      preco: precoEquipe.preco,
    });
    router.push("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Escolha o plano do Synapse
        </h1>
        <p className="text-slate-600">
          Simule o impacto de realocar carteiras para os clientes da sua empresa.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Individual */}
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Individual</h2>
          <p className="mt-1 text-sm text-slate-500">
            Você, sozinho(a), atendendo clientes ilimitados.
          </p>

          <div className="mt-6">
            <span className="text-3xl font-bold">{formatBRL(197)}</span>
            <span className="text-slate-500">/mês</span>
          </div>

          <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
            <li>1 consultor (você mesmo)</li>
            <li>Clientes ilimitados</li>
          </ul>

          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            Precisa de mais de um consultor na equipe?{" "}
            <button
              type="button"
              onClick={irParaEquipe}
              className="font-medium text-slate-900 underline underline-offset-2"
            >
              Veja o plano Equipe
            </button>
          </p>

          <button
            type="button"
            onClick={escolherIndividual}
            className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Continuar
          </button>
        </section>

        {/* Equipe */}
        <section
          ref={equipeCardRef}
          className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition ${
            destacarEquipe
              ? "border-slate-900 ring-2 ring-slate-900"
              : "border-slate-200"
          }`}
        >
          <h2 className="text-lg font-semibold">Equipe</h2>
          <p className="mt-1 text-sm text-slate-500">
            Preço escala com o número de consultores e de clientes.
          </p>

          <div className="mt-6">
            <span className="text-3xl font-bold">
              {precoEquipe.tipo === "equipe" ? formatBRL(precoEquipe.preco) : "—"}
            </span>
            <span className="text-slate-500">/mês</span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Número de consultores
              </label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Diminuir número de consultores"
                  disabled={consultores <= EQUIPE_MIN_CONSULTORES}
                  onClick={() => setConsultores((c) => Math.max(EQUIPE_MIN_CONSULTORES, c - 1))}
                  className="h-8 w-8 rounded-full border border-slate-300 text-lg leading-none disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {consultores}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar número de consultores"
                  disabled={consultores >= EQUIPE_MAX_CONSULTORES}
                  onClick={() => setConsultores((c) => Math.min(EQUIPE_MAX_CONSULTORES, c + 1))}
                  className="h-8 w-8 rounded-full border border-slate-300 text-lg leading-none disabled:opacity-30"
                >
                  +
                </button>
                <span className="text-xs text-slate-400">
                  ({EQUIPE_MIN_CONSULTORES} a {EQUIPE_MAX_CONSULTORES})
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="clientes-estimados" className="text-sm font-medium text-slate-700">
                Clientes estimados
              </label>
              <input
                id="clientes-estimados"
                type="number"
                min={0}
                value={clientesEstimados}
                onChange={(e) =>
                  setClientesEstimados(Math.max(0, Number(e.target.value) || 0))
                }
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
            <li>Pacote base cobre até 3 consultores e 150 clientes</li>
            <li>Consultor extra: {formatBRL(89)}/mês cada</li>
            <li>Bloco extra de 50 clientes: {formatBRL(60)}/mês cada</li>
          </ul>

          <button
            type="button"
            onClick={escolherEquipe}
            className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Continuar
          </button>
        </section>

        {/* Enterprise */}
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Enterprise</h2>
          <p className="mt-1 text-sm text-slate-500">
            Para empresas com 10 ou mais consultores.
          </p>

          <div className="mt-6">
            <span className="text-2xl font-bold">Sob consulta</span>
          </div>

          <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
            <li>10+ consultores</li>
            <li>Clientes ilimitados</li>
            <li>Condições comerciais personalizadas</li>
          </ul>

          <a
            href="mailto:vendas@synapse.app?subject=Interesse%20no%20plano%20Enterprise"
            className="mt-6 rounded-lg border border-slate-900 px-4 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Fale com vendas
          </a>
        </section>
      </div>
    </main>
  );
}
