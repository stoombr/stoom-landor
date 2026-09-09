// Rota /condominio: LP "Smart Locker para condominio".
//
// Server component de proposito: aqui so mora `metadata`. Tudo o que tem
// estado, animacao ou evento vive em ./CondominioClient.
//
// Title, description e os textos de og/twitter saem de
// lp-stoom-oficial/index.html, verbatim. Repare que a description do og e a do
// twitter NAO sao iguais a meta description: sao tres textos diferentes no
// fonte, e continuam diferentes aqui.
//
// Canonical: o app/layout.tsx declara `alternates.canonical` apontando para a
// home, e toda pagina interna herda isso quando nao declara o proprio. Declarar
// aqui corrige o defeito para esta rota. O `metadataBase` do layout
// (https://stoom.com.br) e quem transforma o caminho da og:image em URL
// absoluta, entao a imagem vai relativa mesmo.
//
// Robots: declarar `robots` substitui o do layout por inteiro, entao o bloco
// `googleBot` e repetido de proposito, para a rota nao perder os limites de
// preview que o site inteiro ja tem.

import type { Metadata } from 'next'
import CondominioClient from './CondominioClient'

const URL_CANONICA = 'https://stoom.com.br/condominio'
const OG_IMAGE = '/lp-condominio/assets/og.jpg'
/** Absoluta para as chaves og:image:* de `other`, que o metadataBase nao resolve. */
const OG_IMAGE_ABS = 'https://stoom.com.br' + OG_IMAGE

const TITULO = 'Armário inteligente para condomínio | Stoom'

// 152 caracteres, dentro do que o Google mostra sem cortar.
const DESCRICAO =
  'Armário inteligente para condomínio: o entregador deposita e o morador retira 24h por dia. Aluguel mensal, homologado pelos Correios. Peça uma proposta.'

// 85 caracteres: o WhatsApp corta o preview por volta de 90, entao o texto e
// escrito para caber inteiro, nunca para preencher.
const DESCRICAO_OG =
  'O entregador deposita, o morador retira 24h por dia. Sem fila, sem encomenda perdida.'

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
    'og:image:type': 'image/jpeg',
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

export default function CondominioPage() {
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
      <CondominioClient />
    </>
  )
}
