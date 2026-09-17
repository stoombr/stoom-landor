'use client'

// Hero da LP /varejo. Spin-off de components/condominio/Hero.tsx.
//
// Mesma anatomia do original: foto em quadro cheio -> video opcional -> camadas
// de escurecimento -> texto. Diferenca deliberada: o /condominio tem par de
// fotos (recorte horizontal/vertical) vindo de um ensaio fotografico dedicado;
// para varejo ainda NAO existe esse ensaio. `FOTO_FUNDO` abaixo e o unico
// material disponivel hoje (a mesma foto de loja usada em Services.tsx no
// site principal), entao entra como imagem unica nos dois breakpoints, sem
// <picture>. Ela e menor (620x620) que o ideal para hero em tela cheia e vai
// esticar com alguma perda de nitidez em telas largas.
// PENDENTE: pedir a Stoom uma foto de loja/checkout em alta resolucao,
// horizontal e vertical, para substituir este placeholder antes do go-live.
//
// `id="hero"` e contrato: e o `cta_origem` do CTA e o alvo do observer da
// barra fixa (StickyCta).

import { ArrowDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/varejo/tracking'
import HeroVideo from './HeroVideo'
import { BotaoCta, Container, Destaque, Eyebrow, focoVisivel } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const EYEBROW = 'Armário inteligente para varejo'

/** O h1 quebra em duas linhas. */
const TITULO_LINHA_1 = 'Retirada de pedidos'

const ROTULO_CTA = 'Quero uma proposta para minha rede varejista'
const ROTULO_ANCORA = 'Ver como funciona'

const selos = [
  'Integração com sua plataforma de e-commerce',
  'Redes varejistas em todo o estado de SP',
  'Aluguel mensal, sem comprar equipamento',
] as const

/** Foto placeholder do hero. Ver nota no topo do arquivo. */
const FOTO_FUNDO = '/varejo-locker.webp'

// ─── Escurecimento ────────────────────────────────────────────────────────────

/**
 * Canais rgb de `brand-ink` (#0b1626), o mesmo chao profundo usado no hero de
 * /condominio (ver o comentario la para o porque de nao ser o brand-primary).
 */
const NAVY = '11, 22, 38'

const SOMBRA_DESKTOP = `linear-gradient(180deg, rgba(${NAVY}, 0.55) 0%, rgba(${NAVY}, 0.15) 26%, rgba(${NAVY}, 0.4) 55%, rgba(${NAVY}, 0.98) 100%)`

const SOMBRA_MOBILE = `linear-gradient(180deg, rgba(${NAVY}, 0.65) 0%, rgba(${NAVY}, 0.25) 24%, rgba(${NAVY}, 0.8) 48%, rgba(${NAVY}, 0.99) 100%)`

type HeroProps = {
  /** Abre o modal de proposta. O `lp_cta_click` de origem `hero` sai daqui. */
  aoAbrir: () => void
}

export default function Hero({ aoAbrir }: HeroProps) {
  function aoClicar() {
    eventoCta('hero')
    aoAbrir()
  }

  return (
    <section
      id="hero"
      className={cn(
        'relative isolate flex items-center overflow-hidden bg-brand-ink',
        'min-h-[100svh]'
      )}
    >
      {/* ── Foto de fundo ─────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={FOTO_FUNDO}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.7] saturate-[0.9]"
        />

        {/* Zoom lento por cima da foto. Entra so no desktop, depois do load. */}
        <HeroVideo />

        {/* Escurecimento. Duas camadas no desktop, uma no celular. */}
        <div className="absolute inset-0 md:hidden" style={{ backgroundImage: SOMBRA_MOBILE }} />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ backgroundImage: SOMBRA_DESKTOP }}
        />
      </div>

      {/* ── Copy ──────────────────────────────────────────────────────────── */}
      <Container className="relative z-10 w-full py-[110px] md:py-[clamp(96px,11vh,140px)]">
        <div className="[text-shadow:0_2px_6px_rgb(0_0_0/0.55),0_12px_40px_rgb(0_0_0/0.5)]">
          <div className="lp-rise [animation-delay:100ms]">
            <Eyebrow sobreEscuro className="mb-[22px] text-white/90">
              {EYEBROW}
            </Eyebrow>
          </div>

          <h1 className="lp-rise [animation-delay:150ms] font-outfit text-[length:clamp(2.625rem,6.2vw,5.25rem)] font-bold leading-[0.98] tracking-tight text-white [text-wrap:balance]">
            <span className="block">{TITULO_LINHA_1}</span>
            <span className="block">
              com <Destaque>rapidez e praticidade</Destaque>
            </span>
          </h1>

          <ul
            aria-label="Diferenciais"
            className="lp-rise [animation-delay:250ms] mt-9 flex max-w-[920px] flex-col gap-y-2.5 pt-[22px]"
          >
            {selos.map((selo, i) => (
              <li
                key={selo}
                style={{ animationDelay: 300 + i * 70 + 'ms' }}
                className="lp-rise inline-flex items-center gap-2 font-roboto text-[15px] text-white"
              >
                <Check
                  size={16}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  className="flex-shrink-0 text-brand-highlight"
                />
                {selo}
              </li>
            ))}
          </ul>

          <div className="lp-rise [animation-delay:550ms] mt-9 flex flex-wrap items-center gap-x-[18px] gap-y-3">
            <BotaoCta
              onClick={aoClicar}
              className="w-full focus-visible:ring-offset-brand-ink md:w-auto"
            >
              {ROTULO_CTA}
            </BotaoCta>

            <a
              href="#como-funciona"
              className={cn(
                'group inline-flex min-h-[52px] items-center gap-2 rounded-full px-2.5 py-3 font-roboto font-medium text-white transition-colors motion-reduce:transition-none hover:text-brand-highlight',
                focoVisivel,
                'focus-visible:ring-offset-brand-ink'
              )}
            >
              {ROTULO_ANCORA}
              <ArrowDown
                size={18}
                aria-hidden="true"
                className="transition-transform motion-reduce:transition-none group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
