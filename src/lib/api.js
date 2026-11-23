async function call(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.erro ?? 'Algo deu errado. Tente de novo.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  bloqueios: () => call('/api/bloqueios'),
  me: () => call('/api/me'),
  login: (email, senha) => call('/api/login', { method: 'POST', body: { email, senha } }),
  logout: () => call('/api/logout', { method: 'POST' }),
  bloquear: (inicio, fim) => call('/api/bloqueios', { method: 'POST', body: { inicio, fim } }),
  excluir: (id) => call(`/api/bloqueios/${id}`, { method: 'DELETE' }),
};
