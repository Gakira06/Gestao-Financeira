const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro ao comunicar com o servidor.');
  }

  if (response.status === 204) return null;
  return response.json();
}

function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => item !== '' && searchParams.append(key, item));
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const api = {
  getDashboard: () => request('/transactions/dashboard'),
  getWallets: () => request('/wallets'),
  createWallet: (data) => request('/wallets', { method: 'POST', body: JSON.stringify(data) }),
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  getTransactions: (filters) => request(`/transactions${toQueryString(filters)}`),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  payTransaction: (id) => request(`/transactions/${id}/baixa`, { method: 'PATCH' }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  getTasks: (filters) => request(`/tasks${toQueryString(filters)}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getEvents: (filters) => request(`/events${toQueryString(filters)}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

export function buildTransactionQuery(filters) {
  return {
    month: String(filters.month).padStart(2, '0'),
    year: filters.year,
    startDate: filters.startDate,
    endDate: filters.endDate,
    walletId: filters.walletId,
    categoryId: filters.categoryId,
    status: filters.status === 'Todos' ? undefined : filters.status,
    search: filters.search,
  };
}
