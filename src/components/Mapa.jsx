import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const CHAVE = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/** Há chave da API configurada? Sem ela, a página mostra a foto da orla no lugar do mapa. */
export const mapaDisponivel = Boolean(CHAVE);

// Estilo suave, no espírito do Airbnb: mar azul-claro, terra clara,
// ruas brancas e sem a poluição de comércios e transporte.
const ESTILO = [
  { elementType: 'geometry', stylers: [{ color: '#f5f6f4' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7a8f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e3f6' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5b8bb5' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#eef2ea' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dcebd5' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e4e8ee' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fde7c8' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#f6d3a3' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#0f2d5c' }] },
];

const CASA_SVG =
  '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';

/**
 * Mapa da localização com o marcador da casa.
 * status: 'carregando' | 'pronto' | 'erro'
 */
export function Mapa({ lat, lng, zoom = 15, titulo = 'Casa Azul' }) {
  const caixa = useRef(null);
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    if (!CHAVE || !caixa.current) return undefined;
    let cancelado = false;
    let marcador = null;

    (async () => {
      try {
        setOptions({ key: CHAVE, v: 'weekly', language: 'pt-BR', region: 'BR' });
        const [{ Map, OverlayView }, { LatLng }] = await Promise.all([importLibrary('maps'), importLibrary('core')]);
        if (cancelado) return;

        const centro = { lat, lng };
        const mapa = new Map(caixa.current, {
          center: centro,
          zoom,
          styles: ESTILO,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
          clickableIcons: false,
          backgroundColor: '#c9e3f6',
        });

        // Marcador próprio: círculo azul-escuro com a casa, como no Airbnb.
        class MarcadorCasa extends OverlayView {
          onAdd() {
            this.el = document.createElement('div');
            this.el.className = 'mapa-marcador';
            this.el.title = titulo;
            this.el.innerHTML = CASA_SVG;
            this.getPanes().overlayMouseTarget.appendChild(this.el);
          }

          draw() {
            const ponto = this.getProjection().fromLatLngToDivPixel(new LatLng(centro));
            if (ponto && this.el) {
              this.el.style.left = `${ponto.x}px`;
              this.el.style.top = `${ponto.y}px`;
            }
          }

          onRemove() {
            this.el?.remove();
          }
        }

        marcador = new MarcadorCasa();
        marcador.setMap(mapa);
        setStatus('pronto');
      } catch (erro) {
        console.error('[mapa]', erro);
        if (!cancelado) setStatus('erro');
      }
    })();

    return () => {
      cancelado = true;
      marcador?.setMap(null);
    };
  }, [lat, lng, zoom, titulo]);

  return (
    <div className="mapa">
      <div ref={caixa} className="mapa-tela" role="region" aria-label={`Mapa com a localização da ${titulo}`} />
      {status === 'carregando' && <div className="mapa-aviso" aria-live="polite">Carregando o mapa…</div>}
      {status === 'erro' && (
        <div className="mapa-aviso" role="alert">O mapa não carregou. Use o botão abaixo para abrir no Google Maps.</div>
      )}
    </div>
  );
}
