import { useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';

/**
 * Painel de detalhes que sobe de baixo (usa <dialog>, então Esc fecha,
 * o foco fica preso dentro e o leitor de tela anuncia o título).
 */
export function Painel({ aberto, titulo, onFechar, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();
    document.body.style.overflow = aberto ? 'hidden' : '';
  }, [aberto]);

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  return (
    <dialog
      ref={ref}
      className="painel"
      aria-labelledby="painel-titulo"
      onClose={onFechar}
      onClick={(e) => {
        if (e.target === ref.current) onFechar(); // toque fora do conteúdo
      }}
    >
      <div className="painel-conteudo">
        <header className="painel-topo">
          <h2 id="painel-titulo">{titulo}</h2>
          <button type="button" className="botao-icone" aria-label="Fechar" onClick={onFechar}>
            <Icon name="x" size={20} strokeWidth={2.2} />
          </button>
        </header>
        <div className="painel-corpo">{aberto && children}</div>
      </div>
    </dialog>
  );
}
