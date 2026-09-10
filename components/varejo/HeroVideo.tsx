'use client'

// Video de fundo do hero (zoom lento, mudo, em loop).
//
// Spin-off de components/condominio/HeroVideo.tsx, mas com filmagem propria do
// varejo (cliente compra pelo celular, vai ate a loja e retira no locker).
// So existe recorte horizontal: o material entregue e um unico plano
// 1920x1080, sem versao vertical. Por isso o video fica desktop-only e o
// celular continua so na foto estatica (FOTO_FUNDO em Hero.tsx) — esticar
// esse mesmo plano num recorte vertical cortaria a cena de forma ruim.
// Guardas antes de montar:
//   1. sem prefers-reduced-motion
//   2. sem save-data
//   3. so em telas largas (sem recorte vertical para o celular)
//   4. depois do evento `load` da pagina + 400ms

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { eventoVideoPlay } from '@/lib/varejo/tracking'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Unico recorte disponivel: horizontal, para telas largas. */
const FONTE_LARGA = '/varejo.mp4'

/** Abaixo disso o celular fica so na foto: nao existe recorte vertical do video. */
const CONSULTA_LARGA = '(min-width: 761px)'

const CONSULTA_MOVIMENTO = '(prefers-reduced-motion: reduce)'

/** Atraso depois do `load`, para o video nao competir com o LCP. */
const ATRASO_MS = 400

/** Mesmo tratamento de imagem do hero, para o corte entre foto e video nao pular. */
const CLASSES_BASE =
  'absolute inset-0 h-full w-full object-cover object-center brightness-[0.7] saturate-[0.9] pointer-events-none'

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
    if (window.matchMedia(CONSULTA_MOVIMENTO).matches) return

    // So existe recorte largo: em telas estreitas o video nem monta, e girar o
    // aparelho para largo/estreito entra ou sai dele ao vivo.
    const consulta = window.matchMedia(CONSULTA_LARGA)
    const aoTrocarLargura = (e: MediaQueryListEvent) => {
      if (!e.matches) setMontado(false)
    }
    consulta.addEventListener('change', aoTrocarLargura)
    if (!consulta.matches) return () => consulta.removeEventListener('change', aoTrocarLargura)

    const conexao = (navigator as NavegadorComConexao).connection
    if (conexao && conexao.saveData) return () => consulta.removeEventListener('change', aoTrocarLargura)

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
      consulta.removeEventListener('change', aoTrocarLargura)
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
      src={FONTE_LARGA}
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
