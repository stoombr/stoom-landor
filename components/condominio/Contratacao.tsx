'use client'

// Secao 6 da LP /condominio: contratacao (`#contratacao` do original).
//
// Capitulo claro, com o cabecalho em duas colunas (h2 a esquerda, lead a direita),
// tres cartoes brancos de lista checada, a faixa navy do prazo e o CTA no fim.
//
// O id "contratacao" e contrato de analytics: vira `cta_origem` no lp_cta_click
// e nao pode ser renomeado. Toda a copy sai de lp-stoom-oficial/index.html,
// verbatim, inclusive a virgula solta depois do trecho destacado do titulo.

import { m, useReducedMotion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventoCta } from '@/lib/condominio/tracking'
import {
  BotaoCta,
  CabecalhoSecao,
  Destaque,
  ListaChecada,
  Secao,
  SectionWrapper,
  Container,
} from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Id da secao. Contrato de analytics e alvo de ancora: nao renomear. */
const ID_SECAO = 'contratacao'

/** Copy aprovada, identica aos demais CTAs da pagina. */
const ROTULO_CTA = 'Quero uma proposta para o meu condomínio'

const EYEBROW = 'Contratação'

const LEAD =
  'O condomínio não compra equipamento e não assume manutenção. É aluguel mensal por módulo, com tudo incluso.'

/**
 * Os tres cartoes de contratacao. O terceiro nao traz numero de proposito:
 * preco "a partir de R$ X" so entra com assinatura do Luciano.
 */
const planos = [
  {
    titulo: 'O modelo',
    itens: [
      'Aluguel mensal por módulo instalado',
      'Sem investimento em equipamento',
      'Módulo central com cerca de 20 portas, e módulos adicionais conforme o volume',
      'Contrato com a administração do condomínio',
    ],
  },
  {
    titulo: 'Já vem incluso',
    itens: [
      'Instalação e configuração no local',
      'Manutenção do equipamento, por técnico da região',
      'Plataforma de gestão e notificação automática',
      'Treinamento da equipe da portaria',
      'Atualização de software, remota',
    ],
  },
  {
    titulo: 'Investimento',
    itens: [
      'Valor mensal definido pelo número de portas e pela configuração',
      'Sem taxa de instalação',
      'Proposta enviada depois de uma conversa de 15 minutos',
    ],
  },
] as const

/** Faixa navy embaixo dos cartoes. Prazo dito na cara, de proposito. */
const PRAZO = {
  titulo: 'Prazo real: 90 a 120 dias entre o contrato e a instalação',
  texto:
    'O equipamento é produzido sob demanda, na configuração do seu condomínio. Preferimos dizer isso agora a prometer um prazo que não se cumpre. Quanto antes a proposta, antes a instalação.',
} as const

type ContratacaoProps = {
  /** Abre o modal de proposta. O evento `lp_cta_click` ja e disparado aqui. */
  aoAbrir: () => void
  className?: string
}

/**
 * Secao de contratacao.
 *
 * Tracking: dispara `eventoCta('contratacao')` antes de chamar `aoAbrir`. A pagina
 * NAO deve disparar de novo no handler que recebe por esta prop, senao o
 * `lp_cta_click` de origem `contratacao` conta dobrado. Mesmo contrato do StickyCta.
 */
export default function Contratacao({ aoAbrir, className }: ContratacaoProps) {
  const reduce = useReducedMotion()

  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  return (
    <Secao id={ID_SECAO} className={className}>
      <Container>
        <CabecalhoSecao
          eyebrow={EYEBROW}
          titulo={
            <>
              Aluguel mensal, <Destaque sobreEscuro={false}>tudo incluso</Destaque>, sem letra
              miúda
            </>
          }
          lead={LEAD}
        />

        {/* ── Os tres cartoes ───────────────────────────────────────────────── */}
        <div className="grid gap-6 md:grid-cols-3">
          {planos.map((plano, i) => (
            <m.article
              key={plano.titulo}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.07 }}
              className={cn(
                'rounded-xl border border-gray-100 bg-white p-7 shadow-sm',
                'transition-shadow hover:shadow-md'
              )}
            >
              <h3 className="font-outfit text-xl font-bold text-brand-primary mb-4">
                {plano.titulo}
              </h3>
              <ListaChecada itens={plano.itens} />
            </m.article>
          ))}
        </div>

        {/* ── Prazo de entrega ──────────────────────────────────────────────── */}
        <SectionWrapper className="mt-6">
          <div className="grid grid-cols-[44px_1fr] items-start gap-5 rounded-2xl bg-brand-primary p-7 text-white lg:p-8">
            <Calendar
              size={44}
              strokeWidth={1.6}
              aria-hidden="true"
              className="text-brand-highlight"
            />
            <div>
              <h3 className="font-outfit text-xl font-bold text-white mb-1.5 leading-tight">
                {PRAZO.titulo}
              </h3>
              <p className="font-roboto text-[15px] leading-relaxed text-white/70">
                {PRAZO.texto}
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <SectionWrapper className="mt-12" delay={0.1}>
          {/* No celular o CTA ocupa a largura toda, igual ao original (<=760px). */}
          <BotaoCta onClick={aoClicar} className="w-full sm:w-auto">
            {ROTULO_CTA}
          </BotaoCta>
        </SectionWrapper>
      </Container>
    </Secao>
  )
}
