import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Calendario } from '../components/Calendario.jsx';
import { api } from '../lib/api.js';
import { useBloqueios } from '../lib/useBloqueios.js';
import { proximaSelecao, SELECAO_VAZIA } from '../lib/selecao.js';
import { todayISO, formatBR, formatPeriodo, nightsBetween, isRangeFree } from '../../shared/booking.js';

export function Admin() {
  // 'verificando' | 'fora' | 'dentro'
  const [sessao, setSessao] = useState('verificando');

  useEffect(() => {
    document.title = 'Painel · Casa Azul';
    api.me().then(() => setSessao('dentro')).catch(() => setSessao('fora'));
  }, []);

  async function sair() {
    await api.logout().catch(() => {});
    setSessao('fora');
  }

  return (
    <div className="pagina pagina-admin">
      <header className="topo topo-admin">
        <img className="logo logo-pequeno" src="/logo.png" alt="Casa Azul" width="720" height="408" />
        {sessao === 'dentro' ? (
          <button type="button" className="botao-sair" onClick={sair}>
            <Icon name="sair" />
            Sair
          </button>
        ) : (
          <p>Painel de datas</p>
        )}
      </header>
      <main className="conteudo">
        {sessao === 'verificando' && <p className="suave" aria-live="polite">Carregando…</p>}
        {sessao === 'fora' && <Login onEntrar={() => setSessao('dentro')} />}
        {sessao === 'dentro' && <Painel onSair={() => setSessao('fora')} />}
      </main>
    </div>
  );
}

function Login({ onEntrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await api.login(email, senha);
      onEntrar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="secao formulario" onSubmit={enviar}>
      <h1 className="titulo">Entrar no painel</h1>
      <p className="suave">Use o e-mail e a senha que você recebeu na entrega.</p>
      <label className="campo">
        <span>E-mail</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="campo">
        <span>Senha</span>
        <input type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
      </label>
      {erro && <p className="alerta" role="alert">{erro}</p>}
      <button type="submit" className="botao botao-reserva" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}

function Painel({ onSair }) {
  const hoje = todayISO();
  const { status, bloqueios, recarregar } = useBloqueios();
  const [selecao, setSelecao] = useState(SELECAO_VAZIA);
  const [mensagem, setMensagem] = useState(null); // { tipo: 'ok' | 'erro', texto }
  const [salvando, setSalvando] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);

  function onDia(dia) {
    const r = proximaSelecao(selecao, dia, bloqueios);
    setSelecao(r.sel);
    setMensagem(r.aviso ? { tipo: 'erro', texto: r.aviso } : null);
  }

  // Sessão expirada: volta para a tela de login.
  function tratarErro(err) {
    if (err.status === 401) return onSair();
    setMensagem({ tipo: 'erro', texto: err.message });
  }

  async function bloquear() {
    setSalvando(true);
    try {
      await api.bloquear(selecao.inicio, selecao.fim);
      setMensagem({ tipo: 'ok', texto: `Datas de ${formatBR(selecao.inicio)} a ${formatBR(selecao.fim)} bloqueadas.` });
      setSelecao(SELECAO_VAZIA);
      await recarregar();
    } catch (err) {
      tratarErro(err);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    if (confirmarId !== id) {
      setConfirmarId(id);
      return;
    }
    setConfirmarId(null);
    try {
      await api.excluir(id);
      setMensagem({ tipo: 'ok', texto: 'Bloqueio excluído. As datas voltaram a ficar livres.' });
      await recarregar();
    } catch (err) {
      tratarErro(err);
    }
  }

  const completo = selecao.inicio && selecao.fim;
  const livre = completo && isRangeFree(selecao.inicio, selecao.fim, bloqueios);

  return (
    <>
      <section className="secao" aria-labelledby="bloquear-titulo">
        <h1 id="bloquear-titulo" className="titulo">Bloquear datas</h1>
        <p className="suave">Toque no dia de entrada e no dia de saída do hóspede.</p>
        {status === 'carregando' && <div className="calendario-carregando">Carregando o calendário…</div>}
        {status === 'erro' && <p className="alerta" role="alert">Não foi possível carregar as datas. Recarregue a página.</p>}
        {status === 'pronto' && <Calendario bloqueios={bloqueios} hoje={hoje} selecao={selecao} onDia={onDia} />}

        <div className="resumo" aria-live="polite">
          {mensagem && <p className={mensagem.tipo === 'ok' ? 'sucesso' : 'alerta'}>{mensagem.texto}</p>}
          {selecao.inicio && !selecao.fim && <p className="texto">Entrada em {formatBR(selecao.inicio)}. Agora toque no dia de saída.</p>}
          {completo && !livre && <p className="alerta">Esse período passa por cima de datas já bloqueadas.</p>}
          {completo && (
            <button type="button" className="botao botao-reserva" onClick={bloquear} disabled={!livre || salvando}>
              {salvando ? 'Salvando…' : `Bloquear ${formatBR(selecao.inicio)} a ${formatBR(selecao.fim)} (${nightsBetween(selecao.inicio, selecao.fim)} noites)`}
            </button>
          )}
        </div>
      </section>

      <section className="secao" aria-labelledby="lista-titulo">
        <h2 id="lista-titulo" className="titulo">Datas bloqueadas</h2>
        {status === 'pronto' && bloqueios.length === 0 && <p className="suave">Nenhuma data bloqueada. Todas as datas aparecem livres no site.</p>}
        <ul className="lista">
          {bloqueios.map((b) => (
            <li key={b.id} className="lista-item">
              <span>
                <strong>{formatPeriodo(b.inicio, b.fim)}</strong>
                <small>{nightsBetween(b.inicio, b.fim)} noites, saída no dia {formatBR(b.fim)}</small>
              </span>
              <button type="button" className={confirmarId === b.id ? 'botao-pequeno perigo' : 'botao-pequeno'} onClick={() => excluir(b.id)}>
                {confirmarId === b.id ? 'Confirmar' : 'Excluir'}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
