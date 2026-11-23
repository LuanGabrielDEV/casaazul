const PATHS = {
  whats: (
    <>
      <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21z" />
      <path d="M9 9.5c.3 2.2 2.3 4.3 4.5 4.7l1.2-1.2 2 1-.4 1.6c-3.6.6-8-3.6-7.5-7.4L10.4 7l1 2-1.2 1.2" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  insta: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </>
  ),
  img: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 17l-5-5-9 8" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chev: <path d="M9 6l6 6-6 6" />,
  sair: (
    <>
      <path d="M15 4h4v16h-4" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18V8M21 18v-5a3 3 0 0 0-3-3H10v8" />
      <path d="M3 14h18" />
      <circle cx="6.5" cy="11" r="1.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M18 14.5c1.8.8 3 2.6 3 5" />
    </>
  ),
  bath: (
    <>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M6 12V6a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" />
    </>
  ),
  praia: (
    <>
      <path d="M2 17c2.5 0 2.5-1.6 5-1.6s2.5 1.6 5 1.6 2.5-1.6 5-1.6 2.5 1.6 5 1.6" />
      <path d="M2 21c2.5 0 2.5-1.6 5-1.6s2.5 1.6 5 1.6 2.5-1.6 5-1.6 2.5 1.6 5 1.6" />
      <circle cx="12" cy="8" r="3.2" />
    </>
  ),
  pool: (
    <>
      <path d="M2 18c2.5 0 2.5-1.5 5-1.5s2.5 1.5 5 1.5 2.5-1.5 5-1.5 2.5 1.5 5 1.5" />
      <path d="M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  ar: (
    <>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M7 10h10M8 16v2M12 16v4M16 16v2" />
    </>
  ),
  churrasco: (
    <>
      <path d="M4 10h16a8 8 0 0 1-16 0z" />
      <path d="M8 18l-2 3M16 18l2 3M9 6c0-1.5 1-1.5 1-3M14 6c0-1.5 1-1.5 1-3" />
    </>
  ),
  parquinho: (
    <>
      <path d="M4 21V9l4-5 4 5v12" />
      <path d="M12 12l8 8M4 14h8" />
    </>
  ),
  paw: (
    <>
      <circle cx="6" cy="10" r="2" />
      <circle cx="10" cy="6" r="2" />
      <circle cx="14" cy="6" r="2" />
      <circle cx="18" cy="10" r="2" />
      <path d="M12 12c-3 0-5 3.5-5 6 0 1.5 1.5 2 3 1.5s2.5-.5 4 0 3 0 3-1.5c0-2.5-2-6-5-6z" />
    </>
  ),
  carro: (
    <>
      <path d="M5 16v-5l2-5h10l2 5v5" />
      <path d="M3 16h18v3H3z" />
      <circle cx="7.5" cy="13" r="1" />
      <circle cx="16.5" cy="13" r="1" />
    </>
  ),
  cozinha: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 9h16M8 6h.01M12 6h.01M9 14h6" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  cartao: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  regras: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  contrato: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17l1.5-1.5 1.5 1.5 3-3" />
    </>
  ),
};

export function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const filled = name === 'play';
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}
