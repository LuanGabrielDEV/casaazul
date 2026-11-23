import { describe, it, expect } from 'vitest';
import {
  addDays, nightsBetween, eachNight, isRangeFree, isNightBlocked, estimateTotal,
  validateSelection, todayISO, isISODate, formatBR, formatPeriodo, whatsappLink, mensagemReserva,
} from './booking.js';

const bloqueios = [
  { inicio: '2027-02-05', fim: '2027-02-11' },
  { inicio: '2027-02-12', fim: '2027-02-15' },
];
const hoje = '2027-01-10';

describe('datas', () => {
  it('soma dias atravessando mês e ano', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
  });

  it('conta noites e lista cada noite', () => {
    expect(nightsBetween('2026-12-28', '2027-01-03')).toBe(6);
    expect(eachNight('2027-02-25', '2027-02-28')).toEqual(['2027-02-25', '2027-02-26', '2027-02-27']);
  });

  it('valida datas ISO reais', () => {
    expect(isISODate('2027-02-28')).toBe(true);
    expect(isISODate('2027-02-30')).toBe(false);
    expect(isISODate('28/02/2027')).toBe(false);
  });

  it('calcula hoje no fuso de Recife', () => {
    // 02:30 UTC ainda é dia anterior em Recife (UTC-3)
    expect(todayISO(new Date('2027-03-01T02:30:00Z'))).toBe('2027-02-28');
  });
});

describe('disponibilidade', () => {
  it('o dia do check-out fica livre para nova entrada', () => {
    expect(isNightBlocked('2027-02-10', bloqueios)).toBe(true);
    expect(isNightBlocked('2027-02-11', bloqueios)).toBe(false);
    expect(isRangeFree('2027-02-11', '2027-02-12', bloqueios)).toBe(true);
  });

  it('recusa período que passa por cima de um bloqueio', () => {
    expect(isRangeFree('2027-02-01', '2027-02-20', bloqueios)).toBe(false);
    expect(isRangeFree('2027-02-03', '2027-02-05', bloqueios)).toBe(true);
  });
});

describe('preço', () => {
  it('cobra sexta e sábado como fim de semana', () => {
    // 25/02/2027 é quinta: qui 319 + sex 445 + sáb 445
    expect(estimateTotal('2027-02-25', '2027-02-28')).toBe(1209);
    // seg e ter
    expect(estimateTotal('2027-03-01', '2027-03-03')).toBe(638);
  });
});

describe('validateSelection', () => {
  it('aceita período livre com o mínimo de diárias', () => {
    expect(validateSelection({ inicio: '2027-02-25', fim: '2027-02-28', bloqueios, hoje }))
      .toEqual({ ok: true, noites: 3, total: 1209 });
  });

  it('recusa menos de 2 diárias', () => {
    const r = validateSelection({ inicio: '2027-02-25', fim: '2027-02-26', bloqueios, hoje });
    expect(r).toMatchObject({ ok: false, motivo: 'minimo_noites' });
  });

  it('recusa saída igual ou antes da entrada', () => {
    expect(validateSelection({ inicio: '2027-02-25', fim: '2027-02-25', bloqueios, hoje }).motivo).toBe('periodo_invalido');
  });

  it('recusa data passada', () => {
    expect(validateSelection({ inicio: '2027-01-05', fim: '2027-01-08', bloqueios, hoje }).motivo).toBe('data_passada');
  });

  it('recusa datas ocupadas', () => {
    expect(validateSelection({ inicio: '2027-02-09', fim: '2027-02-12', bloqueios, hoje }).motivo).toBe('datas_indisponiveis');
  });

  it('aceita sair no dia em que outro hóspede entra', () => {
    expect(validateSelection({ inicio: '2027-02-02', fim: '2027-02-05', bloqueios, hoje }).ok).toBe(true);
  });
});

describe('WhatsApp', () => {
  it('monta o link com e sem mensagem', () => {
    expect(whatsappLink('5581987638385')).toBe('https://wa.me/5581987638385');
    const link = whatsappLink('5581987638385', mensagemReserva('2027-02-25', '2027-02-28'));
    expect(link).toContain('https://wa.me/5581987638385?text=');
    expect(decodeURIComponent(link)).toContain('de 25/02 a 28/02 (3 noites)');
    expect(formatBR('2027-02-05')).toBe('05/02');
  });

  it('escreve o período por extenso', () => {
    expect(formatPeriodo('2027-02-25', '2027-02-28')).toBe('25 a 28 de fevereiro');
    expect(formatPeriodo('2026-12-28', '2027-01-03')).toBe('28 de dezembro a 3 de janeiro');
  });
});
