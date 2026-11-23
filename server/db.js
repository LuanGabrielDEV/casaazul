// Acesso ao banco. Em produção usa Postgres (Supabase ou Neon) pela DATABASE_URL.
// Sem DATABASE_URL (desenvolvimento e testes), usa uma lista em memória
// com os bloqueios informados no briefing.
import postgres from 'postgres';

const SEED = [
  { inicio: '2026-11-01', fim: '2027-02-01' }, // novembro/2026 a janeiro/2027 inteiros
  { inicio: '2027-02-05', fim: '2027-02-11' }, // 5 a 10/02
  { inicio: '2027-02-12', fim: '2027-02-15' }, // 12 a 14/02
  { inicio: '2027-02-19', fim: '2027-02-22' }, // 19 a 21/02
];

function memoryStore(seed = SEED) {
  let nextId = 1;
  let rows = seed.map((b) => ({ id: nextId++, ...b }));
  return {
    async listFrom(hoje) {
      return rows.filter((b) => b.fim > hoje).sort((a, b) => a.inicio.localeCompare(b.inicio)).map((b) => ({ ...b }));
    },
    async findOverlap(inicio, fim) {
      return rows.find((b) => b.inicio < fim && inicio < b.fim) ?? null;
    },
    async insert(inicio, fim) {
      const row = { id: nextId++, inicio, fim };
      rows.push(row);
      return { ...row };
    },
    async remove(id) {
      const before = rows.length;
      rows = rows.filter((b) => b.id !== id);
      return rows.length < before;
    },
  };
}

// Uma conexão por instância da função; sem prepared statements, porque o
// pooler de transação do Supabase (porta 6543) não os mantém entre pedidos.
let cliente = null;
function conectar(url) {
  cliente ??= postgres(url, { prepare: false, max: 1, idle_timeout: 20, ssl: url.includes('localhost') ? false : 'require' });
  return cliente;
}

function postgresStore(url) {
  const sql = conectar(url);
  return {
    async listFrom(hoje) {
      return sql`select id, to_char(inicio, 'YYYY-MM-DD') as inicio, to_char(fim, 'YYYY-MM-DD') as fim from bloqueios where fim > ${hoje} order by inicio`;
    },
    async findOverlap(inicio, fim) {
      const rows = await sql`select id, to_char(inicio, 'YYYY-MM-DD') as inicio, to_char(fim, 'YYYY-MM-DD') as fim from bloqueios where inicio < ${fim} and fim > ${inicio} limit 1`;
      return rows[0] ?? null;
    },
    async insert(inicio, fim) {
      const rows = await sql`insert into bloqueios (inicio, fim) values (${inicio}, ${fim}) returning id, to_char(inicio, 'YYYY-MM-DD') as inicio, to_char(fim, 'YYYY-MM-DD') as fim`;
      return rows[0];
    },
    async remove(id) {
      const rows = await sql`delete from bloqueios where id = ${id} returning id`;
      return rows.length > 0;
    },
  };
}

export function createStore({ databaseUrl = process.env.DATABASE_URL, seed } = {}) {
  return databaseUrl ? postgresStore(databaseUrl) : memoryStore(seed);
}
