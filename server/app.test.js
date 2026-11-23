import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from './app.js';
import { createStore } from './db.js';

const env = {
  ADMIN_EMAIL: 'Debora@exemplo.com',
  ADMIN_PASSWORD_HASH: bcrypt.hashSync('senha-certa', 4),
  JWT_SECRET: 'segredo-de-teste',
};

let app;
beforeEach(() => {
  const store = createStore({ databaseUrl: '', seed: [{ inicio: '2027-02-05', fim: '2027-02-11' }] });
  app = createApp({ store, env, hoje: () => '2027-01-10', falhaLoginMs: 0 });
});

async function loggedAgent() {
  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'debora@exemplo.com', senha: 'senha-certa' }).expect(200);
  return agent;
}

describe('API pública', () => {
  it('lista bloqueios futuros só com datas', async () => {
    const res = await request(app).get('/api/bloqueios').expect(200);
    expect(res.body).toEqual([{ id: 1, inicio: '2027-02-05', fim: '2027-02-11' }]);
  });
});

describe('login', () => {
  it('recusa senha errada', async () => {
    await request(app).post('/api/login').send({ email: 'debora@exemplo.com', senha: 'x' }).expect(401);
  });

  it('grava cookie httpOnly com a senha certa', async () => {
    const res = await request(app).post('/api/login').send({ email: 'debora@exemplo.com', senha: 'senha-certa' }).expect(200);
    expect(res.headers['set-cookie'][0]).toMatch(/sessao=.*HttpOnly/);
  });
});

describe('rotas da cliente', () => {
  it('respondem 401 sem login', async () => {
    await request(app).get('/api/me').expect(401);
    await request(app).post('/api/bloqueios').send({ inicio: '2027-03-01', fim: '2027-03-03' }).expect(401);
    await request(app).delete('/api/bloqueios/1').expect(401);
  });

  it('cria, recusa sobreposição e exclui', async () => {
    const agent = await loggedAgent();
    const criado = await agent.post('/api/bloqueios').send({ inicio: '2027-03-01', fim: '2027-03-03' }).expect(201);
    expect(criado.body).toMatchObject({ inicio: '2027-03-01', fim: '2027-03-03' });

    const conflito = await agent.post('/api/bloqueios').send({ inicio: '2027-03-02', fim: '2027-03-05' }).expect(409);
    expect(conflito.body.erro).toMatch(/Já existe/);

    // check-out no dia em que outro bloqueio começa é permitido
    await agent.post('/api/bloqueios').send({ inicio: '2027-03-03', fim: '2027-03-04' }).expect(201);

    await agent.delete(`/api/bloqueios/${criado.body.id}`).expect(204);
    await agent.delete(`/api/bloqueios/${criado.body.id}`).expect(404);
  });

  it('valida datas', async () => {
    const agent = await loggedAgent();
    await agent.post('/api/bloqueios').send({ inicio: '2027-03-05', fim: '2027-03-01' }).expect(400);
    await agent.post('/api/bloqueios').send({ inicio: '05/03/2027', fim: '2027-03-08' }).expect(400);
  });

  it('logout apaga a sessão', async () => {
    const agent = await loggedAgent();
    await agent.get('/api/me').expect(200);
    await agent.post('/api/logout').expect(200);
    await agent.get('/api/me').expect(401);
  });
});

describe('produção sem banco', () => {
  it('não grava bloqueios e avisa', async () => {
    const store = createStore({ databaseUrl: '', seed: [] });
    const prod = createApp({ store, env: { ...env, VERCEL: '1' }, hoje: () => '2027-01-10', falhaLoginMs: 0 });
    const agent = request.agent(prod);
    await agent.post('/api/login').send({ email: 'debora@exemplo.com', senha: 'senha-certa' }).expect(200);
    const res = await agent.post('/api/bloqueios').send({ inicio: '2027-03-01', fim: '2027-03-03' }).expect(503);
    expect(res.body.erro).toMatch(/banco de dados/);
  });
});
