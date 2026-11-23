import { isNightBlocked } from '../../shared/booking.js';

export const SELECAO_VAZIA = { inicio: null, fim: null };

/**
 * Próximo estado da seleção quando o usuário toca num dia.
 * 1º toque = entrada; 2º toque depois da entrada = saída; tocar antes recomeça.
 * O dia de saída pode ser um dia ocupado (é quando outro hóspede entra).
 */
export function proximaSelecao(sel, dia, bloqueios) {
  const comecando = !sel.inicio || sel.fim || dia <= sel.inicio;
  if (comecando) {
    if (isNightBlocked(dia, bloqueios)) return { sel: SELECAO_VAZIA, aviso: 'Essa data está ocupada. Escolha outro dia de entrada.' };
    return { sel: { inicio: dia, fim: null }, aviso: null };
  }
  return { sel: { inicio: sel.inicio, fim: dia }, aviso: null };
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
