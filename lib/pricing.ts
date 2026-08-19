export type PricingResult =
  | { tipo: "individual"; preco: number }
  | { tipo: "equipe"; preco: number }
  | { tipo: "enterprise"; preco: null };

export const INDIVIDUAL_MAX_CONSULTORES = 1;
export const EQUIPE_MIN_CONSULTORES = 2;
export const EQUIPE_MAX_CONSULTORES = 9;
export const ENTERPRISE_MIN_CONSULTORES = 10;

const INDIVIDUAL_PRICE = 197;

const BASE_CONSULTORES = 3;
const BASE_CLIENTES = 150;
const BASE_PRICE = 397;
const EXTRA_CONSULTANT_PRICE = 89;
const EXTRA_CLIENT_BLOCK = 50;
const EXTRA_CLIENT_BLOCK_PRICE = 60;

function precoIndividual(): PricingResult {
  return { tipo: "individual", preco: INDIVIDUAL_PRICE };
}

function precoEnterprise(): PricingResult {
  return { tipo: "enterprise", preco: null };
}

function precoEquipe(consultores: number, clientesTotais: number): PricingResult {
  const consultoresExtras = Math.max(0, consultores - BASE_CONSULTORES);
  const clientesExtras = Math.max(0, clientesTotais - BASE_CLIENTES);
  const blocosClientesExtras = Math.ceil(clientesExtras / EXTRA_CLIENT_BLOCK);

  const preco =
    BASE_PRICE +
    consultoresExtras * EXTRA_CONSULTANT_PRICE +
    blocosClientesExtras * EXTRA_CLIENT_BLOCK_PRICE;

  return { tipo: "equipe", preco };
}

/**
 * Roteia para uma função pura por caso de negócio (individual / equipe /
 * enterprise) em vez de aninhar condicionais dentro do cálculo do preço.
 */
export function calcularPreco(consultores: number, clientesTotais: number): PricingResult {
  if (consultores >= ENTERPRISE_MIN_CONSULTORES) return precoEnterprise();
  if (consultores <= INDIVIDUAL_MAX_CONSULTORES) return precoIndividual();
  return precoEquipe(consultores, clientesTotais);
}
