# Casa Azul · Link na bio com calendário

No ar: https://casaazul-wine.vercel.app · Painel: https://casaazul-wine.vercel.app/admin

Link na bio da Casa Azul (Ponta de Pedras) com calendário de disponibilidade e painel para a cliente bloquear datas.

- **Front:** React + Vite + React Router + react-day-picker
- **Back:** Node.js + Express (função na Vercel em `api/index.js`)
- **Banco:** Postgres no Supabase (uma tabela, `bloqueios`), via `postgres` (postgres.js)

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

| Regra | Como funciona |
| --- | --- |
| Valores | Não aparecem no site: são informados pelo WhatsApp |
| Feriados | Valores diferenciados (aviso na página) |
| Mínimo | 2 diárias (`MINIMO_NOITES` em `shared/booking.js`) |
| Dia do check-out | Fica livre para nova entrada |
| Contrato | Toda reserva é feita com contrato (selo na página) |

## Banco no Supabase

1. Crie um projeto no Supabase (região South America, São Paulo).
2. No **SQL Editor**, rode o conteúdo de `db/schema.sql` (cria a tabela, liga o RLS e insere as datas do briefing).
3. Em **Connect**, copie a URI do **Transaction pooler** (porta 6543) e troque `[YOUR-PASSWORD]` pela senha do banco.
4. Na Vercel, cadastre essa URI como `DATABASE_URL` (Production e Preview) e faça um redeploy.

O RLS ligado sem políticas bloqueia a API pública do Supabase; o site acessa a tabela só pelo servidor.

## Publicar na Vercel

1. Gere o hash da senha: `npm run hash-senha -- "senha-da-cliente"`.
2. Importe o repositório na Vercel e cadastre `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `JWT_SECRET`.
3. Deploy. O `vercel.json` manda `/api/*` para o Express e o resto para o React.

## Fotos e vídeos

- Fotos em `public/fotos/` (WebP 1080×1440). A ordem e as descrições ficam em `src/content.js` (`fotos`); a primeira é a capa.
- Vídeos em `public/videos/`: `tour.mp4` (tour pela casa, 1min22) e `mar.mp4` (mar da Praia do Sítio, 14s), em H.264 para tocar em qualquer celular.
- Para trocar uma foto, salve com o mesmo nome ou atualize a lista em `content.js`.

## Estrutura da página

1. Fotos em destaque (deslizar para o lado), com botões para a galeria e o vídeo.
2. Destaques da casa com ícones e botão "Ver tudo o que a casa oferece".
3. Calendário de datas livres; o botão manda as datas escolhidas pelo WhatsApp.
4. Tour em vídeo.
5. "Antes de reservar": resumos com "Ver detalhes" (contrato, entrada e saída, valores e pagamento, regras, localização, fotos e vídeos).
6. Selo "Reserva com contrato" nos destaques e na barra fixa com o botão Reservar.
