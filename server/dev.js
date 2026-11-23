// Servidor local da API (porta 3001). O Vite repassa /api para cá.
// Sem .env, usa bloqueios em memória e o login de teste abaixo.
import { readFileSync, existsSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { createApp } from './app.js';

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

if (!process.env.ADMIN_EMAIL) {
  process.env.ADMIN_EMAIL = 'teste@casaazul.local';
  process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('casaazul', 10);
  process.env.JWT_SECRET = 'segredo-so-para-desenvolvimento';
  console.log('Login de teste: teste@casaazul.local / casaazul');
}

const port = Number(process.env.PORT ?? 3001);
createApp().listen(port, () => {
  console.log(`API em http://localhost:${port} (${process.env.DATABASE_URL ? 'Postgres' : 'memória'})`);
});
