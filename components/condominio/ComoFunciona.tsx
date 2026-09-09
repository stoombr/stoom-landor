'use client'

// Secao 04 do original: "Como funciona em 3 cenas" (`#como-funciona`).
//
// Capitulo escuro. Cabecalho em duas colunas (h2 a esquerda, lead a direita) e
// tres cartoes-cena: foto sangrando no cartao, numero em circulo de vidro fosco
// no canto superior esquerdo, titulo e texto deitados sobre um gradiente que
// nasce transparente no meio do cartao. O cartao 2 leva o mock da notificacao
// que o morador recebe. Fecha com o CTA primario.
//
// O id `como-funciona` e contrato de duas coisas: e o alvo da ancora do link
// "Ver como funciona" do hero e e o `cta_origem` deste CTA no analytics.

import { m, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/condominio/tracking'
import { BotaoCta, CabecalhoSecao, Container, Destaque, Secao } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Id da secao. Ancora do hero + `cta_origem` do evento. Nao renomear. */
const ID_SECAO = 'como-funciona'

/** Copy aprovada, identica aos demais CTAs da pagina. */
const ROTULO_CTA = 'Quero uma proposta para o meu condomínio'

/**
 * Uma cena por passo. `notificacao` marca o unico cartao que recebe o mock do
 * aviso (o segundo, onde o morador e avisado).
 */
type Cena = {
  numero: string
  src: string
  alt: string
  titulo: string
  texto: string
  notificacao?: boolean
}

const cenas: readonly Cena[] = [
  {
    numero: '1',
    src: '/lp-condominio/assets/v5/cena1-1000.jpg',
    alt: 'Entregador depositando uma encomenda no Smart Locker Stoom',
    titulo: 'O entregador deposita',
    texto:
      'Abre o compartimento certo por QR Code e deposita o pacote. O compartimento tranca sozinho. Leva segundos e não envolve funcionário.',
  },
  {
    numero: '2',
    src: '/lp-condominio/assets/v5/cena2-1000.jpg',
    alt: 'Moradora no hall do condomínio recebendo o aviso no celular',
    titulo: 'O morador é avisado',
    texto:
      'Notificação automática por WhatsApp ou e-mail, na hora do depósito, com o código de retirada.',
    notificacao: true,
  },
  {
    numero: '3',
    src: '/lp-condominio/assets/v5/cena3-1000.jpg',
    alt: 'Tela e teclado do Smart Locker Stoom para retirada por código ou QR Code',
    titulo: 'Retira quando quiser',
    texto:
      'Com o código ou o QR Code, 24 horas por dia, 7 dias por semana. Sem app para instalar, funciona em qualquer celular.',
  },
]

/** Mock do aviso. Texto de exemplo aprovado, sai do HTML fonte palavra por palavra. */
const notificacao = {
  rotulo: 'Exemplo de notificação recebida pelo morador',
  remetente: 'Stoom Smart Locker',
  mensagem: 'Sua encomenda chegou. Compartimento M12, código de retirada 4821.',
  hora: '18:42',
}

/** Mesmo `sizes` do original: cartao inteiro ate 980px, um terco daí pra cima. */
const SIZES_CENA = '(max-width: 1024px) 100vw, 33vw'

// ─── Mock de notificacao ──────────────────────────────────────────────────────

/**
 * Cartao branco pequeno sobre a foto do cartao 2.
 *
 * Vai num <figure> porque o original usa `aria-label` num <div> generico, onde
 * o rotulo seria ignorado pelo leitor de tela. Figure aceita nome acessivel e o
 * texto de dentro continua legivel.
 */
function MockNotificacao() {
  return (
    <figure
      aria-label={notificacao.rotulo}
      className="absolute inset-x-5 top-1/2 z-10 m-0 grid -translate-y-[40%] grid-cols-[10px_1fr_auto] items-start gap-3 rounded-xl bg-white/95 px-3.5 py-3 font-roboto text-[13px] shadow-2xl shadow-brand-primary/40"
    >
      <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-highlight" />
      <div>
        <b className="block font-medium text-brand-primary">{notificacao.remetente}</b>
        <span className="mt-0.5 block leading-snug text-gray-600">{notificacao.mensagem}</span>
      </div>
      <time dateTime={notificacao.hora} className="text-[11px] text-gray-600">
        {notificacao.hora}
      </time>
    </figure>
  )
}

// ─── Cartao-cena ──────────────────────────────────────────────────────────────

/**
 * Um passo. O hover levanta o cartao e aproxima a foto, e so acontece em
 * ponteiro fino: os gestos de hover do framer-motion ignoram toque, entao o
 * celular nao fica com o estado preso depois do tap (era o que a media query
 * `(hover: hover) and (pointer: fine)` garantia no original).
 */
function CartaoCena({ cena, indice }: { cena: Cena; indice: number }) {
  const reduce = useReducedMotion()
  const [comHover, setComHover] = useState(false)

  return (
    <m.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : indice * 0.07, ease: 'easeOut' }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onHoverStart={() => setComHover(true)}
      onHoverEnd={() => setComHover(false)}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-primary lg:aspect-[4/5]"
    >
      <m.div
        animate={{ scale: comHover && !reduce ? 1.04 : 1 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image src={cena.src} alt={cena.alt} fill sizes={SIZES_CENA} className="object-cover" />
      </m.div>

      {/* Numero: vidro fosco sobre a foto, decorativo (a ordem ja esta no texto). */}
      <span
        aria-hidden="true"
        className="absolute left-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-brand-primary/70 font-outfit font-semibold text-white backdrop-blur-md"
      >
        {cena.numero}
      </span>

      {cena.notificacao ? <MockNotificacao /> : null}

      {/* Texto sobre gradiente: o mesmo escurecimento e a mesma sombra do original. */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-brand-primary/95 via-brand-primary/95 via-40% to-transparent px-6 pb-7 pt-32 [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">
        <h3 className="mb-2 font-outfit text-xl font-medium leading-tight text-white lg:text-2xl">
          {cena.titulo}
        </h3>
        <p className="font-roboto text-[15px] leading-relaxed text-white/70">{cena.texto}</p>
      </div>
    </m.article>
  )
}

// ─── Secao ────────────────────────────────────────────────────────────────────

type ComoFuncionaProps = {
  /** Abre o modal de proposta. O evento `lp_cta_click` ja e disparado aqui. */
  aoAbrir: () => void
  className?: string
}

/**
 * Tracking: dispara `eventoCta('como-funciona')` antes de chamar `aoAbrir`.
 * A pagina NAO deve disparar de novo no handler que recebe por esta prop, senao
 * o `lp_cta_click` desta origem conta dobrado.
 */
export default function ComoFunciona({ aoAbrir, className }: ComoFuncionaProps) {
  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  return (
    <Secao id={ID_SECAO} escura className={cn('scroll-mt-6', className)}>
      {/* Chao mais fundo que o brand-primary, como o `--ink` do original. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/25" />

      <Container className="relative z-10">
        <CabecalhoSecao
          sobreEscuro
          eyebrow="Como funciona"
          titulo={
            <>
              Três passos,{' '}
              <Destaque>sem app</Destaque>{' '}
              e sem depender de ninguém
            </>
          }
          lead="O armário fica instalado em área comum. O entregador não sobe, não espera e não precisa de assinatura."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {cenas.map((cena, i) => (
            <CartaoCena key={cena.titulo} cena={cena} indice={i} />
          ))}
        </div>

        {/* `.cta-row`: no celular o botao ocupa a largura toda, como no original. */}
        <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-12">
          <BotaoCta
            onClick={aoClicar}
            className="w-full md:w-auto focus-visible:ring-offset-brand-primary"
          >
            {ROTULO_CTA}
          </BotaoCta>
        </div>
      </Container>
    </Secao>
  )
}
