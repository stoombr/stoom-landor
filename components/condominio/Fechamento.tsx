'use client'

// Secao 8: fechamento sobre foto (`<section class="sec close" id="proposta">` do original).
//
// Duas camadas de leitura, na mesma foto:
//   1. os tres passos do que acontece depois do envio, com divisoria embaixo
//   2. o fecho centralizado (eyebrow, titulo, lead, CTA e a nota pequena)
//
// A foto aqui e bem mais escura que a do hero (brightness .38 contra .7) e leva
// um gradiente por cima alem da sombra no texto. Esse escurecimento e o que o
// cliente aprovou depois de reclamar de contraste: nao aliviar.
//
// O id `proposta` e contrato de duas coisas ao mesmo tempo: e o `cta_origem` do
// analytics e e o alvo que a barra fixa do celular observa para se recolher.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/condominio/tracking'
import { BotaoCta, Container, Destaque, Eyebrow, Lead, Secao, Titulo } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Id da secao. Contrato de analytics e alvo do observer da barra fixa. */
const ID_SECAO = 'proposta'

/** Copy aprovada, identica aos demais CTAs da pagina. */
const ROTULO_CTA = 'Quero uma proposta para o meu condomínio'

const FOTO = '/lp-condominio/assets/v5/fim-1920.jpg'

const passos = [
  {
    numero: '1',
    titulo: 'Um especialista entra em contato',
    descricao: 'Uma pessoa da Stoom, não um robô, pelo WhatsApp que você informar.',
  },
  {
    numero: '2',
    titulo: 'Conversa de 15 minutos',
    descricao:
      'Número de unidades, volume de encomenda por dia e o espaço disponível. É o que define a configuração.',
  },
  {
    numero: '3',
    titulo: 'Proposta com valores',
    descricao:
      'Configuração recomendada, valor mensal e prazo de instalação, por escrito, para levar à assembleia.',
  },
] as const

/** Escada de entrada do fecho, na ordem do JSX. */
const ATRASOS_FECHO = { eyebrow: 0.1, titulo: 0.15, lead: 0.25, cta: 0.35, nota: 0.45 } as const

type FechamentoProps = {
  /** Abre o modal de proposta. O evento `lp_cta_click` ja e disparado aqui. */
  aoAbrir: () => void
  className?: string
}

/**
 * Bloco de fechamento da LP.
 *
 * Tracking: dispara `eventoCta('proposta')` antes de chamar `aoAbrir`. A pagina
 * NAO deve disparar de novo no handler que recebe por esta prop, senao o
 * `lp_cta_click` de origem `proposta` conta dobrado.
 */
export default function Fechamento({ aoAbrir, className }: FechamentoProps) {
  const reduce = useReducedMotion()
  const fechoRef = useRef(null)
  const fechoVisivel = useInView(fechoRef, { once: true, margin: '-80px' })

  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  /** Entrada comum do fecho: mesma subida para todos, so o atraso muda. */
  function entrada(atraso: number) {
    return {
      initial: reduce ? false : { opacity: 0, y: 24 },
      animate: fechoVisivel ? { opacity: 1, y: 0 } : {},
      transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : atraso },
    }
  }

  return (
    <Secao id={ID_SECAO} escura className={cn('isolate', className)}>
      {/* Foto de fundo. Decorativa: o wrapper esconde da arvore de acessibilidade. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={FOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%] brightness-[0.38] saturate-[0.8]"
        />
        {/* Escurecimento do original: fundo quase solido nas pontas e um respiro no meio. */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/95 via-brand-ink/80 via-60% to-brand-ink/95" />
      </div>

      <Container className="relative z-10 [text-shadow:0_2px_6px_rgb(0_0_0/0.6),0_10px_32px_rgb(0_0_0/0.5)]">
        {/* ── Os tres passos ────────────────────────────────────────────────── */}
        <div className="mb-14 grid gap-x-10 gap-y-8 border-b border-white/10 pb-14 md:grid-cols-3 lg:mb-20 lg:pb-20">
          {passos.map((passo, i) => (
            <m.div
              key={passo.titulo}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.12 }}
            >
              <span
                aria-hidden="true"
                className="mb-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 font-outfit text-sm font-semibold text-white"
              >
                {passo.numero}
              </span>
              <h3 className="mb-1.5 font-outfit text-xl font-medium leading-snug text-white">
                {passo.titulo}
              </h3>
              <p className="font-roboto text-[15.5px] leading-relaxed text-white/90">
                {passo.descricao}
              </p>
            </m.div>
          ))}
        </div>

        {/* ── Fecho ─────────────────────────────────────────────────────────── */}
        <div ref={fechoRef} className="mx-auto max-w-[720px] text-center">
          <m.div {...entrada(ATRASOS_FECHO.eyebrow)}>
            <Eyebrow sobreEscuro>Smart Locker Stoom</Eyebrow>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.titulo)}>
            <Titulo sobreEscuro>
              Tire a encomenda <Destaque>da portaria</Destaque>
            </Titulo>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.lead)}>
            <Lead sobreEscuro className="mt-5 mx-auto">
              Receba a configuração recomendada para o seu condomínio, com valor mensal e prazo de
              instalação.
            </Lead>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.cta)} className="mt-10">
            <BotaoCta onClick={aoClicar} className="w-full md:w-auto">
              {ROTULO_CTA}
            </BotaoCta>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.nota)}>
            <small className="mt-[18px] block font-roboto text-[13px] text-white/80">
              Seus dados vão direto para o time comercial da Stoom. Sem spam.
            </small>
          </m.div>
        </div>
      </Container>
    </Secao>
  )
}
