import { useEffect } from 'react';

const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Revela com suavidade os elementos com a classe "revelar" quando entram na tela.
 * Cada elemento anima uma vez só.
 */
export function useRevelar(deps = []) {
  useEffect(() => {
    const elementos = document.querySelectorAll('.revelar:not(.visivel)');
    if (semMovimento() || !('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('visivel'));
      return undefined;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Desloca o elemento mais devagar que a rolagem (efeito de profundidade nas fotos). */
export function useParallax(ref, fator = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el || semMovimento()) return undefined;
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      el.style.transform = `translate3d(0, ${y * fator}px, 0)`;
    };
    const onScroll = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(quadro);
    };
  }, [ref, fator]);
}
