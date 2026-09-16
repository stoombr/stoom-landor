'use client'

// Secao "impacto" da LP /varejo: as tres dores que antes viviam dentro da
// section Problema, junto do titulo e do comparativo antes/depois. Extraidas
// para uma section propria porque a original acumulava titulo + comparativo +
// tres dores numa unica dobra, com informacao demais de uma vez so.

import { m, useReducedMotion } from 'framer-motion'
import { eventoCta } from '@/lib/varejo/tracking'
import {
  BotaoCta,
  Container,
  Destaque,
  Eyebrow,
  Secao,
  SectionWrapper,
  Titulo,
} from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Id da secao. Vira `cta_origem` do evento. Nao renomear. */
const ID_SECAO = 'impacto'

const ROTULO_CTA = 'Quero uma proposta para minha rede varejista'

const dores = [
  {
    titulo: 'O caixa vira balcão de retirada',
    texto:
      'No horário de pico o funcionário para de atender venda para procurar, conferir e entregar pedido, um por um.',
  },
  {
    titulo: 'Pedido que ninguém sabe onde foi parar',
    texto:
      'Sem registro no momento da entrega, não existe como provar quem retirou. A conta sobra para a operação da loja.',
  },
  {
    titulo: 'Cliente que só passa depois do expediente',
    texto:
      'Quem trabalha o dia inteiro depende do horário da loja. A reclamação vira ticket no SAC e nota baixa na avaliação.',
  },
] as const

type ImpactoProps = {
  aoAbrir: () => void
}

export default function Impacto({ aoAbrir }: ImpactoProps) {
  const reduce = useReducedMotion()

  function aoClicar() {
    eventoCta(ID_SECAO)
    aoAbrir()
  }

  return (
    <Secao id={ID_SECAO}>
      <Container>
        <SectionWrapper className="mb-16">
          <Eyebrow sobreEscuro={false}>O impacto</Eyebrow>
          {/* Mesmo motivo do max-w customizado em Problema.tsx: a copy quebra
              em duas linhas via <br/>, e o max-w padrao (24ch) do
              CabecalhoSecao a quebraria de novo. */}
          <Titulo sobreEscuro={false} className="max-w-[34ch]">
            Se algum desses problemas é da sua loja,
            <br />
            <Destaque sobreEscuro={false}>a Stoom resolve</Destaque>.
          </Titulo>
        </SectionWrapper>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
          {dores.map((dor, i) => (
            <m.div
              key={dor.titulo}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.07 }}
            >
              <h3 className="mb-2 font-outfit text-xl lg:text-2xl font-medium text-brand-primary leading-snug">
                {dor.titulo}
              </h3>
              <p className="font-roboto text-[15.5px] text-gray-600 leading-relaxed">{dor.texto}</p>
            </m.div>
          ))}
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
