const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  init:              ()        => request('/init', { method: 'POST' }),
  getTransactions:   ()        => request('/transactions'),
  addTransaction:    (body)    => request('/transactions', { method: 'POST', body }),
  updateTransaction: (id, body) => request(`/transactions/${id}`, { method: 'PUT', body }),
  deleteTransaction: (id)      => request(`/transactions/${id}`, { method: 'DELETE' }),
  getSummary:        ()        => request('/summary'),
}