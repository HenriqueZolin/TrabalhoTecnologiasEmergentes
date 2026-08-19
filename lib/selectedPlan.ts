export type SelectedPlan =
  | { tipo: "individual"; preco: number }
  | { tipo: "equipe"; consultores: number; clientesEstimados: number; preco: number }
  | { tipo: "enterprise" };

export const SELECTED_PLAN_KEY = "synapse:selectedPlan";

export function salvarPlanoSelecionado(plano: SelectedPlan) {
  window.localStorage.setItem(SELECTED_PLAN_KEY, JSON.stringify(plano));
}

export function lerPlanoSelecionado(): SelectedPlan | null {
  const raw = window.localStorage.getItem(SELECTED_PLAN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SelectedPlan;
  } catch {
    return null;
  }
}
