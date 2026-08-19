import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularPreco } from "./pricing";

test("individual: 1 consultor, clientes ilimitados -> R$197 fixo", () => {
  const resultado = calcularPreco(1, Infinity);
  assert.deepEqual(resultado, { tipo: "individual", preco: 197 });
});

test("equipe: 3 consultores, 120 clientes -> pacote base R$397", () => {
  const resultado = calcularPreco(3, 120);
  assert.deepEqual(resultado, { tipo: "equipe", preco: 397 });
});

test("equipe: 5 consultores, 210 clientes -> R$695 (base + extras)", () => {
  const resultado = calcularPreco(5, 210);
  assert.deepEqual(resultado, { tipo: "equipe", preco: 695 });
});

test("enterprise: 10+ consultores -> sem preco fixo", () => {
  const resultado = calcularPreco(10, 999);
  assert.deepEqual(resultado, { tipo: "enterprise", preco: null });
});

test("equipe: limite exato da base (3 consultores, 150 clientes) nao cobra extra", () => {
  const resultado = calcularPreco(3, 150);
  assert.deepEqual(resultado, { tipo: "equipe", preco: 397 });
});

test("equipe: fracao de bloco de clientes extras arredonda para cima", () => {
  const resultado = calcularPreco(3, 151);
  assert.deepEqual(resultado, { tipo: "equipe", preco: 397 + 60 });
});
