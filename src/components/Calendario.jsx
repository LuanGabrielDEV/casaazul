import { DayPicker } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { isNightBlocked } from '../../shared/booking.js';
import { toISO, fromISO } from '../lib/selecao.js';

const mesAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function legendaMes(date) {
  const texto = mesAno.format(date).replace(' de ', ' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Calendário de disponibilidade: noites ocupadas hachuradas e o período
 * escolhido como uma faixa contínua. A regra de seleção fica no pai (onDia).
 */
export function Calendario({ bloqueios, hoje, selecao, onDia }) {
  const hojeDate = fromISO(hoje);
  const inicioMes = new Date(hojeDate.getFullYear(), hojeDate.getMonth(), 1);
  const ultimoMes = new Date(hojeDate.getFullYear(), hojeDate.getMonth() + 12, 1);
  const { inicio, fim } = selecao;

  const modifiers = {
    ocupado: (d) => isNightBlocked(toISO(d), bloqueios),
    entrada: (d) => inicio !== null && toISO(d) === inicio,
    comSaida: () => fim !== null,
    saida: (d) => fim !== null && toISO(d) === fim,
    noPeriodo: (d) => {
      if (!inicio || !fim) return false;
      const iso = toISO(d);
      return iso > inicio && iso < fim;
    },
  };

  return (
    <DayPicker
      locale={ptBR}
      startMonth={inicioMes}
      endMonth={ultimoMes}
      defaultMonth={inicio ? fromISO(inicio) : inicioMes}
      disabled={{ before: hojeDate }}
      showOutsideDays={false}
      formatters={{ formatCaption: legendaMes }}
      modifiers={modifiers}
      modifiersClassNames={{
        ocupado: 'dia-ocupado',
        entrada: 'dia-entrada',
        comSaida: 'dia-com-saida',
        saida: 'dia-saida',
        noPeriodo: 'dia-periodo',
      }}
      onDayClick={(day, mods) => {
        if (!mods.disabled) onDia(toISO(day));
      }}
      footer={
        <div className="legenda" aria-hidden="true">
          <span><i className="legenda-escolha" />Sua escolha</span>
          <span><i className="legenda-ocupado" />Ocupado</span>
        </div>
      }
    />
  );
}
