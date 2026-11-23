-- Rode uma única vez no SQL Editor do Supabase (ou do Neon).
create table if not exists bloqueios (
  id serial primary key,
  inicio date not null,  -- check-in (primeira noite ocupada)
  fim date not null,     -- check-out (dia livre para nova entrada)
  created_at timestamptz not null default now(),
  check (fim > inicio)
);

create index if not exists bloqueios_fim_idx on bloqueios (fim);

-- Bloqueia o acesso pela API pública do Supabase (chaves anon/authenticated).
-- O site acessa a tabela só pelo servidor, com a DATABASE_URL, que não passa por essas regras.
alter table bloqueios enable row level security;

-- Datas informadas no briefing (novembro/2026 a janeiro/2027 inteiros + fevereiro/2027)
insert into bloqueios (inicio, fim) values
  ('2026-11-01', '2027-02-01'),
  ('2027-02-05', '2027-02-11'),
  ('2027-02-12', '2027-02-15'),
  ('2027-02-19', '2027-02-22');
