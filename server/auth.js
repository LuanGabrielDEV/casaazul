// Login da cliente: e-mail e hash da senha ficam em variáveis de ambiente.
// A sessão é um JWT guardado em cookie httpOnly por 7 dias.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const COOKIE = 'sessao';
const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

export function authConfig(env = process.env) {
  return {
    email: (env.ADMIN_EMAIL ?? '').trim().toLowerCase(),
    passwordHash: env.ADMIN_PASSWORD_HASH ?? '',
    secret: env.JWT_SECRET ?? '',
    secure: env.NODE_ENV === 'production',
  };
}

export async function checkCredentials(cfg, email, senha) {
  if (!cfg.email || !cfg.passwordHash || !cfg.secret) return false;
  if (String(email).trim().toLowerCase() !== cfg.email) {
    await bcrypt.compare(String(senha), cfg.passwordHash); // mesmo tempo de resposta
    return false;
  }
  return bcrypt.compare(String(senha), cfg.passwordHash);
}

export function issueSession(res, cfg) {
  const token = jwt.sign({ sub: cfg.email }, cfg.secret, { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: cfg.secure,
    sameSite: 'strict',
    maxAge: SETE_DIAS_MS,
    path: '/',
  });
}

export function clearSession(res, cfg) {
  res.clearCookie(COOKIE, { httpOnly: true, secure: cfg.secure, sameSite: 'strict', path: '/' });
}

export function requireAuth(cfg) {
  return (req, res, next) => {
    const token = req.cookies?.[COOKIE];
    try {
      const payload = jwt.verify(token ?? '', cfg.secret);
      if (payload.sub !== cfg.email) throw new Error('usuário inválido');
      next();
    } catch {
      res.status(401).json({ erro: 'Faça login para continuar.' });
    }
  };
}
