'use client'

// Faixa de prova social da LP /varejo. Spin-off de components/condominio/ProvaSocial.tsx.
// Reaproveitada verbatim: frase, os quatro logos de cliente e os tres numeros nao
// sao especificos de condominio, sao fatos da empresa e do produto. So o modulo
// de tracking nao muda aqui porque esta secao nao dispara nenhum evento.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Container, Secao, SectionWrapper } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const FRASE = 'Há mais de 10 anos desenvolvendo tecnologia logística para operações como'

type Logo = {
  nome: string
  src: string
  altura: number
  largura: number
  alturaArquivo: number
}

const logos: readonly Logo[] = [
  {
    nome: 'Petz',
    src: '/lp-condominio/assets/clients/petz.png',
    altura: 20,
    largura: 1092,
    alturaArquivo: 240,
  },
  {
    nome: 'iFood Shop',
    src: '/lp-condominio/assets/clients/ifood-shop.png',
    altura: 34,
    largura: 330,
    alturaArquivo: 240,
  },
  {
    nome: 'Tenda Atacado',
    src: '/lp-condominio/assets/clients/tenda.png',
    altura: 30,
    largura: 378,
    alturaArquivo: 240,
  },
  {
    nome: 'Lello',
    src: '/lp-condominio/assets/clients/lello.png',
    altura: 28,
    largura: 512,
    alturaArquivo: 240,
  },
]

type NumeroProva = {
  alvo: number
  sufixo: string
  rotulo: string
}

const numeros: readonly NumeroProva[] = [
  { alvo: 10, sufixo: '+', rotulo: 'anos de tecnologia logística no Brasil' },
  { alvo: 24, sufixo: '/7', rotulo: 'retirada sem funcionário envolvido' },
  { alvo: 3, sufixo: '', rotulo: 'tamanhos de compartimento: P, M e G' },
]

const DURACAO_MS = 900
const LIMIAR_CONTAGEM = 0.4

function suavizar(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ─── Logo em mascara ──────────────────────────────────────────────────────────

function LogoCliente({ logo, indice }: { logo: Logo; indice: number }) {
  const reduce = useReducedMotion()

  return (
    <m.span
      role="listitem"
      aria-label={logo.nome}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : indice * 0.06 }}
      className="block shrink-0 bg-white/80"
      style={{
        height: logo.altura,
        aspectRatio: `${logo.largura} / ${logo.alturaArquivo}`,
        WebkitMaskImage: `url('${logo.src}')`,
        maskImage: `url('${logo.src}')`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}

// ─── Numero com contagem ──────────────────────────────────────────────────────

function NumeroAnimado({ dado, indice }: { dado: NumeroProva; indice: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const emVista = useInView(ref, { once: true, amount: LIMIAR_CONTAGEM })

  const [valor, setValor] = useState(dado.alvo)
  const [contando, setContando] = useState(false)

  useEffect(() => {
    if (reduce) return
    if (!emVista) return

    let quadro = 0
    const inicio = performance.now()
    setContando(true)
    setValor(0)

    const passo = (agora: number) => {
      const p = Math.min(1, (agora - inicio) / DURACAO_MS)
      setValor(Math.round(suavizar(p) * dado.alvo))
      if (p < 1) {
        quadro = requestAnimationFrame(passo)
      } else {
        setContando(false)
      }
    }

    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [emVista, reduce, dado.alvo])

  return (
    <m.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : indice * 0.07 }}
      className="flex items-baseline gap-4 md:block"
    >
      <b className="block min-w-[4.25rem] shrink-0 font-outfit text-[34px] font-bold leading-[0.95] tracking-[-0.03em] text-white tabular-nums md:min-w-0 md:text-[40px] lg:text-6xl">
        {valor}
        {dado.sufixo ? (
          <small
            className={cn(
              'ml-0.5 text-[0.5em] tracking-normal transition-opacity duration-150',
              contando ? 'opacity-0' : 'opacity-80'
            )}
          >
            {dado.sufixo}
          </small>
        ) : null}
      </b>
      <span className="block font-roboto text-sm leading-snug text-white/60 md:mt-2 md:max-w-[20ch]">
        {dado.rotulo}
      </span>
    </m.div>
  )
}

// ─── Secao ────────────────────────────────────────────────────────────────────

export default function ProvaSocial() {
  return (
    <Secao
      escura
      aria-label="Quem confia na Stoom"
      className="border-t border-white/10 py-0 pb-[72px] pt-10 lg:pb-20 lg:pt-16"
    >
      <Container>
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:items-center">
          <SectionWrapper>
            <p className="mb-[18px] max-w-[34ch] font-roboto text-[13px] leading-relaxed text-white/60">
              {FRASE}
            </p>

            <div
              role="list"
              aria-label="Clientes da Stoom"
              className="grid grid-cols-2 place-items-center gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-9 sm:gap-y-3.5"
            >
              {logos.map((logo, i) => (
                <LogoCliente key={logo.nome} logo={logo} indice={i} />
              ))}
            </div>
          </SectionWrapper>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {numeros.map((numero, i) => (
              <NumeroAnimado key={numero.rotulo} dado={numero} indice={i} />
            ))}
          </div>
        </div>
      </Container>
    </Secao>
  )
}
