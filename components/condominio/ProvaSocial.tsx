'use client'

// Faixa de prova social da LP /condominio (`.proof` do original, secao sem id).
//
// E uma faixa, nao um capitulo: encosta no hero, separada so por um fio, com
// 40px de respiro em cima e 72px embaixo. Por isso ela e a unica secao da LP que
// nao usa o `py-24 lg:py-32` do repositorio; com o ritmo normal a faixa vira um
// bloco vazio de navy e o desenho aprovado se perde. O override vem no className.
//
// Duas colunas de mesma largura: a esquerda tem a frase de credibilidade e os
// quatro logos de cliente em monocromia clara; a direita tem os tres numeros,
// que contam uma unica vez ao entrar na tela.
//
// Os numeros 24/7 e 3 sao provisorios: quando a Stoom mandar condominios
// atendidos e encomendas por mes, e aqui que eles entram.

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Container, Secao, SectionWrapper } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const FRASE = 'Há mais de 10 anos desenvolvendo tecnologia logística para operações como'

type Logo = {
  /** Vira o nome acessivel do item da lista (o logo e pintado por mascara, nao por <img>). */
  nome: string
  src: string
  /** Altura renderizada em px. Cada marca tem a sua para o peso visual da fileira bater. */
  altura: number
  /** Dimensoes reais do arquivo, so para calcular o aspect-ratio da caixa mascarada. */
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
  /** Valor final da contagem. */
  alvo: number
  /** Unidade colada no numero. Some enquanto a contagem roda, igual ao original. */
  sufixo: string
  rotulo: string
}

const numeros: readonly NumeroProva[] = [
  { alvo: 10, sufixo: '+', rotulo: 'anos de tecnologia logística no Brasil' },
  { alvo: 24, sufixo: '/7', rotulo: 'retirada sem funcionário envolvido' },
  { alvo: 3, sufixo: '', rotulo: 'tamanhos de compartimento, homologados pelos Correios' },
]

/** Duracao da contagem, igual ao original. */
const DURACAO_MS = 900

/**
 * Fracao visivel que dispara a contagem. E o `threshold: 0.4` do
 * IntersectionObserver do original, traduzido para o `amount` do useInView.
 */
const LIMIAR_CONTAGEM = 0.4

/** easeOutCubic, a mesma curva do original. */
function suavizar(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ─── Logo em mascara ──────────────────────────────────────────────────────────

/**
 * Logo de cliente pintado por CSS mask.
 *
 * Nao e `next/image` de proposito: o original transforma o PNG colorido em uma
 * silhueta de uma cor so (`background: var(--on-dark)` recortado pela mascara),
 * e mascara nao se aplica a um <img>. A caixa e um <span> com fundo branco a 80%
 * recortado pelo PNG. O nome acessivel vem do `aria-label`, entao nao ha perda
 * de semantica em relacao a um alt.
 */
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

/**
 * Numero grande que conta de 0 ate o alvo, uma unica vez, quando 40% dele entra
 * na tela. Com `prefers-reduced-motion` nao ha contagem: o numero ja nasce
 * pronto. O sufixo (`+`, `/7`) some durante a contagem e volta no fim, para nao
 * ficar "0+" no meio do caminho.
 */
function NumeroAnimado({ dado, indice }: { dado: NumeroProva; indice: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const emVista = useInView(ref, { once: true, amount: LIMIAR_CONTAGEM })

  // Nasce no valor final: e o que o servidor renderiza e o que fica de pe sem
  // JS. Na hidratacao o efeito zera, muito antes de a faixa chegar na tela.
  const [valor, setValor] = useState(dado.alvo)
  const [contando, setContando] = useState(false)

  useEffect(() => {
    if (reduce) return

    // Fora do gatilho o numero fica no valor final: e o que o servidor manda e
    // o que o visitante ve se nunca rolar ate aqui. Zerar antes fazia a faixa
    // exibir "0+" e "0/7", coisa que o original nunca mostra. O zero entra no
    // mesmo tick que inicia a contagem.
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
    >
      <b className="block font-outfit text-[40px] font-bold leading-[0.95] tracking-[-0.03em] text-white tabular-nums lg:text-6xl">
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
      <span className="mt-2 block max-w-[20ch] font-roboto text-sm leading-snug text-white/60">
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
      // `py-0 lg:py-0` derruba o ritmo padrao da Secao; ver o comentario do topo.
      // O fio de cima e a unica costura entre o hero e esta faixa.
      className="border-t border-white/10 py-0 pb-[72px] pt-10 lg:py-0"
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
              className="flex flex-wrap items-center gap-x-9 gap-y-3.5"
            >
              {logos.map((logo, i) => (
                <LogoCliente key={logo.nome} logo={logo} indice={i} />
              ))}
            </div>
          </SectionWrapper>

          {/* Duas colunas no celular, tres a partir do tablet, como no original. */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {numeros.map((numero, i) => (
              <NumeroAnimado key={numero.rotulo} dado={numero} indice={i} />
            ))}
          </div>
        </div>
      </Container>
    </Secao>
  )
}
