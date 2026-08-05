import test from "node:test";
import assert from "node:assert/strict";
import { calculateProjectedBalance } from "./forecast.js";

test("calcula saldo acumulado com contribuição mensal e juros", () => {
  const result = calculateProjectedBalance({
    monthlyContribution: 100,
    months: 3,
    monthlyRate: 1,
  });

  assert.equal(result.totalContributed, 300);
  assert.equal(result.finalBalance, 306.04);
});

test("retorna zero quando os dados são inválidos", () => {
  const result = calculateProjectedBalance({
    monthlyContribution: -10,
    months: 0,
    monthlyRate: -5,
  });

  assert.equal(result.totalContributed, 0);
  assert.equal(result.finalBalance, 0);
});
