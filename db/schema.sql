-- Rode no SQL Editor do Neon uma única vez.
create table if not exists bloqueios (
  id serial primary key,
  inicio date not null,  -- check-in (primeira noite ocupada)
  fim date not null,     -- check-out (dia livre para nova entrada)
  created_at timestamptz not null default now(),
  check (fim > inicio)
);

create index if not exists bloqueios_fim_idx on bloqueios (fim);

-- Datas informadas no briefing (novembro/2026 a janeiro/2027 inteiros + fevereiro/2027)
insert into bloqueios (inicio, fim) values
  ('2026-11-01', '2027-02-01'),
  ('2027-02-05', '2027-02-11'),
  ('2027-02-12', '2027-02-15'),
  ('2027-02-19', '2027-02-22');
