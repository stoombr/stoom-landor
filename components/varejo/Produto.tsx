'use client'

// Secao 5 da LP /varejo: o equipamento. Spin-off de components/condominio/Produto.tsx,
// mesmo layout de duas colunas (foto + cartao do painel), copy adaptada de
// portaria/administração para loja/operação. Fotos reaproveitadas sem alteração:
// sao closes do proprio hardware e do painel num tablet, sem contexto de condominio.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { eventoCta } from '@/lib/varejo/tracking'
import {
  BotaoCta,
  CabecalhoSecao,
  Container,
  Destaque,
  Eyebrow,
  ListaChecada,
  Secao,
  SectionWrapper,
} from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Id da secao. Vira `cta_origem` do evento. Nao renomear. */
const ID_SECAO = 'produto'

const ROTULO_CTA = 'Quero uma proposta para minha rede varejista'

const EYEBROW = 'O equipamento'

const FOTO_HARDWARE = {
  src: '/lp-condominio/assets/v5/hardware-1600.jpg',
  alt: 'Smart Locker Stoom em close, com tela de retirada e teclado',
} as const

const ESPECIFICACOES = [
  'Compartimentos P, M e G',
  'Integração com sua plataforma de e-commerce',
  'Abertura por QR Code',
  'Registro com foto',
] as const

const PAINEL = {
  eyebrow: 'Painel de gestão',
  titulo: 'A operação enxerga o que hoje ninguém vê',
  itens: [
    'Ocupação dos compartimentos em tempo real',
    'Histórico de cada depósito e retirada, com data, hora, usuário e foto',
    'Alerta de pedido parado e reenvio automático do aviso',
    'Devolução pelo mesmo armário, sem contato e sem fila',
  ],
} as const

const FOTO_TABLET = {
  src: '/lp-condominio/assets/img/passo-tablet-900.jpg',
  alt: 'Gestor consultando o painel do Smart Locker Stoom em um tablet',
} as const

// ─── Componente ───────────────────────────────────────────────────────────────

type ProdutoProps = {
  aoAbrir: () => void
}

export default function Produto({ aoAbrir }: ProdutoProps) {
  const gradeRef = useRef(null)
  const naTela = useInView(gradeRef, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  return (
    <Secao id={ID_SECAO}>
      <Container>
        <CabecalhoSecao
          eyebrow={EYEBROW}
          titulo={
            <>
              Armário robusto na loja.{' '}
              <Destaque sobreEscuro={false}>Painel</Destaque>{' '}
              na mão da operação
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

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <SectionWrapper className="mt-12 sm:flex sm:justify-center" delay={0.1}>
          <BotaoCta onClick={aoClicar} className="w-full sm:w-auto">
            {ROTULO_CTA}
          </BotaoCta>
        </SectionWrapper>
      </Container>
    </Secao>
  )
}
