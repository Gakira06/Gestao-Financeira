export const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatMoney(value) {
  return currency.format(Number(value) || 0);
}

// Vencimentos chegam como "2026-05-20T12:00:00.000Z" ou "2026-05-20".
// O dia é o que importa, então usamos só a parte da data (sem fuso).
export function dateKey(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toISODate(new Date());
}

export function addDaysKey(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function addMonthsKey(key, months) {
  const [y, m, d] = key.split('-').map(Number);
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, lastDay));
  return toISODate(target);
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

export function relativeDay(key) {
  if (!key) return '';
  const today = todayKey();
  if (key === today) return 'Hoje';
  if (key === addDaysKey(today, 1)) return 'Amanhã';
  if (key === addDaysKey(today, -1)) return 'Ontem';
  const date = parseKey(key);
  const diff = Math.round((date - parseKey(today)) / 86400000);
  if (diff > 1 && diff < 7) {
    const name = weekday.format(date);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return shortDate.format(date).replace('.', '');
}

export function isOverdue(transaction) {
  return transaction.status === 'Pendente' && dateKey(transaction.dueDate) < todayKey();
}

export function inMonth(transaction, month, year) {
  const key = dateKey(transaction.dueDate);
  return key.startsWith(`${year}-${String(month).padStart(2, '0')}`);
}

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s*\(\d+\/\d+\)\s*$/, '')
    .trim();
}

/** Resumo de um conjunto de transações (efetivadas e previstas) */
export function summarize(transactions) {
  return transactions.reduce(
    (acc, item) => {
      const amount = Number(item.amount) || 0;
      const income = item.type === 'Receita';
      const paid = item.status === 'Efetivado';
      if (income) {
        acc.income += amount;
        if (paid) acc.incomePaid += amount;
        else acc.receivable += amount;
      } else {
        acc.expense += amount;
        if (paid) acc.expensePaid += amount;
        else acc.payable += amount;
      }
      if (isOverdue(item)) acc.overdue += 1;
      return acc;
    },
    { income: 0, incomePaid: 0, receivable: 0, expense: 0, expensePaid: 0, payable: 0, overdue: 0 },
  );
}

export function byCategory(transactions, categories, type = 'Despesa') {
  const map = new Map();
  for (const item of transactions) {
    if (item.type !== type) continue;
    const id = Number(item.categoryId);
    map.set(id, (map.get(id) || 0) + Number(item.amount));
  }
  const categoryById = new Map(categories.map((category) => [Number(category.id), category]));
  return [...map.entries()]
    .map(([id, value]) => ({
      id,
      name: categoryById.get(id)?.name || 'Sem categoria',
      color: categoryById.get(id)?.colorHex || '#a8a29e',
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

/** Sugestão de categoria/conta a partir de lançamentos anteriores com a mesma descrição */
export function suggestFromHistory(description, transactions) {
  const target = normalize(description);
  if (target.length < 2) return null;
  return transactions.find((item) => normalize(item.description) === target) || null;
}

export function descriptionSuggestions(query, transactions, limit = 5) {
  const target = normalize(query);
  if (target.length < 2) return [];
  const seen = new Map();
  for (const item of transactions) {
    const key = normalize(item.description);
    if (!key.includes(target) || key === target) continue;
    const current = seen.get(key);
    if (current) current.count += 1;
    else seen.set(key, { item, count: 1 });
  }
  return [...seen.values()].sort((a, b) => b.count - a.count).slice(0, limit).map((entry) => entry.item);
}

/**
 * Entende frases como "mercado 230,50 nubank ontem" ou "+ freela 1500 dia 20".
 * Contas e categorias são reconhecidas pelo nome cadastrado.
 */
export function quickParse(input, { wallets, categories, transactions }) {
  let text = ` ${input.trim()} `;
  const result = {};

  if (/^\s*\+/.test(text)) {
    result.type = 'Receita';
    text = text.replace(/^\s*\+/, ' ');
  }

  const today = new Date();
  // mesmo tamanho do texto original (sem trim), para os índices baterem
  const lower = () => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const dayWords = [
    ['anteontem', -2],
    ['ontem', -1],
    ['hoje', 0],
    ['amanha', 1],
  ];
  for (const [word, offset] of dayWords) {
    const re = new RegExp(`\\s${word}(?=\\s)`);
    if (re.test(lower())) {
      result.dueDate = addDaysKey(todayKey(), offset);
      text = text.replace(new RegExp(`\\s(${word}|amanhã)(?=\\s)`, 'i'), ' ');
      break;
    }
  }
  if (!result.dueDate) {
    const dm = text.match(/\s(\d{1,2})\/(\d{1,2})(?=\s)/);
    const d = text.match(/\sdia\s(\d{1,2})(?=\s)/i);
    if (dm) {
      result.dueDate = toISODate(new Date(today.getFullYear(), Number(dm[2]) - 1, Number(dm[1])));
      text = text.replace(dm[0], ' ');
    } else if (d) {
      result.dueDate = toISODate(new Date(today.getFullYear(), today.getMonth(), Number(d[1])));
      text = text.replace(d[0], ' ');
    }
  }

  const byLength = (list, key) => [...list].sort((a, b) => b[key].length - a[key].length);
  for (const wallet of byLength(wallets, 'name')) {
    const name = normalize(wallet.name);
    if (name && lower().includes(` ${name} `)) {
      result.walletId = String(wallet.id);
      const idx = lower().indexOf(` ${name} `);
      text = text.slice(0, idx) + ' ' + text.slice(idx + name.length + 2);
      break;
    }
  }

  const numbers = [...text.matchAll(/\s(?:r\$\s?)?(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)(?=\s)/gi)];
  if (numbers.length) {
    const last = numbers[numbers.length - 1];
    const raw = last[1];
    const value = raw.includes(',')
      ? Number(raw.replace(/\./g, '').replace(',', '.'))
      : /\.\d{3}$/.test(raw)
        ? Number(raw.replace(/\./g, ''))
        : Number(raw);
    if (value > 0) {
      result.amount = value;
      text = text.slice(0, last.index) + ' ' + text.slice(last.index + last[0].length);
    }
  }

  const description = text.replace(/\s+/g, ' ').trim();
  if (description) {
    result.description = description.charAt(0).toUpperCase() + description.slice(1);
    const previous = suggestFromHistory(description, transactions);
    if (previous) {
      result.type ??= previous.type;
      result.categoryId = String(previous.categoryId);
      result.walletId ??= String(previous.walletId);
    } else {
      const words = normalize(description).split(' ');
      const category = categories.find((item) => words.includes(normalize(item.name)));
      if (category) {
        result.categoryId = String(category.id);
        result.type ??= category.type;
      }
    }
  }
  return result;
}

export function exportCSV(rows, { wallets, categories }, filename) {
  const walletById = new Map(wallets.map((wallet) => [Number(wallet.id), wallet.name]));
  const categoryById = new Map(categories.map((category) => [Number(category.id), category.name]));
  const header = ['Vencimento', 'Descrição', 'Conta', 'Categoria', 'Tipo', 'Status', 'Valor'];
  const lines = rows.map((item) =>
    [
      dateKey(item.dueDate),
      item.description,
      walletById.get(Number(item.walletId)) || '',
      categoryById.get(Number(item.categoryId)) || '',
      item.type,
      item.status,
      (item.type === 'Despesa' ? -item.amount : Number(item.amount)).toFixed(2).replace('.', ','),
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(';'),
  );
  const blob = new Blob([String.fromCharCode(0xfeff) + `${[header.join(';'), ...lines].join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
