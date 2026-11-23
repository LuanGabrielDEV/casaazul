import { useRef, useState } from 'react';
import { Icon } from './Icon.jsx';
import { useParallax } from '../lib/useAnimacoes.js';

/** Fotos da casa em destaque, deslizando para o lado, com o logo por cima. */
export function Destaque({ fotos, onVerFotos, onVerVideo }) {
  const trilho = useRef(null);
  const midia = useRef(null);
  const [atual, setAtual] = useState(0);
  useParallax(midia);

  function onScroll() {
    const el = trilho.current;
    if (!el) return;
    setAtual(Math.round(el.scrollLeft / el.clientWidth));
  }

  function ir(direcao) {
    const el = trilho.current;
    el?.scrollBy({ left: direcao * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <section className="destaque" aria-label="Fotos da casa">
      <div className="destaque-midia" ref={midia}>
        <div className="destaque-trilho" ref={trilho} onScroll={onScroll} tabIndex={0}>
          {fotos.map((f, i) => (
            <img key={f.src} src={f.src} alt={f.alt} className="destaque-foto"
              loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'}
              width="1080" height="1440" />
          ))}
        </div>
      </div>

      <div className="destaque-sombra" aria-hidden="true" />

      <div className="destaque-setas">
        <button type="button" className="botao-icone botao-vidro" aria-label="Foto anterior" onClick={() => ir(-1)} disabled={atual === 0}>
          <span style={{ transform: 'rotate(180deg)', display: 'flex' }}><Icon name="chev" strokeWidth={2.2} /></span>
        </button>
        <button type="button" className="botao-icone botao-vidro" aria-label="Próxima foto" onClick={() => ir(1)} disabled={atual === fotos.length - 1}>
          <Icon name="chev" strokeWidth={2.2} />
        </button>
      </div>

      <div className="destaque-rodape">
        <img className="destaque-logo" src="/logo.png" alt="Casa Azul, Ponta de Pedras" width="720" height="408" />
        <div className="destaque-botoes">
          <button type="button" className="pilula" onClick={onVerFotos}>
            <Icon name="img" size={18} />
            {atual + 1} de {fotos.length} fotos
          </button>
          <button type="button" className="pilula" onClick={onVerVideo}>
            <Icon name="play" size={16} />
            Vídeo da casa
          </button>
        </div>
      </div>
    </section>
  );
}
