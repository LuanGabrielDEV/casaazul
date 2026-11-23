// API da Casa Azul (Express). Roda como função na Vercel (api/index.js)
// e localmente com server/dev.js.
import express from 'express';
import cookieParser from 'cookie-parser';
import { z } from 'zod';
import { createStore } from './db.js';
import { authConfig, checkCredentials, issueSession, clearSession, requireAuth } from './auth.js';
import { isISODate, todayISO } from '../shared/booking.js';

const dataISO = z.string().refine(isISODate, 'Data inválida (use AAAA-MM-DD).');

const novoBloqueio = z
  .object({ inicio: dataISO, fim: dataISO })
  .refine((b) => b.fim > b.inicio, { message: 'A data de saída precisa ser depois da entrada.', path: ['fim'] });

const login = z.object({ email: z.string().min(1).max(200), senha: z.string().min(1).max(200) });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export function createApp({ store = createStore(), env = process.env, hoje = todayISO, falhaLoginMs = 1000 } = {}) {
  const cfg = authConfig(env);
  // Na Vercel sem DATABASE_URL, a lista em memória some a cada nova instância:
  // o calendário mostra os bloqueios iniciais, mas o painel não grava.
  const somenteLeitura = Boolean(env.VERCEL) && !env.DATABASE_URL;
  const exigirBanco = (_req, res, next) =>
    somenteLeitura
      ? res.status(503).json({ erro: 'O banco de dados ainda não foi configurado. Fale com o desenvolvedor.' })
      : next();
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  const auth = requireAuth(cfg);

  // Público: só datas, para o calendário.
  app.get('/api/bloqueios', async (_req, res, next) => {
    try {
      res.set('Cache-Control', 'no-store');
      res.json(await store.listFrom(hoje()));
    } catch (e) {
      next(e);
    }
  });

  app.post('/api/login', async (req, res, next) => {
    try {
      const parsed = login.safeParse(req.body);
      const ok = parsed.success && (await checkCredentials(cfg, parsed.data.email, parsed.data.senha));
      if (!ok) {
        await esperar(falhaLoginMs);
        return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
      }
      issueSession(res, cfg);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.post('/api/logout', (_req, res) => {
    clearSession(res, cfg);
    res.json({ ok: true });
  });

  app.get('/api/me', auth, (_req, res) => res.json({ ok: true }));

  app.post('/api/bloqueios', auth, exigirBanco, async (req, res, next) => {
    try {
      const parsed = novoBloqueio.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ erro: parsed.error.issues[0]?.message ?? 'Dados inválidos.' });
      }
      const { inicio, fim } = parsed.data;
      if (await store.findOverlap(inicio, fim)) {
        return res.status(409).json({ erro: 'Já existe um bloqueio nessas datas.' });
      }
      res.status(201).json(await store.insert(inicio, fim));
    } catch (e) {
      next(e);
    }
  });

  app.delete('/api/bloqueios/:id', auth, exigirBanco, async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: 'Bloqueio inválido.' });
      const removed = await store.remove(id);
      if (!removed) return res.status(404).json({ erro: 'Bloqueio não encontrado.' });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });

  app.use('/api', (_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

  // Erro inesperado: registra e responde sem detalhes internos.
  app.use((err, _req, res, _next) => {
    console.error('[api]', err);
    res.status(500).json({ erro: 'Algo deu errado. Tente de novo em instantes.' });
  });

  return app;
}
