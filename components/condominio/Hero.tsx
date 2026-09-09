'use client'

// Hero da LP /condominio (`#hero` do original).
//
// Anatomia, de baixo para cima: foto em quadro cheio (recorte horizontal no
// desktop, vertical no celular) -> video opcional -> camadas de escurecimento
// -> texto. O contraste do texto sobre a foto foi ponto de reclamacao do
// cliente, entao o escurecimento e reproduzido stop a stop:
//   1. brightness/saturate na propria imagem
//   2. gradiente vertical (claro no meio, quase solido no rodape)
//   3. gradiente lateral forte, que cobre justamente a coluna do texto
//   4. text-shadow no bloco de copy
// Mexer em qualquer um dos quatro derruba a legibilidade aprovada.
//
// `id="hero"` e contrato: e o `cta_origem` do CTA e o alvo do observer da
// barra fixa (StickyCta).

import { ArrowDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/condominio/tracking'
import HeroVideo from './HeroVideo'
import { BotaoCta, Container, Eyebrow, Lead, focoVisivel } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const EYEBROW = 'Armário inteligente para condomínio'

/** O h1 quebra em tres pedacos por causa do trecho destacado no meio. */
const TITULO_ANTES = 'A portaria não foi feita para guardar'
const TITULO_DESTAQUE = '40 encomendas'
const TITULO_DEPOIS = 'por dia'

const LEAD =
  'O entregador deposita. O morador retira quando quiser, 24 horas por dia. Sem fila e sem encomenda perdida.'

const ROTULO_CTA = 'Quero uma proposta para o meu condomínio'
const ROTULO_ANCORA = 'Ver como funciona'

const selos = [
  'Homologado pelos Correios',
  'Condomínios em SP, interior e RS',
  'Aluguel mensal, sem comprar equipamento',
] as const

// ─── Escurecimento ────────────────────────────────────────────────────────────

/**
 * Canais rgb de `brand-ink` (#0b1626), o chao profundo do original (--ink).
 * NAO e o brand-primary (#0f2842), que e o Azul Stoom dos cartoes escuros:
 * usar o primary aqui tinge a foto de azul (medido: vies +35 contra +9 do aprovado).
 * Em rgb porque os gradientes tem 4 e 5 paradas, e `from-/via-/to-` so alcanca tres.
 */
const NAVY = '11, 22, 38'

/**
 * So o vertical: clareia no meio e fecha no rodape, emendando na faixa escura
 * da secao seguinte.
 *
 * O CSS do original tem tambem um gradiente lateral de 5 paradas comecando em
 * 0.97, mas ele NUNCA aparece na pagina publicada: o `.hero-shade` esta dentro
 * de um pai com `z-index: -2` e leva `z-index: -1`, entao fica ATRAS da foto.
 * O escurecimento que o cliente aprovou vem so do `brightness(.7)` na imagem.
 * Reproduzir o lateral aqui, onde a camada funciona de verdade, derrubava a
 * luminancia da metade esquerda de 107 para 58 e apagava a recepcao da foto.
 * Medido no mesmo viewport contra a versao aprovada em lp-stoom.vercel.app/v5.
 * O contraste do texto continua garantido pelo `text-shadow` do bloco de copy.
 */
const SOMBRA_DESKTOP = `linear-gradient(180deg, rgba(${NAVY}, 0.55) 0%, rgba(${NAVY}, 0.15) 26%, rgba(${NAVY}, 0.4) 55%, rgba(${NAVY}, 0.98) 100%)`

/** No celular o texto ocupa a largura toda, entao o lateral sai e o vertical fecha mais cedo. */
const SOMBRA_MOBILE = `linear-gradient(180deg, rgba(${NAVY}, 0.65) 0%, rgba(${NAVY}, 0.25) 24%, rgba(${NAVY}, 0.8) 48%, rgba(${NAVY}, 0.99) 100%)`

// ─── Animacao ─────────────────────────────────────────────────────────────────



type HeroProps = {
  /** Abre o modal de proposta. O `lp_cta_click` de origem `hero` sai daqui. */
  aoAbrir: () => void
}

export default function Hero({ aoAbrir }: HeroProps) {
  // A entrada do hero e CSS (classe .lp-rise no globals.css), nao framer:
  // assim o texto ja existe visivel no HTML do servidor e a animacao nao
  // depende de baixar e hidratar o JS da rota. Movimento reduzido e tratado
  // pelo bloco @media (prefers-reduced-motion) global.

  function aoClicar() {
    eventoCta('hero')
    aoAbrir()
  }

  return (
    <section
      id="hero"
      className={cn(
        'relative isolate flex items-end overflow-hidden bg-brand-ink',
        // 100svh em toda tela. O teto de 940px que existia aqui fazia a faixa
        // seguinte espiar 140px na primeira dobra em telas de 1080 de altura;
        // a regra e que a segunda dobra nunca aparece na primeira.
        'min-h-[100svh]'
      )}
    >
      {/* ── Foto de fundo ─────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Direcao de arte por <picture>: o celular recebe o recorte vertical e o
            desktop o horizontal, e o navegador baixa UMA so. Com dois next/image
            alternados por classe, os dois levavam `priority` e as duas artes
            desciam em todo aparelho. Aqui o preload e o proprio <img>. */}
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/lp-condominio/assets/v5/hero-m-900.jpg"
            width={900}
            height={1094}
          />
          <img
            src="/lp-condominio/assets/v5/hero-1920.jpg"
            srcSet="/lp-condominio/assets/v5/hero-1280.jpg 1280w, /lp-condominio/assets/v5/hero-1920.jpg 1920w"
            sizes="100vw"
            alt=""
            width={1920}
            height={1097}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%] brightness-[0.7] saturate-[0.9] md:object-[62%_50%]"
          />
        </picture>

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
      <Container className="relative z-10 w-full pb-10 pt-[110px] md:pb-[clamp(48px,7vh,80px)] md:pt-[clamp(120px,14vh,160px)]">
        <div className="[text-shadow:0_2px_6px_rgb(0_0_0/0.55),0_12px_40px_rgb(0_0_0/0.5)]">
          <div className="lp-rise [animation-delay:100ms]">
            {/* Mais claro que o eyebrow das demais secoes escuras, como no original. */}
            <Eyebrow sobreEscuro className="mb-[22px] text-white/90">
              {EYEBROW}
            </Eyebrow>
          </div>

          <h1
            // A escala e o `--fs-h1` do original: 42px no celular, 92px no
            // desktop largo. E a maior tipografia da pagina.
            className="lp-rise [animation-delay:150ms] font-outfit text-[length:clamp(2.625rem,6.2vw,5.25rem)] font-bold leading-[0.98] tracking-tight text-white [text-wrap:balance]"
          >
            {TITULO_ANTES}{' '}
            <span className="relative inline-block">
              <span className="text-brand-highlight">{TITULO_DESTAQUE}</span>
              {/* Sublinhado em em, para acompanhar o clamp do titulo. */}
              <span
                aria-hidden="true"
                className="lp-underline [animation-delay:1s] absolute -bottom-[0.04em] left-0 right-0 h-[0.055em] origin-left rounded-full bg-brand-highlight"
              />
            </span>{' '}
            {TITULO_DEPOIS}
          </h1>

          <div className="lp-rise [animation-delay:250ms] mt-6">
            <Lead sobreEscuro className="max-w-[48ch] text-white/90 lg:text-xl [text-wrap:pretty]">
              {LEAD}
            </Lead>
          </div>

          <div className="lp-rise [animation-delay:350ms] mt-9 flex flex-wrap items-center gap-x-[18px] gap-y-3">
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

          <ul
            aria-label="Diferenciais"
            // Empilhados, nao em fileira: os tres somam 821px e a coluna de copy
            // tem 760, entao em fileira eles quebravam 2 + 1, com um sobrando.
            className="mt-[30px] flex max-w-[920px] flex-col gap-y-2.5 border-t border-white/25 pt-[22px]"
          >
            {selos.map((selo, i) => (
              <li
                key={selo}
                style={{ animationDelay: 450 + i * 70 + 'ms' }}
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
        </div>
      </Container>
    </section>
  )
}
