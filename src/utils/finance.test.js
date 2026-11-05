import test from "node:test";
import assert from "node:assert/strict";
import { addMonthsKey, byCategory, dateKey, findTransferPair, quickParse, summarize } from "./finance.js";

const wallets = [
  { id: 1, name: "Nubank" },
  { id: 2, name: "Cartão Black" },
];
const categories = [
  { id: 1, name: "Salário", type: "Receita" },
  { id: 2, name: "Mercado", type: "Despesa" },
];
const transactions = [{ id: 9, description: "Aluguel", amount: 2500, type: "Despesa", walletId: 2, categoryId: 2 }];

test("dateKey ignora o fuso horário", () => {
  assert.equal(dateKey("2026-05-20T00:00:00.000Z"), "2026-05-20");
  assert.equal(dateKey("2026-05-20"), "2026-05-20");
});

test("addMonthsKey respeita o último dia do mês", () => {
  assert.equal(addMonthsKey("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonthsKey("2026-11-15", 2), "2027-01-15");
});

test("quickParse entende valor, conta e categoria", () => {
  const result = quickParse("mercado 230,50 nubank", { wallets, categories, transactions });
  assert.equal(result.amount, 230.5);
  assert.equal(result.walletId, "1");
  assert.equal(result.categoryId, "2");
  assert.equal(result.description, "Mercado");
});

test("quickParse reaproveita o histórico e entende receitas", () => {
  assert.equal(quickParse("aluguel 2500", { wallets, categories, transactions }).walletId, "2");
  assert.equal(quickParse("+ salário 5.000", { wallets, categories, transactions }).type, "Receita");
  assert.equal(quickParse("+ salário 5.000", { wallets, categories, transactions }).amount, 5000);
});

test("summarize separa pago e pendente", () => {
  const result = summarize([
    { type: "Receita", status: "Efetivado", amount: 100, dueDate: "2026-01-01" },
    { type: "Despesa", status: "Pendente", amount: 40, dueDate: "2000-01-01" },
  ]);
  assert.equal(result.incomePaid, 100);
  assert.equal(result.payable, 40);
  assert.equal(result.overdue, 1);
});

test("transferências não entram em receitas, despesas nem no gráfico", () => {
  const cats = [...categories, { id: 7, name: "Transferência", type: "Despesa" }, { id: 8, name: "Transferência", type: "Receita" }];
  const items = [
    { id: 1, type: "Despesa", categoryId: 2, status: "Efetivado", amount: 50, dueDate: "2026-11-01", description: "Mercado" },
    { id: 2, type: "Despesa", categoryId: 7, status: "Efetivado", amount: 300, dueDate: "2026-11-02", description: "Transferência: Nubank → Inter" },
    { id: 3, type: "Receita", categoryId: 8, status: "Efetivado", amount: 300, dueDate: "2026-11-02", description: "Transferência: Nubank → Inter" },
  ];
  const result = summarize(items, cats);
  assert.equal(result.expense, 50);
  assert.equal(result.income, 0);
  assert.deepEqual(byCategory(items, cats).map((item) => item.value), [50]);
  assert.equal(findTransferPair(items[1], items, cats).id, 3);
});
