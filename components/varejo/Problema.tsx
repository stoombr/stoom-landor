'use client'

// Secao 3 da LP /varejo: o problema. Spin-off de components/condominio/Problema.tsx,
// mesma estrutura (cabecalho + comparativo antes/depois), copy adaptada de
// portaria/condominio para caixa/loja.
//
// As "tres dores" que viviam aqui foram para a section propria Impacto.tsx:
// esta section acumulava titulo + comparativo + tres dores numa unica dobra.
//
// Foto "antes" e propria do varejo (public/pedidos.webp). Foto "depois" ainda
// reaproveitada do /condominio: e um close do proprio locker instalado, sem
// nenhum elemento visual que amarre a cena a um condominio especifico.

import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Container, Destaque, Eyebrow, Secao, SectionWrapper, Titulo } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const comparativo = [
  {
    id: 'antes',
    src: '/pedidos.webp',
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

/** Duas fotos no desktop, uma por vez no celular (o original vira 1 coluna em 760px). */
const TAMANHOS_FOTO = '(max-width: 768px) 100vw, 50vw'

export default function Problema() {
  const reduce = useReducedMotion()

  return (
    <Secao id="problema">
      <Container>
        <SectionWrapper className="mb-16">
          <Eyebrow sobreEscuro={false}>O problema</Eyebrow>
          {/* max-w mais largo que o padrao (24ch) do CabecalhoSecao: a copy foi
              escrita para quebrar em exatamente duas linhas via <br/>, e o
              container padrao (pensado para uma unica sentenca corrida) a
              quebraria de novo, voltando a dar tres ou quatro linhas. */}
          <Titulo sobreEscuro={false} className="max-w-[34ch]">
            O volume de pedidos cresce a cada dia,
            <br />
            mas o tamanho da loja <Destaque sobreEscuro={false}>é o mesmo</Destaque>.
          </Titulo>
        </SectionWrapper>

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
      </Container>
    </Secao>
  )
}
