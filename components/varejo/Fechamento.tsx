'use client'

// Fechamento sobre foto da LP /varejo. Spin-off de components/condominio/Fechamento.tsx,
// aqui reduzido ao fecho centralizado (sem os tres passos do original). Foto
// reaproveitada sem alteracao: com brightness .38 o contexto de fundo (lobby)
// fica quase invisivel, entao o mesmo tratamento serve para qualquer segmento.
//
// O id `proposta` e contrato de duas coisas ao mesmo tempo: e o `cta_origem` do
// analytics e e o alvo que a barra fixa do celular observa para se recolher.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/varejo/tracking'
import { BotaoCta, Container, Destaque, Eyebrow, Lead, Secao, Titulo } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const ID_SECAO = 'proposta'

const ROTULO_CTA = 'Quero uma proposta para minha rede varejista'

const FOTO = '/lp-condominio/assets/v5/fim-1920.jpg'

const ATRASOS_FECHO = { eyebrow: 0.1, titulo: 0.15, lead: 0.25, cta: 0.35, nota: 0.45 } as const

type FechamentoProps = {
  aoAbrir: () => void
  className?: string
}

export default function Fechamento({ aoAbrir, className }: FechamentoProps) {
  const reduce = useReducedMotion()
  const fechoRef = useRef(null)
  const fechoVisivel = useInView(fechoRef, { once: true, margin: '-80px' })

  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  function entrada(atraso: number) {
    return {
      initial: reduce ? false : { opacity: 0, y: 24 },
      animate: fechoVisivel ? { opacity: 1, y: 0 } : {},
      transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : atraso },
    }
  }

  return (
    <Secao id={ID_SECAO} escura className={cn('isolate', className)}>
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={FOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%] brightness-[0.38] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/95 via-brand-ink/80 via-60% to-brand-ink/95" />
      </div>

      <Container className="relative z-10 [text-shadow:0_2px_6px_rgb(0_0_0/0.6),0_10px_32px_rgb(0_0_0/0.5)]">
        {/* ── Fecho ─────────────────────────────────────────────────────────── */}
        <div ref={fechoRef} className="mx-auto max-w-[720px] text-center lg:max-w-[900px]">
          <m.div {...entrada(ATRASOS_FECHO.eyebrow)}>
            <Eyebrow sobreEscuro>Smart Locker Stoom</Eyebrow>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.titulo)}>
            <Titulo sobreEscuro>
              Tire a fila <Destaque>do caixa</Destaque>
            </Titulo>
          </m.div>

          <m.div {...entrada(ATRASOS_FECHO.lead)}>
            <Lead sobreEscuro className="mt-5 mx-auto lg:max-w-none lg:whitespace-nowrap">
              Receba a configuração recomendada para a sua rede, com valor mensal e prazo de
              instalação.
            </Lead>
          </m.div>

          {/* Divisoria que antes separava os tres passos do fecho: alinhada
              agora direto acima do cta, unico bloco que resta nesta secao. */}
          <m.div
            {...entrada(ATRASOS_FECHO.cta)}
            className="mt-10 border-t border-white/10 pt-10"
          >
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
