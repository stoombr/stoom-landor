'use client'

// Primitivos compartilhados da LP /condominio.
// O arquivo inteiro e client porque BotaoCta recebe onClick e SectionWrapper usa
// hooks de animacao. Os demais primitivos sao presentacionais e viajam junto.
//
// Vocabulario: py-24 lg:py-32 na secao, max-w-7xl mx-auto px-6 lg:px-8 no container,
// font-outfit em titulo, font-roboto em corpo, cores so brand-* / white / gray-* do repo.

import { forwardRef, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Foco visivel padrao da LP. O globals.css nao define foco global, entao todo
 * interativo novo carrega isto. O offset transparente imita o
 * `outline-offset: 3px` do original e funciona sobre fundo claro e escuro.
 */
export const focoVisivel =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

// ─── Casca ────────────────────────────────────────────────────────────────────

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('max-w-7xl mx-auto px-6 lg:px-8', className)}>{children}</div>
}

type SecaoProps = {
  children: React.ReactNode
  /** Id da secao. E contrato de analytics (vira `cta_origem`): hero, como-funciona, contratacao, proposta. */
  id?: string
  className?: string
  /** true = capitulo escuro (bg-brand-ink). false = capitulo claro (bg-brand-light, o "papel" do original). */
  escura?: boolean
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className' | 'id'>

/** <section> com o ritmo vertical e o fundo do capitulo. Aceita ref (observers da barra fixa). */
export const Secao = forwardRef<HTMLElement, SecaoProps>(function Secao(
  { children, id, className, escura = false, ...resto },
  ref
) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        escura ? 'bg-brand-ink text-white' : 'bg-brand-light text-brand-primary',
        className
      )}
      {...resto}
    >
      {children}
    </section>
  )
})

/** Entrada padrao de bloco: sobe 30px e aparece uma vez, respeitando reduced motion. */
export function SectionWrapper({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <m.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay }}
      className={className}
    >
      {children}
    </m.div>
  )
}

// ─── Tipografia ───────────────────────────────────────────────────────────────

/** Versal com o tracinho ciano na frente. Mesmo desenho do `.eyebrow` do original. */
export function Eyebrow({
  children,
  sobreEscuro = false,
  className,
}: {
  children: React.ReactNode
  sobreEscuro?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 mb-6 font-roboto text-xs font-medium uppercase tracking-[0.14em]',
        sobreEscuro ? 'text-white/70' : 'text-gray-500',
        className
      )}
    >
      <span aria-hidden="true" className="w-6 h-0.5 bg-brand-highlight flex-shrink-0" />
      {children}
    </p>
  )
}

export function Titulo({
  children,
  className,
  sobreEscuro = false,
}: {
  children: React.ReactNode
  className?: string
  sobreEscuro?: boolean
}) {
  return (
    <h2
      className={cn(
        'font-outfit text-[2.5rem] lg:text-[3.5rem] font-bold leading-[1.06]',
        sobreEscuro ? 'text-white' : 'text-brand-primary',
        className
      )}
    >
      {children}
    </h2>
  )
}

/**
 * Trecho destacado do titulo (o `<em>` do original).
 * O padrao segue a regra base do CSS fonte: sobre fundo escuro o texto e ciano
 * com sublinhado ciano translucido. Em secao clara passe `sobreEscuro={false}`:
 * o texto volta para navy e o sublinhado fica ciano solido.
 */
export function Destaque({
  children,
  sobreEscuro = true,
}: {
  children: React.ReactNode
  sobreEscuro?: boolean
}) {
  return (
    <span
      className={cn(
        'underline decoration-2 underline-offset-4',
        sobreEscuro
          ? 'text-brand-highlight decoration-brand-highlight/60'
          : 'text-brand-primary decoration-brand-highlight'
      )}
    >
      {children}
    </span>
  )
}

export function Lead({
  children,
  sobreEscuro = false,
  className,
}: {
  children: React.ReactNode
  sobreEscuro?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'font-roboto leading-relaxed max-w-2xl',
        sobreEscuro ? 'text-lg text-white/70' : 'text-gray-600',
        className
      )}
    >
      {children}
    </p>
  )
}

// ─── Lista com check ──────────────────────────────────────────────────────────

