# Casa Azul · Link na bio com calendário

Link na bio da Casa Azul (Ponta de Pedras) com calendário de disponibilidade e painel para a cliente bloquear datas.

- **Front:** React + Vite + React Router + react-day-picker
- **Back:** Node.js + Express (função na Vercel em `api/index.js`)
- **Banco:** Postgres no Neon (uma tabela, `bloqueios`)

## Rodar localmente

```bash
npm install
npm run dev:api   # terminal 1: API em http://localhost:3001
npm run dev:web   # terminal 2: site em http://localhost:5173
```

Sem `.env`, a API usa os bloqueios do briefing em memória e o login de teste `teste@casaazul.local` / `casaazul`.

Painel: `http://localhost:5173/admin`

## Testes

```bash
npm test
```

Cobrem as regras de reserva (`shared/booking.js`), a seleção de datas e a API (login, 401 sem sessão, criação, sobreposição e exclusão).

## Regras definidas

| Regra | Valor |
| --- | --- |
| Diária de domingo a quinta | R$ 319 |
| Diária de sexta e sábado | R$ 445 |
| Mínimo | 2 diárias |
| Dia do check-out | Fica livre para nova entrada |
| Feriados | Valor a combinar (aviso na página) |

Para mudar valores, edite as constantes no topo de `shared/booking.js`.

## Publicar na Vercel

1. Crie um projeto no [Neon](https://neon.tech) e rode `db/schema.sql` no SQL Editor.
2. Gere o hash da senha: `npm run hash-senha -- "senha-da-cliente"`.
3. Importe o repositório na Vercel e cadastre `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `JWT_SECRET`.
4. Deploy. O `vercel.json` manda `/api/*` para o Express e o resto para o React.

## Fotos e vídeos

- Fotos em `public/fotos/` (WebP 1080×1440). A ordem e as descrições ficam em `src/content.js` (`fotos`); a primeira é a capa.
- Vídeos em `public/videos/`: `tour.mp4` (tour pela casa, 1min22) e `mar.mp4` (mar da Praia do Sítio, 14s), em H.264 para tocar em qualquer celular.
- Para trocar uma foto, salve com o mesmo nome ou atualize a lista em `content.js`.

## Estrutura da página

1. Fotos em destaque (deslizar para o lado), com botões para a galeria e o vídeo.
2. Destaques da casa com ícones e botão "Ver tudo o que a casa oferece".
3. Calendário de datas livres com estimativa de valor.
4. Tour em vídeo.
5. "Antes de reservar": resumos com "Ver detalhes" (entrada e saída, pagamento e cancelamento, regras, localização, fotos e vídeos).
6. Barra fixa com "a partir de R$ 319 / noite" e o botão Reservar.
