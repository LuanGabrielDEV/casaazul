// Textos, fotos e links da página. Para trocar algo da casa, edite aqui.
export const casa = {
  nome: 'Casa Azul',
  local: 'Praia do Sítio, Ponta de Pedras (PE)',
  whatsapp: '5581987638385',
  whatsappExibicao: '(81) 98763-8385',
  // Mensagem que já vem escrita ao tocar nos botões do WhatsApp (o botão do calendário manda as datas escolhidas).
  mensagemPadrao: 'Olá! Vi a Casa Azul pelo link e gostaria de saber sobre disponibilidade e valores.',
  instagram: 'casaportemporada_pdp',
  maps: 'https://maps.app.goo.gl/TXELdw9cEiKrM9bC8',
  descricao: 'Desfrute de dias inesquecíveis, com conforto, tranquilidade e toda a magia de estar pertinho do mar.',

  fotos: [
    { src: '/fotos/piscina.webp', alt: 'Piscina e varanda da casa' },
    { src: '/fotos/sala.webp', alt: 'Sala de jantar com a cozinha ao fundo' },
    { src: '/fotos/quarto-1.webp', alt: 'Quarto de casal com ar-condicionado' },
    { src: '/fotos/praia.webp', alt: 'Coqueiros e o mar na Praia do Sítio' },
    { src: '/fotos/quarto-2.webp', alt: 'Quarto de casal' },
    { src: '/fotos/parquinho.webp', alt: 'Parquinho com escorregador e gangorra' },
    { src: '/fotos/quarto-3.webp', alt: 'Quarto de casal com ar-condicionado' },
    { src: '/fotos/varanda.webp', alt: 'Cantinho com banco de madeira na varanda' },
    { src: '/fotos/quarto-4.webp', alt: 'Quarto com camas de solteiro' },
    { src: '/fotos/banheiro.webp', alt: 'Banheiro com box de vidro' },
    { src: '/fotos/jardim.webp', alt: 'Jardim da casa' },
    { src: '/fotos/orla.webp', alt: 'Árvore centenária na orla de Ponta de Pedras' },
  ],

  videos: {
    tour: { src: '/videos/tour.mp4', poster: '/fotos/piscina.webp', titulo: 'Tour pela casa', duracao: '1min22' },
    mar: { src: '/videos/mar.mp4', poster: '/videos/mar-capa.jpg', titulo: 'O mar da Praia do Sítio', duracao: '14s' },
  },

  // Os 6 primeiros aparecem na página; todos aparecem em "Ver tudo o que a casa oferece".
  comodidades: [
    { icon: 'bed', titulo: '3 quartos', detalhe: '1 suíte' },
    { icon: 'users', titulo: 'Até 20 pessoas', detalhe: 'com colchões' },
    { icon: 'praia', titulo: '3 min da praia', detalhe: 'a pé' },
    { icon: 'pool', titulo: 'Piscina', detalhe: 'e área gourmet' },
    { icon: 'bath', titulo: '3 banheiros', detalhe: '' },
    { icon: 'wifi', titulo: 'Wi-Fi', detalhe: '' },
    { icon: 'ar', titulo: 'Ar-condicionado', detalhe: '' },
    { icon: 'churrasco', titulo: 'Churrasqueira', detalhe: '' },
    { icon: 'cozinha', titulo: 'Cozinha equipada', detalhe: '' },
    { icon: 'parquinho', titulo: 'Parquinho', detalhe: 'para as crianças' },
    { icon: 'paw', titulo: 'Aceita pets', detalhe: 'de pequeno porte' },
    { icon: 'carro', titulo: 'Estacionamento', detalhe: '3 a 4 carros' },
  ],
  camas: '2 camas de casal, 2 de solteiro e colchões extras de casal e de solteiro.',

  // Diferencial de confiança: toda reserva é feita com contrato.
  contrato: {
    titulo: 'Reserva com contrato',
    resumo: 'Tudo o que foi combinado fica registrado por escrito.',
    itens: [
      'Toda reserva é formalizada com um contrato.',
      'O que foi combinado pelo WhatsApp fica registrado por escrito.',
      'Mais segurança para você e para a casa.',
    ],
  },

  // Resumos com botão para os detalhes
  detalhes: [
    {
      id: 'horarios',
      icon: 'relogio',
      titulo: 'Entrada e saída',
      resumo: 'Check-in a partir das 10h e check-out até as 16h.',
      itens: ['Check-in a partir das 10h.', 'Check-out até as 16h, para aproveitar mais um dia de praia.', 'Mínimo de 2 diárias.'],
    },
    {
      id: 'pagamento',
      icon: 'cartao',
      titulo: 'Valores, pagamento e cancelamento',
      resumo: 'Valores pelo WhatsApp. Pix ou cartão, com cancelamento em até 7 dias.',
      itens: [
        'Os valores são informados pelo WhatsApp, de acordo com as datas e o número de pessoas.',
        'Feriados têm valores diferenciados.',
        'Pix ou cartão de crédito (no cartão há acréscimo).',
        'Taxa de limpeza opcional.',
        'Cancelamento em até 7 dias após o pagamento, conforme o Código de Defesa do Consumidor.',
      ],
    },
    {
      id: 'regras',
      icon: 'regras',
      titulo: 'Regras da casa',
      resumo: 'Sem som alto e respeitando o limite de pessoas.',
      itens: [
        'Proibido som alto.',
        'Respeite o limite de pessoas combinado na reserva.',
        'Descumprir as regras está sujeito a multa.',
        'Pets de pequeno porte são bem-vindos, com os devidos cuidados.',
      ],
    },
  ],
};