/** Lista de beneficios com o check da lucide. Ciano sobre escuro, navy sobre claro. */
export function ListaChecada({
  itens,
  sobreEscuro = false,
  className,
}: {
  itens: readonly string[]
  sobreEscuro?: boolean
  className?: string
}) {
  return (
    <ul className={cn('grid gap-3', className)}>
      {itens.map((item) => (
        <li
          key={item}
          className={cn(
            'grid grid-cols-[18px_1fr] gap-3 font-roboto text-[15px] leading-relaxed',
            sobreEscuro ? 'text-white/70' : 'text-gray-600'
          )}
        >
          <Check
            size={18}
            strokeWidth={2.2}
            aria-hidden="true"
            className={cn('mt-[3px]', sobreEscuro ? 'text-brand-highlight' : 'text-brand-primary')}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Botao ────────────────────────────────────────────────────────────────────

export type VarianteBotao = 'primario' | 'contorno'

type BotaoCtaProps = {
  children: React.ReactNode
  variante?: VarianteBotao
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>

const botaoBase =
  'group inline-flex min-h-[52px] items-center justify-center gap-2 px-8 py-4 font-roboto rounded-full transition-all disabled:cursor-progress'

const botaoVariantes: Record<VarianteBotao, string> = {
  primario:
    'bg-brand-secondary text-brand-primary font-semibold shadow-lg shadow-brand-secondary/25 hover:bg-brand-secondary/90 hover:scale-[1.03] active:scale-100',
  contorno:
    'font-medium text-brand-primary border border-gray-200 hover:border-brand-primary',
}

/**
 * CTA da LP. Sempre <button> (todos os CTAs abrem o modal), pilula, alvo de 52px.
 * Aceita type="submit" e disabled para o botao do formulario.
 */
export function BotaoCta({
  children,
  onClick,
  variante = 'primario',
  className,
  type = 'button',
  ...resto
}: BotaoCtaProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(botaoBase, botaoVariantes[variante], focoVisivel, className)}
      {...resto}
    >
      {children}
    </button>
  )
}

// ─── Cabecalho de secao ───────────────────────────────────────────────────────

type CabecalhoSecaoProps = {
  eyebrow: string
  titulo: React.ReactNode
  lead?: React.ReactNode
  /** Uma coluna centralizada (`.head.center` do original: #tsl e #faq). */
  centralizado?: boolean
  /** Uma coluna larga, lead embaixo (`.head.wide` do original: #problema). */
  largo?: boolean
  sobreEscuro?: boolean
  className?: string
}

/**
 * Bloco eyebrow + h2 + lead, ja com a entrada animada do SectionWrapper.
 * Sem prop de layout reproduz o `.head` do original: h2 a esquerda (7fr) e lead
 * a direita (5fr), alinhados pela base no desktop e empilhados no mobile.
 */
export function CabecalhoSecao({
  eyebrow,
  titulo,
  lead,
  centralizado = false,
  largo = false,
  sobreEscuro = false,
  className,
}: CabecalhoSecaoProps) {
  if (centralizado) {
    return (
      <SectionWrapper className={cn('mb-16 text-center', className)}>
        <Eyebrow sobreEscuro={sobreEscuro}>{eyebrow}</Eyebrow>
        <Titulo sobreEscuro={sobreEscuro} className="max-w-3xl mx-auto">
          {titulo}
        </Titulo>
        {lead ? (
          <Lead sobreEscuro={sobreEscuro} className="mt-6 mx-auto">
            {lead}
          </Lead>
        ) : null}
      </SectionWrapper>
    )
  }

  if (largo) {
    return (
      <SectionWrapper className={cn('mb-16', className)}>
        <Eyebrow sobreEscuro={sobreEscuro}>{eyebrow}</Eyebrow>
        <Titulo sobreEscuro={sobreEscuro} className="max-w-[30ch]">
          {titulo}
        </Titulo>
        {lead ? (
          <Lead sobreEscuro={sobreEscuro} className="mt-6">
            {lead}
          </Lead>
        ) : null}
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      className={cn('mb-16 grid gap-x-14 gap-y-5 lg:grid-cols-[7fr_5fr] lg:items-end', className)}
    >
      <div>
        <Eyebrow sobreEscuro={sobreEscuro}>{eyebrow}</Eyebrow>
        <Titulo sobreEscuro={sobreEscuro} className="max-w-[20ch]">
          {titulo}
        </Titulo>
      </div>
      {lead ? (
        <Lead sobreEscuro={sobreEscuro} className="lg:pb-2">
          {lead}
        </Lead>
      ) : null}
    </SectionWrapper>
  )
}
