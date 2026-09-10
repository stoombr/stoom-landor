'use client'

// Secao 3 da LP /condominio: o problema (`#problema` do original, capitulo claro).
//
// Tres blocos, na ordem do HTML fonte:
//   1. cabecalho em duas colunas (titulo a esquerda, lead a direita, alinhados pela base)
//   2. comparativo antes/depois em duas fotos quadradas com legenda sobre gradiente
//   3. as tres dores em tres colunas, separadas por uma divisoria clara
//
// A secao nao tem CTA nem icone nas dores: o original tambem nao tem, e o texto
// segue verbatim de lp-stoom-oficial/index.html.

import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CabecalhoSecao, Container, Destaque, Secao } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/**
 * As duas fotos do comparativo. `destacado` marca o quadro "depois": no original
 * so o rotulo dele e ciano (`.shot.after .cap small`), o resto e igual.
 */
const comparativo = [
  {
    id: 'antes',
    src: '/lp-condominio/assets/v5/antes-1200.jpg',
    alt: 'Prateleiras de uma sala de correspondência lotadas de caixas de encomenda',
    rotulo: 'Portaria hoje',
    legenda: 'Prateleira, caderno e o porteiro parado entregando pacote um por um',
    destacado: false,
  },
  {
    id: 'depois',
    src: '/lp-condominio/assets/v5/depois-1200.jpg',
    alt: 'Smart Locker Stoom navy instalado no hall de um condomínio',
    rotulo: 'Com o Smart Locker',
    legenda: 'Tranca sozinho, avisa o morador na hora e registra cada retirada com foto',
    destacado: true,
  },
] as const

const dores = [
  {
    titulo: 'A portaria trava no fim do dia',
    texto:
      'Entre 17h e 21h chega tudo junto. O porteiro para de olhar a entrada para registrar, guardar e depois entregar pacote, um por um.',
  },
  {
    titulo: 'Encomenda que ninguém sabe onde foi',
    texto:
      'Sem registro no momento da entrega, não existe como provar quem recebeu e quem retirou. A conta sobra para a administração.',
  },
  {
    titulo: 'Morador que só chega de noite',
    texto:
      'Quem trabalha fora depende do horário da portaria e do humor da escala. A cobrança vira assunto de assembleia.',
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
              Todo mês o número de encomendas cresce, mas o tamanho da portaria{' '}
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
              {/* Escurecimento do rodape da foto, para a legenda ler em qualquer imagem. */}
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
              {/* Peso 500, nao bold: e o desenho dos h3 da LP aprovada. */}
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
