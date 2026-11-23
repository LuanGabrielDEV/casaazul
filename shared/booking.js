// Regras de reserva da Casa Azul.
// Funções puras, sem banco e sem tela: usadas pelo front (React) e pela API (Node).
// Datas sempre como texto ISO 'YYYY-MM-DD'. Um bloqueio ocupa as noites de
// `inicio` até a véspera de `fim` (intervalo [inicio, fim)): o dia do check-out
// fica livre para uma nova entrada.

export const PRECO_DIA_SEMANA = 319;
export const PRECO_FIM_DE_SEMANA = 445;
export const MINIMO_NOITES = 2;
// Noites cobradas como fim de semana: sexta (5) e sábado (6).
export const NOITES_FIM_DE_SEMANA = [5, 6];
export const FUSO = 'America/Recife';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(value) {
  if (typeof value !== 'string' || !ISO.test(value)) return false;
  const d = toUTC(value);
  return !Number.isNaN(d.getTime()) && fromUTC(d) === value;
}

function toUTC(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUTC(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso, n) {
  const d = toUTC(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUTC(d);
}

export function weekday(iso) {
  return toUTC(iso).getUTCDay();
}

export function nightsBetween(inicio, fim) {
  return Math.round((toUTC(fim) - toUTC(inicio)) / 86_400_000);
}

/** Lista as noites (datas de entrada de cada diária) de [inicio, fim). */
export function eachNight(inicio, fim) {
  const noites = [];
  for (let d = inicio; d < fim; d = addDays(d, 1)) noites.push(d);
  return noites;
}

export function overlaps(aInicio, aFim, bInicio, bFim) {
  return aInicio < bFim && bInicio < aFim;
}

export function isNightBlocked(iso, bloqueios) {
  return bloqueios.some((b) => b.inicio <= iso && iso < b.fim);
}

export function isRangeFree(inicio, fim, bloqueios) {
  return !bloqueios.some((b) => overlaps(inicio, fim, b.inicio, b.fim));
}

export function priceForNight(iso) {
  return NOITES_FIM_DE_SEMANA.includes(weekday(iso)) ? PRECO_FIM_DE_SEMANA : PRECO_DIA_SEMANA;
}

export function estimateTotal(inicio, fim) {
  return eachNight(inicio, fim).reduce((total, noite) => total + priceForNight(noite), 0);
}

/** "Hoje" no fuso da casa, para não liberar ou travar o dia errado perto da meia-noite. */
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/**
 * Valida o período escolhido pelo visitante.
 * @returns {{ok: true, noites: number, total: number} | {ok: false, motivo: string, mensagem: string}}
 */
export function validateSelection({ inicio, fim, bloqueios, hoje = todayISO(), minimoNoites = MINIMO_NOITES }) {
  if (!isISODate(inicio) || !isISODate(fim) || fim <= inicio) {
    return { ok: false, motivo: 'periodo_invalido', mensagem: 'Escolha a data de saída depois da data de entrada.' };
  }
  if (inicio < hoje) {
    return { ok: false, motivo: 'data_passada', mensagem: 'Essa data já passou. Escolha uma data a partir de hoje.' };
  }
  if (!isRangeFree(inicio, fim, bloqueios)) {
    return { ok: false, motivo: 'datas_indisponiveis', mensagem: 'Esse período tem datas ocupadas. Escolha outras datas.' };
  }
  const noites = nightsBetween(inicio, fim);
  if (noites < minimoNoites) {
    return { ok: false, motivo: 'minimo_noites', mensagem: `O mínimo é de ${minimoNoites} diárias.` };
  }
  return { ok: true, noites, total: estimateTotal(inicio, fim) };
}

export function formatBR(iso) {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "25 a 28 de fevereiro" ou "28 de dezembro a 3 de janeiro". */
export function formatPeriodo(inicio, fim) {
  const [, m1, d1] = inicio.split('-').map(Number);
  const [, m2, d2] = fim.split('-').map(Number);
  return m1 === m2
    ? `${d1} a ${d2} de ${MESES[m2 - 1]}`
    : `${d1} de ${MESES[m1 - 1]} a ${d2} de ${MESES[m2 - 1]}`;
}

export function formatMoney(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function whatsappLink(numero, mensagem) {
  const base = `https://wa.me/${numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export function mensagemReserva(inicio, fim) {
  const noites = nightsBetween(inicio, fim);
  return `Olá! Tenho interesse em reservar a Casa Azul de ${formatBR(inicio)} a ${formatBR(fim)} (${noites} ${noites === 1 ? 'noite' : 'noites'}). Está disponível?`;
}
