'use client'

// Video de fundo do hero (zoom lento, mudo, em loop).
//
// E enfeite, nunca conteudo: a foto do hero continua sendo o que carrega, o que
// aparece no LCP e o que sobra se qualquer coisa falhar. O video so entra por
// cima, em fade, quando as quatro guardas do original passam:
//   1. tela >= 761px            (no celular a foto vertical basta)
//   2. sem prefers-reduced-motion
//   3. sem save-data
//   4. depois do evento `load` da pagina + 400ms
// O atraso existe para nao disputar banda com a imagem do hero e com as fontes.
//
// Posicao no JSX: entre a <Image> do hero e as camadas de escurecimento, do
// mesmo jeito que o original insere o <video> antes do `.hero-shade`.

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { eventoVideoPlay } from '@/lib/condominio/tracking'

// ─── Dados ────────────────────────────────────────────────────────────────────

const FONTE = '/lp-condominio/assets/video/locker.mp4'

/** Largura minima para montar o video (o original usa `min-width: 761px`). */
const CONSULTA_DESKTOP = '(min-width: 761px)'

const CONSULTA_MOVIMENTO = '(prefers-reduced-motion: reduce)'

/** Atraso depois do `load`, para o video nao competir com o LCP. */
const ATRASO_MS = 400

/** Mesmo tratamento de imagem do hero, para o corte entre foto e video nao pular. */
const CLASSES_BASE =
  'absolute inset-0 h-full w-full object-cover object-[62%_50%] brightness-[0.7] saturate-[0.9] pointer-events-none'

type NavegadorComConexao = Navigator & { connection?: { saveData?: boolean } }

type HeroVideoProps = {
  className?: string
}

export default function HeroVideo({ className }: HeroVideoProps) {
  const reduce = useReducedMotion()
  const [montado, setMontado] = useState(false)
  const [tocando, setTocando] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const jaNotificou = useRef(false)

  // Guardas + espera do load.
  useEffect(() => {
    if (reduce) {
      setMontado(false)
      return
    }
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (!window.matchMedia(CONSULTA_DESKTOP).matches) return
    if (window.matchMedia(CONSULTA_MOVIMENTO).matches) return

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
      src={FONTE}
      className={cn(CLASSES_BASE, className)}
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
