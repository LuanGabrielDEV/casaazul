import { describe, it, expect } from 'vitest';
import { proximaSelecao, SELECAO_VAZIA, toISO, fromISO } from './selecao.js';

const bloqueios = [{ inicio: '2027-02-05', fim: '2027-02-11' }];

describe('proximaSelecao', () => {
  it('primeiro toque marca a entrada, segundo a saída', () => {
    const a = proximaSelecao(SELECAO_VAZIA, '2027-02-01', bloqueios).sel;
    expect(a).toEqual({ inicio: '2027-02-01', fim: null });
    expect(proximaSelecao(a, '2027-02-04', bloqueios).sel).toEqual({ inicio: '2027-02-01', fim: '2027-02-04' });
  });

  it('não deixa começar num dia ocupado', () => {
    const r = proximaSelecao(SELECAO_VAZIA, '2027-02-06', bloqueios);
    expect(r.sel).toEqual(SELECAO_VAZIA);
    expect(r.aviso).toMatch(/ocupada/);
  });

  it('deixa sair no dia em que o bloqueio começa', () => {
    const a = { inicio: '2027-02-02', fim: null };
    expect(proximaSelecao(a, '2027-02-05', bloqueios).sel.fim).toBe('2027-02-05');
  });

  it('tocar antes da entrada recomeça a seleção', () => {
    const a = { inicio: '2027-02-12', fim: null };
    expect(proximaSelecao(a, '2027-02-03', bloqueios).sel).toEqual({ inicio: '2027-02-03', fim: null });
  });

  it('converte datas sem mudar o dia', () => {
    expect(toISO(fromISO('2027-02-28'))).toBe('2027-02-28');
  });
});
