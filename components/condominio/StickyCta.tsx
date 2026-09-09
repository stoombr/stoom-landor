'use client'

// Barra fixa de CTA do celular (`#stick` do original).
//
// Regra de exibicao, identica ao HTML fonte:
//   visivel = hero fora da tela  E  bloco final fora da tela  E  modal fechado
// Ou seja: nao concorre com o CTA do hero, some quando o fechamento (#proposta)
// entra em cena e desaparece enquanto o modal esta aberto.
//
// So existe abaixo de 768px (md do Tailwind). Acima disso o wrapper e `hidden`.

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/condominio/tracking'
import { BotaoCta } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Copy aprovada, identica aos demais CTAs da pagina. */
const ROTULO = 'Quero uma proposta para o meu condomínio'

/** Ids observados. Sao contrato de analytics e de layout: nao renomear. */
const ID_HERO = 'hero'
const ID_FIM = 'proposta'

/** Mesmos limiares do original: 5% no hero, 20% no fechamento. */
const LIMIAR_HERO = 0.05
const LIMIAR_FIM = 0.2

type StickyCtaProps = {
  /** Abre o modal de proposta. O evento `lp_cta_click` ja e disparado aqui. */
  aoAbrir: () => void
  /** Estado do modal. Com o modal aberto a barra recolhe. */
  modalAberto: boolean
  className?: string
}

/**
 * Barra fixa do celular.
 *
 * Tracking: dispara `eventoCta('stick')` antes de chamar `aoAbrir`. A pagina
 * NAO deve disparar de novo no handler que recebe por esta prop, senao o
 * `lp_cta_click` de origem `stick` conta dobrado.
 */
export default function StickyCta({ aoAbrir, modalAberto, className }: StickyCtaProps) {
  const reduce = useReducedMotion()
  const [heroFora, setHeroFora] = useState(false)
  const [fimVisivel, setFimVisivel] = useState(false)

  useEffect(() => {
    // Sem IntersectionObserver a barra simplesmente nunca aparece, igual ao original.
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
      // `initial={false}` para a barra nascer recolhida sem animar no primeiro paint.
      initial={false}
      animate={{ y: visivel ? '0%' : '110%' }}
      transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
      aria-hidden={!visivel}
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 md:hidden',
        'border-t border-white/10 bg-brand-ink/90 backdrop-blur-md',
        // 16px nas laterais, 10px em cima e 10px + safe area do iPhone embaixo.
        'px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]',
        !visivel && 'pointer-events-none',
        className
      )}
    >
      <BotaoCta
        onClick={aoClicar}
        // Fora de vista a barra tambem sai da ordem de tabulacao.
        tabIndex={visivel ? 0 : -1}
        className="w-full focus-visible:ring-offset-brand-primary"
      >
        {ROTULO}
      </BotaoCta>
    </m.div>
  )
}
