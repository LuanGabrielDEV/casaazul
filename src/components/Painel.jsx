import { useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';

/**
 * Painel de detalhes que sobe de baixo (usa <dialog>, então Esc fecha,
 * o foco fica preso dentro e o leitor de tela anuncia o título).
 * Com telaCheia, ocupa a tela toda em fundo escuro (usado no vídeo),
 * com um botão "Fechar" grande e fixo no canto de cima.
 */
export function Painel({ aberto, titulo, onFechar, telaCheia = false, children }) {
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
      className={telaCheia ? 'painel painel-cheio' : 'painel'}
      aria-labelledby="painel-titulo"
      onClose={onFechar}
      onClick={(e) => {
        if (e.target === ref.current) onFechar(); // toque fora do conteúdo
      }}
    >
      {telaCheia ? (
        <div className="painel-cheio-conteudo">
          <h2 id="painel-titulo" className="visualmente-oculto">{titulo}</h2>
          <button type="button" className="botao-fechar botao-fechar-flutuante" onClick={onFechar}>
            <Icon name="x" size={22} strokeWidth={2.6} />
            Fechar
          </button>
          {aberto && children}
        </div>
      ) : (
        <div className="painel-conteudo">
          <header className="painel-topo">
            <h2 id="painel-titulo">{titulo}</h2>
            <button type="button" className="botao-fechar" aria-label="Fechar" onClick={onFechar}>
              <Icon name="x" size={22} strokeWidth={2.6} />
            </button>
          </header>
          <div className="painel-corpo">{aberto && children}</div>
        </div>
      )}
    </dialog>
  );
}
