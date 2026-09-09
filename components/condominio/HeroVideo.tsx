'use client'

// Video de fundo do hero (zoom lento, mudo, em loop).
//
// E enfeite, nunca conteudo: a foto do hero continua sendo o que carrega, o que
// aparece no LCP e o que sobra se qualquer coisa falhar. O video so entra por
// cima, em fade, quando as quatro guardas do original passam:
//   1. sem prefers-reduced-motion
//   2. sem save-data
//   3. depois do evento `load` da pagina + 400ms
// A guarda de largura saiu: ela fazia o mesmo celular mostrar video deitado e
// nao mostrar em pe. Hoje a largura so escolhe QUAL recorte usar.
// O atraso existe para nao disputar banda com a imagem do hero e com as fontes.
//
// Posicao no JSX: entre a <Image> do hero e as camadas de escurecimento, do
// mesmo jeito que o original insere o <video> antes do `.hero-shade`.

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { eventoVideoPlay } from '@/lib/condominio/tracking'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Recorte horizontal, para telas largas. */
const FONTE_LARGA = '/lp-condominio/assets/video/locker.mp4'

/** Recorte vertical, para o celular em pe. Mesma direcao de arte da foto. */
const FONTE_ALTA = '/lp-condominio/assets/video/locker-vertical.mp4'

/**
 * Divide qual dos dois recortes usar. NAO decide mais se o video existe: antes
 * decidia, e por isso o mesmo celular mostrava video deitado (Pixel da 863) e
 * nao mostrava em pe (393), enquanto o iPhone nao mostrava nem deitado (734).
 */
const CONSULTA_LARGA = '(min-width: 761px)'

const CONSULTA_MOVIMENTO = '(prefers-reduced-motion: reduce)'

/** Atraso depois do `load`, para o video nao competir com o LCP. */
const ATRASO_MS = 400

/** Mesmo tratamento de imagem do hero, para o corte entre foto e video nao pular. */
const CLASSES_BASE =
  'absolute inset-0 h-full w-full object-cover brightness-[0.7] saturate-[0.9] pointer-events-none'

/**
 * Enquadramento por recorte. O horizontal puxa para 62%, o mesmo da foto larga,
 * para o titulo cair sobre a parede e nao sobre o morador. O vertical ja nasce
 * cortado no lugar certo, entao fica no centro.
 */
const POSICAO = { largo: 'object-[62%_50%]', alto: 'object-center' } as const

type NavegadorComConexao = Navigator & { connection?: { saveData?: boolean } }

type HeroVideoProps = {
  className?: string
}

export default function HeroVideo({ className }: HeroVideoProps) {
  const reduce = useReducedMotion()
  const [montado, setMontado] = useState(false)
  const [tocando, setTocando] = useState(false)
  const [largo, setLargo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const jaNotificou = useRef(false)

  // Guardas + espera do load.
  useEffect(() => {
    if (reduce) {
      setMontado(false)
      return
    }
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (window.matchMedia(CONSULTA_MOVIMENTO).matches) return

    // Escolhe o recorte e continua ouvindo: girar o aparelho troca o arquivo em
    // vez de deixar o video sumir, que era o comportamento antigo.
    const consulta = window.matchMedia(CONSULTA_LARGA)
    setLargo(consulta.matches)
    const aoTrocar = (e: MediaQueryListEvent) => setLargo(e.matches)
    consulta.addEventListener('change', aoTrocar)

    const conexao = (navigator as NavegadorComConexao).connection
    if (conexao && conexao.saveData) return

    let temporizador: number | undefined
    const agendar = () => {
      temporizador = window.setTimeout(() => setMontado(true), ATRASO_MS)
    }

    if (document.readyState === 'complete') {
      agendar()
    } else {
      window.addEventListener('load', agendar, { once: true })
    }

    return () => {
      consulta.removeEventListener('change', aoTrocar)
      window.removeEventListener('load', agendar)
      if (temporizador !== undefined) window.clearTimeout(temporizador)
    }
  }, [reduce])

  // Alguns navegadores ignoram o autoplay do atributo em elemento inserido depois
  // do load. Chamamos play() na mao e, se o navegador recusar, o video se remove.
  useEffect(() => {
    if (!montado) return
    const video = videoRef.current
    if (!video) return

    const promessa = video.play()
    if (promessa && typeof promessa.catch === 'function') {
      promessa.catch(() => setMontado(false))
    }
  }, [montado])

  if (!montado) return null

  function aoTocar() {
    setTocando(true)
    if (jaNotificou.current) return
    jaNotificou.current = true
    eventoVideoPlay()
  }

  function aoFalhar() {
    // Some e devolve a cena para a foto, sem barulho.
    setTocando(false)
    setMontado(false)
  }

  return (
    <m.video
      ref={videoRef}
      src={largo ? FONTE_LARGA : FONTE_ALTA}
      className={cn(CLASSES_BASE, largo ? POSICAO.largo : POSICAO.alto, className)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: tocando ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      onPlaying={aoTocar}
      onError={aoFalhar}
    />
  )
}
