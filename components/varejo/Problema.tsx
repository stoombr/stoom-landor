'use client'

// Secao 3 da LP /varejo: o problema. Spin-off de components/condominio/Problema.tsx,
// mesma estrutura (cabecalho em duas colunas, comparativo antes/depois, tres dores),
// copy adaptada de portaria/condominio para caixa/loja.
//
// Fotos do comparativo reaproveitadas do /condominio: sao closes do proprio
// equipamento (prateleira cheia / locker instalado), sem nenhum elemento visual
// que amarre a cena a um condominio especifico.

import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CabecalhoSecao, Container, Destaque, Secao } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const comparativo = [
  {
    id: 'antes',
    src: '/lp-condominio/assets/v5/antes-1200.jpg',
    alt: 'Prateleiras de um estoque de loja lotadas de pedidos separados para retirada',
    rotulo: 'Retirada hoje',
    legenda: 'Prateleira, planilha e um funcionário parado separando pedido um por um',
    destacado: false,
  },
  {
    id: 'depois',
    src: '/lp-condominio/assets/v5/depois-1200.jpg',
    alt: 'Smart Locker Stoom navy instalado na área de retirada de uma loja',
    rotulo: 'Com o Smart Locker',
    legenda: 'Cliente escaneia o código, retira sozinho e a operação registra a retirada com foto',
    destacado: true,
  },
] as const

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

/** Duas fotos no desktop, uma por vez no celular (o original vira 1 coluna em 760px). */
const TAMANHOS_FOTO = '(max-width: 768px) 100vw, 50vw'

export default function Problema() {
  const reduce = useReducedMotion()

  return (
    <Secao id="problema">
      <Container>
        <CabecalhoSecao
          eyebrow="O problema"
          titulo={
            <>
              A cada campanha o número de pedidos online cresce, mas o tamanho da loja{' '}
              <Destaque sobreEscuro={false}>é o mesmo</Destaque>
            </>
          }
        />

        {/* ── Antes e depois ──────────────────────────────────────────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {comparativo.map((foto, i) => (
            <m.figure
              key={foto.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.07 }}
              className="relative overflow-hidden rounded-2xl bg-brand-primary aspect-[4/5] md:aspect-square"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes={TAMANHOS_FOTO}
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-primary/95 via-brand-primary/20 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-7 [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">
                <small
                  className={cn(
                    'block mb-2 font-roboto text-xs font-medium uppercase tracking-[0.14em]',
                    foto.destacado ? 'text-brand-highlight' : 'text-white/70'
                  )}
                >
                  {foto.rotulo}
                </small>
                <p className="font-outfit text-xl lg:text-2xl font-medium text-white leading-tight">
                  {foto.legenda}
                </p>
              </figcaption>
            </m.figure>
          ))}
        </div>

        {/* ── As tres dores ───────────────────────────────────────────────── */}
        <div className="mt-14 grid gap-x-10 gap-y-8 border-t border-gray-200 pt-10 md:grid-cols-3">
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
      </Container>
    </Secao>
  )
}
