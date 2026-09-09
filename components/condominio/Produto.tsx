'use client'

// Secao 5 da LP /condominio: o equipamento (`#produto` do original, `.sec light`).
//
// Duas colunas no desktop (7fr/5fr, iguais ao `.hw` do original):
//   esquerda  foto do armario em close, com os chips de especificacao no rodape
//   direita   cartao navy com o painel de gestao e, no pe, a foto do tablet
//
// Cuidado de layout portado com correcao: no original a `.photo` combinava
// `min-height: 420px` com `aspect-ratio: 4/3` no mobile e a foto estourava a
// largura da tela. Aqui a proporcao 4/3 vale so ate `lg`, e o `min-h` volta
// junto com as duas colunas (quando a altura da linha e ditada pelo cartao).
//
// Sem CTA: o proximo pedido de proposta so aparece em #contratacao.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { CabecalhoSecao, Container, Destaque, Eyebrow, ListaChecada, Secao } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const EYEBROW = 'O equipamento'

/** Foto grande da coluna larga. */
const FOTO_HARDWARE = {
  src: '/lp-condominio/assets/v5/hardware-1600.jpg',
  alt: 'Smart Locker Stoom em close, com tela de retirada e teclado',
} as const

/** Chips sobrepostos no rodape da foto, na ordem do original. */
const ESPECIFICACOES = [
  'Compartimentos P, M e G',
  'Homologado pelos Correios',
  'Abertura por QR Code',
  'Registro com foto',
] as const

const PAINEL = {
  eyebrow: 'Painel de gestão',
  titulo: 'A administração enxerga o que hoje ninguém vê',
  itens: [
    'Ocupação dos compartimentos em tempo real',
    'Histórico de cada depósito e retirada, com data, hora, usuário e foto',
    'Alerta de encomenda parada e reenvio automático do aviso',
    'Devolução pelo mesmo armário, sem contato e sem fila',
  ],
} as const

/**
 * Foto do tablet no pe do cartao. A arte e vertical (900x1163) e o quadro e 16/9,
 * entao o `object-position` de 62% e obrigatorio para nao cortar a cabeca do modelo.
 */
const FOTO_TABLET = {
  src: '/lp-condominio/assets/img/passo-tablet-900.jpg',
  alt: 'Gestor consultando o painel do Smart Locker Stoom em um tablet',
} as const

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Produto() {
  const gradeRef = useRef(null)
  const naTela = useInView(gradeRef, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <Secao id="produto">
      <Container>
        <CabecalhoSecao
          eyebrow={EYEBROW}
          titulo={
            <>
              Armário robusto na portaria.{' '}
              <Destaque sobreEscuro={false}>Painel</Destaque>{' '}
              na mão da administração.
            </>
          }
        />

        <div
          ref={gradeRef}
          className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-stretch lg:gap-8"
        >
          {/* ── Foto do armario com os chips ──────────────────────────────── */}
          <m.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            animate={naTela ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: reduce ? 0 : 0.8, ease: 'easeOut' }}
            className="relative min-w-0 overflow-hidden rounded-2xl bg-brand-primary aspect-[4/3] lg:aspect-auto lg:min-h-[420px]"
          >
            <Image
              src={FOTO_HARDWARE.src}
              alt={FOTO_HARDWARE.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            {/* Chips: contraste vem do proprio fundo navy a 70% com blur, como no
                original. Nao entra gradiente aqui, a foto ja e escura no rodape. */}
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
              {ESPECIFICACOES.map((chip, i) => (
                <m.span
                  key={chip}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={naTela ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: reduce ? 0 : 0.4,
                    delay: reduce ? 0 : 0.35 + i * 0.07,
                    ease: 'easeOut',
                  }}
                  className="font-roboto text-sm px-3 py-1.5 rounded-full bg-brand-primary/70 text-white backdrop-blur-sm"
                >
                  {chip}
                </m.span>
              ))}
            </div>
          </m.div>

          {/* ── Cartao do painel de gestao ────────────────────────────────── */}
          <m.aside
            initial={reduce ? false : { opacity: 0, x: 50 }}
            animate={naTela ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1, ease: 'easeOut' }}
            className="flex min-w-0 flex-col gap-6 rounded-2xl bg-brand-primary p-8 text-white"
          >
            <Eyebrow sobreEscuro className="mb-0">
              {PAINEL.eyebrow}
            </Eyebrow>

            <h3 className="font-outfit text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-white">
              {PAINEL.titulo}
            </h3>

            <ListaChecada itens={PAINEL.itens} sobreEscuro />

            <div className="relative mt-auto aspect-video w-full overflow-hidden rounded-xl bg-brand-primary">
              <Image
                src={FOTO_TABLET.src}
                alt={FOTO_TABLET.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[50%_62%]"
              />
            </div>
          </m.aside>
        </div>
      </Container>
    </Secao>
  )
}
