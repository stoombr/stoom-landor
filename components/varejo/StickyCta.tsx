'use client'

// Barra fixa de CTA do celular da LP /varejo. Spin-off de components/condominio/StickyCta.tsx,
// mesma regra de exibicao e mesmos ids observados (contrato de analytics/layout,
// identicos em todas as LPs de Smart Locker).

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/varejo/tracking'
import { BotaoCta } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const ROTULO = 'Quero uma proposta para minha rede varejista'

const ID_HERO = 'hero'
const ID_FIM = 'proposta'

const LIMIAR_HERO = 0.05
const LIMIAR_FIM = 0.2

type StickyCtaProps = {
  aoAbrir: () => void
  modalAberto: boolean
  className?: string
}

export default function StickyCta({ aoAbrir, modalAberto, className }: StickyCtaProps) {
  const reduce = useReducedMotion()
  const [heroFora, setHeroFora] = useState(false)
  const [fimVisivel, setFimVisivel] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observadores: IntersectionObserver[] = []

    const hero = document.getElementById(ID_HERO)
    if (hero) {
      const obs = new IntersectionObserver(
        (entradas) => {
          const entrada = entradas[entradas.length - 1]
          if (entrada) setHeroFora(!entrada.isIntersecting)
        },
        { threshold: LIMIAR_HERO }
      )
      obs.observe(hero)
      observadores.push(obs)
    }

    const fim = document.getElementById(ID_FIM)
    if (fim) {
      const obs = new IntersectionObserver(
        (entradas) => {
          const entrada = entradas[entradas.length - 1]
          if (entrada) setFimVisivel(entrada.isIntersecting)
        },
        { threshold: LIMIAR_FIM }
      )
      obs.observe(fim)
      observadores.push(obs)
    }

    return () => observadores.forEach((obs) => obs.disconnect())
  }, [])

  const visivel = heroFora && !fimVisivel && !modalAberto

  function aoClicar() {
    eventoCta('stick')
    aoAbrir()
  }

  return (
    <m.div
      id="stick"
      initial={false}
      animate={{ y: visivel ? '0%' : '110%' }}
      transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
      aria-hidden={!visivel}
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 md:hidden',
        'border-t border-white/10 bg-brand-ink/90 backdrop-blur-md',
        'px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]',
        !visivel && 'pointer-events-none',
        className
      )}
    >
      <BotaoCta
        onClick={aoClicar}
        tabIndex={visivel ? 0 : -1}
        className="w-full focus-visible:ring-offset-brand-primary"
      >
        {ROTULO}
      </BotaoCta>
    </m.div>
  )
}
