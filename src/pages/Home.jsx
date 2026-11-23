import { useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Calendario } from '../components/Calendario.jsx';
import { Destaque } from '../components/Destaque.jsx';
import { Painel } from '../components/Painel.jsx';
import { Mapa, mapaDisponivel } from '../components/Mapa.jsx';
import { casa } from '../content.js';
import { useBloqueios } from '../lib/useBloqueios.js';
import { useRevelar } from '../lib/useAnimacoes.js';
import { proximaSelecao, SELECAO_VAZIA } from '../lib/selecao.js';
import {
  todayISO, validateSelection, formatPeriodo, formatBR, whatsappLink, mensagemReserva, MINIMO_NOITES,
} from '../../shared/booking.js';

const externo = { target: '_blank', rel: 'noopener noreferrer' };
const instagram = `https://instagram.com/${casa.instagram}`;

export function Home() {
  // null | 'fotos' | 'video' | 'comodidades' | 'local' | id de um item de casa.detalhes
  const [painel, setPainel] = useState(null);
  useRevelar();
  const detalhe = casa.detalhes.find((d) => d.id === painel);

  const titulos = {
    fotos: `Fotos e vídeos`,
    video: casa.videos.tour.titulo,
    comodidades: 'O que a casa oferece',
    local: 'Localização',
    contrato: casa.contrato.titulo,
  };

  return (
    <div className="pagina pagina-com-barra">
      <Destaque fotos={casa.fotos} onVerFotos={() => setPainel('fotos')} onVerVideo={() => setPainel('video')} />

      <main className="conteudo">
        <section className="secao" aria-labelledby="casa-titulo">
          <div className="apresentacao revelar">
            <h1 id="casa-titulo" className="titulo-grande">Casa inteira, a 3 minutos do mar</h1>
            <p className="suave">
              <Icon name="pin" size={16} /> {casa.local}
            </p>
          </div>
          <ul className="comodidades" aria-label="Destaques da casa">
            {casa.comodidades.slice(0, 6).map((c, i) => (
              <li key={c.titulo} className="revelar" style={{ '--atraso': `${i * 60}ms` }}>
                <span className="comodidade-icone"><Icon name={c.icon} size={22} /></span>
                <span>
                  <strong>{c.titulo}</strong>
                  {c.detalhe && <small>{c.detalhe}</small>}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="botao botao-claro revelar" onClick={() => setPainel('comodidades')}>
            Ver tudo o que a casa oferece
          </button>
          <button type="button" className="selo-contrato revelar" onClick={() => setPainel('contrato')}>
            <span className="selo-icone"><Icon name="contrato" size={26} /></span>
            <span className="selo-texto">
              <strong>{casa.contrato.titulo}</strong>
              <small>{casa.contrato.resumo}</small>
            </span>
            <Icon name="chev" size={18} strokeWidth={2.2} />
          </button>
        </section>

        <Disponibilidade />

        <section className="secao revelar" aria-labelledby="video-titulo">
          <h2 id="video-titulo" className="titulo">{casa.videos.tour.titulo}</h2>
          <p className="suave">Da entrada à piscina, em {casa.videos.tour.duracao}.</p>
          <video className="video" controls playsInline preload="none" poster={casa.videos.tour.poster}>
            <source src={casa.videos.tour.src} type="video/mp4" />
          </video>
        </section>

        <section className="secao" aria-labelledby="antes-titulo">
          <h2 id="antes-titulo" className="titulo revelar">Antes de reservar</h2>
          <ul className="resumos">
            <Resumo icon="contrato" titulo={casa.contrato.titulo} resumo="Toda reserva é formalizada com contrato." onAbrir={() => setPainel('contrato')} />
            {casa.detalhes.map((d) => (
              <Resumo key={d.id} icon={d.icon} titulo={d.titulo} resumo={d.resumo} onAbrir={() => setPainel(d.id)} />
            ))}
            <Resumo icon="pin" titulo="Localização" resumo="Praia do Sítio, 3 minutos a pé do mar." onAbrir={() => setPainel('local')} />
            <Resumo icon="img" titulo="Fotos e vídeos" resumo={`${casa.fotos.length} fotos e 2 vídeos da casa e da praia.`} onAbrir={() => setPainel('fotos')} />
          </ul>
        </section>

      </main>

      <footer className="rodape">
        <div className="rodape-chamada revelar">
          <h2 className="rodape-titulo">Bora pra Casa Azul?</h2>
          <p>Veja as datas livres e chame no WhatsApp para fechar a sua reserva.</p>
          <a className="botao botao-reserva" href="#datas">
            <Icon name="cal" size={20} />
            Ver datas livres
          </a>
        </div>

        <ul className="rodape-contatos revelar" aria-label="Contatos">
          <li>
            <a href={whatsappLink(casa.whatsapp, casa.mensagemPadrao)} {...externo}>
              <span className="rodape-icone"><Icon name="whats" size={20} /></span>
              <span><small>WhatsApp</small>{casa.whatsappExibicao}</span>
            </a>
          </li>
          <li>
            <a href={instagram} {...externo}>
              <span className="rodape-icone"><Icon name="insta" size={20} /></span>
              <span><small>Instagram</small>@{casa.instagram}</span>
            </a>
          </li>
          <li>
            <a href={casa.maps} {...externo}>
              <span className="rodape-icone"><Icon name="pin" size={20} /></span>
              <span><small>Endereço</small>{casa.local}</span>
            </a>
          </li>
        </ul>

        <div className="rodape-base">
          <img src="/logo.png" alt="Casa Azul, Ponta de Pedras" width="720" height="408" loading="lazy" />
          <span>© {new Date().getFullYear()} Casa Azul</span>
          <a href="/admin">Área da proprietária</a>
        </div>
      </footer>

      <div className="barra-reserva">
        <div className="barra-info">
          <span>
            <strong>Reserva com contrato</strong>
            <small>Valores pelo WhatsApp</small>
          </span>
        </div>
        <a className="botao botao-reserva" href={whatsappLink(casa.whatsapp, casa.mensagemPadrao)} {...externo}>
          <Icon name="whats" size={20} />
          Reservar
        </a>
      </div>

      <Painel aberto={painel !== null} titulo={detalhe?.titulo ?? titulos[painel] ?? ''} onFechar={() => setPainel(null)}
        telaCheia={painel === 'video'}>
        {painel === 'fotos' && <Galeria />}
        {painel === 'video' && (
          <video className="video-cheio" controls autoPlay playsInline poster={casa.videos.tour.poster}>
            <source src={casa.videos.tour.src} type="video/mp4" />
          </video>
        )}
        {painel === 'comodidades' && (
          <>
            <ul className="comodidades comodidades-lista">
              {casa.comodidades.map((c) => (
                <li key={c.titulo}>
                  <span className="comodidade-icone"><Icon name={c.icon} size={22} /></span>
                  <span>
                    <strong>{c.titulo}</strong>
                    {c.detalhe && <small>{c.detalhe}</small>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="texto">Camas: {casa.camas}</p>
          </>
        )}
        {painel === 'local' && (
          <>
            <div className="local-cabecalho">
              <strong>Praia do Sítio, Ponta de Pedras</strong>
              <span>Pernambuco, Brasil</span>
            </div>
            {mapaDisponivel ? (
              <Mapa lat={casa.coordenadas.lat} lng={casa.coordenadas.lng} titulo={casa.nome} />
            ) : (
              <img className="foto-larga" src="/fotos/orla-local.webp" alt="Árvore centenária e o mar na orla de Ponta de Pedras" loading="lazy" width="1200" height="900" />
            )}
            <p className="texto">A casa fica no litoral norte de Pernambuco, a 3 minutos a pé do mar.</p>
            <a className="botao botao-azul" href={casa.maps} {...externo}>
              <Icon name="pin" size={20} />
              Ver rota no Google Maps
            </a>
          </>
        )}
        {painel === 'contrato' && (
          <ul className="lista-check">
            {casa.contrato.itens.map((item) => (
              <li key={item}><Icon name="check" size={20} strokeWidth={2.2} />{item}</li>
            ))}
          </ul>
        )}
        {detalhe && (
          <ul className="lista-check">
            {detalhe.itens.map((item) => (
              <li key={item}><Icon name="check" size={20} strokeWidth={2.2} />{item}</li>
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
}

function Resumo({ icon, titulo, resumo, onAbrir }) {
  return (
    <li className="revelar">
      <button type="button" className="resumo-item" onClick={onAbrir}>
        <span className="comodidade-icone"><Icon name={icon} size={22} /></span>
        <span className="resumo-texto">
          <strong>{titulo}</strong>
          <small>{resumo}</small>
          <span className="resumo-acao">Ver detalhes <Icon name="chev" size={16} strokeWidth={2.2} /></span>
        </span>
      </button>
    </li>
  );
}

function Galeria() {
  return (
    <div className="galeria">
      {casa.fotos.map((f) => (
        <figure key={f.src}>
          <img src={f.src} alt={f.alt} loading="lazy" width="1080" height="1440" />
          <figcaption>{f.alt}</figcaption>
        </figure>
      ))}
      <figure>
        <video controls playsInline preload="none" poster={casa.videos.mar.poster}>
          <source src={casa.videos.mar.src} type="video/mp4" />
        </video>
        <figcaption>{casa.videos.mar.titulo}</figcaption>
      </figure>
      <figure>
        <video controls playsInline preload="none" poster={casa.videos.tour.poster}>
          <source src={casa.videos.tour.src} type="video/mp4" />
        </video>
        <figcaption>{casa.videos.tour.titulo}</figcaption>
      </figure>
    </div>
  );
}

function Disponibilidade() {
  const hoje = todayISO();
  const { status, bloqueios } = useBloqueios();
  const [selecao, setSelecao] = useState(SELECAO_VAZIA);
  const [aviso, setAviso] = useState(null);

  function onDia(dia) {
    const r = proximaSelecao(selecao, dia, bloqueios);
    setSelecao(r.sel);
    setAviso(r.aviso);
  }

  const resultado = selecao.inicio && selecao.fim
    ? validateSelection({ inicio: selecao.inicio, fim: selecao.fim, bloqueios, hoje })
    : null;

  return (
    <section id="datas" className="secao revelar" aria-labelledby="datas-titulo">
      <h2 id="datas-titulo" className="titulo">Datas livres</h2>
      <p className="suave">Toque no dia de entrada e depois no de saída.</p>

      {status === 'carregando' && <div className="calendario-carregando" aria-live="polite">Carregando o calendário…</div>}
      {status === 'erro' && (
        <p className="alerta" role="alert">
          O calendário não carregou. Chame no WhatsApp e confirmamos as datas para você.
        </p>
      )}
      {status === 'pronto' && <Calendario bloqueios={bloqueios} hoje={hoje} selecao={selecao} onDia={onDia} />}

      <div className="resumo" aria-live="polite">
        {aviso && <p className="alerta">{aviso}</p>}
        {selecao.inicio && !selecao.fim && (
          <p className="texto">Entrada em {formatBR(selecao.inicio)}. Agora toque no dia de saída.</p>
        )}
        {resultado && !resultado.ok && <p className="alerta">{resultado.mensagem}</p>}

        {resultado?.ok ? (
          <div className="total">
            <div className="total-valor">
              <strong>{formatPeriodo(selecao.inicio, selecao.fim)}</strong>
              <span>{resultado.noites} noites</span>
            </div>
            <p className="suave">Essas datas estão livres. Peça o valor pelo WhatsApp: feriados têm valores diferenciados.</p>
            <a className="botao botao-reserva" href={whatsappLink(casa.whatsapp, mensagemReserva(selecao.inicio, selecao.fim))} {...externo}>
              <Icon name="whats" size={22} />
              Pedir essas datas
            </a>
          </div>
        ) : (
          <p className="precos">
            Mínimo de {MINIMO_NOITES} noites. Os valores são informados pelo WhatsApp, e feriados têm valores diferenciados.
          </p>
        )}
      </div>
    </section>
  );
}
