import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

/** Carrega os bloqueios. status: 'carregando' | 'pronto' | 'erro'. */
export function useBloqueios() {
  const [estado, setEstado] = useState({ status: 'carregando', bloqueios: [] });

  const recarregar = useCallback(async () => {
    try {
      const bloqueios = await api.bloqueios();
      setEstado({ status: 'pronto', bloqueios });
    } catch {
      setEstado((e) => ({ ...e, status: 'erro' }));
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { ...estado, recarregar };
}
