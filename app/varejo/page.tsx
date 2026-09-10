// Rota /varejo: LP "Smart Locker para varejo".
//
// Spin-off de app/condominio/page.tsx: mesma estrutura de metadata, robots e
// script de desligamento do chat. So a copy e a imagem de og mudam.
//
// OG image: /varejo ainda nao tem uma foto propria de banner, entao a rota usa
// a imagem generica do site (a mesma de app/layout.tsx) ate a Stoom fornecer
// fotografia real de loja/varejo.

import type { Metadata } from 'next'
import VarejoClient from './VarejoClient'

const URL_CANONICA = 'https://stoom.com.br/varejo'
const OG_IMAGE = '/thumb-stoom.webp'
/** Absoluta para as chaves og:image:* de `other`, que o metadataBase nao resolve. */
const OG_IMAGE_ABS = 'https://stoom.com.br' + OG_IMAGE

const TITULO = 'Armário inteligente para varejo | Stoom'

// 152 caracteres, dentro do que o Google mostra sem cortar.
const DESCRICAO =
  'Armário inteligente para redes varejistas: o cliente retira o pedido online na loja, sem fila no caixa. Aluguel mensal, sem comprar equipamento. Peça uma proposta.'

// 85 caracteres: o WhatsApp corta o preview por volta de 90, entao o texto e
// escrito para caber inteiro, nunca para preencher.
const DESCRICAO_OG =
  'O cliente retira o pedido na loja, sem fila no caixa. Sem gente parada separando.'

const DESCRICAO_TWITTER = DESCRICAO_OG

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,

  alternates: {
    canonical: URL_CANONICA,
  },

  openGraph: {
    type: 'website',
    url: URL_CANONICA,
    siteName: 'Stoom',
    locale: 'pt_BR',
    title: TITULO,
    description: DESCRICAO_OG,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRICAO_TWITTER,
    images: [OG_IMAGE],
  },

  // O app/layout.tsx declara og:image:secure_url/type/width/height em `other`
  // apontando para a imagem do site. Sem sobrescrever aqui, o compartilhamento
  // da LP sai com a imagem certa e os metadados da outra.
  other: {
    'og:image:secure_url': OG_IMAGE_ABS,
    'og:image:type': 'image/webp',
    'og:image:width': '1200',
    'og:image:height': '630',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function VarejoPage() {
  return (
    <>
      {/*
        O chat do HubSpot nao carrega nesta rota.

        Nao e so estetica: o bundle do widget (conversations-visitor-ui) e o
        MAIOR recurso da pagina, 434 KB de 2.051 KB medidos. Escondê-lo por CSS
        deixaria o download acontecendo do mesmo jeito, entao o desligamento
        precisa vir antes: `loadImmediately: false` e lido pelo loader do
        HubSpot (`hs-script-loader`, `afterInteractive` no layout) quando ele
        executa. Este script inline roda na analise do HTML, bem antes disso.

        O `js.hs-scripts.com/51547160.js` continua carregando de proposito: e
        ele que grava o cookie `hubspotutk`, que o formulario manda junto no
        campo `hutk` para o HubSpot casar o lead com a sessao. So o widget de
        conversa fica de fora.

        Motivo do pedido: a LP tem um caminho de conversao so, o formulario, e
        no celular a bolinha ficava por cima do CTA fixo.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'window.hsConversationsSettings={loadImmediately:false};',
        }}
      />
      <VarejoClient />
    </>
  )
}
