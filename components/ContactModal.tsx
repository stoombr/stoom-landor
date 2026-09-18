'use client'

// Modal de contato da home e de /smart-locker. Mesma casca visual (véu,
// cartão, animações, trava de scroll/foco, inert no fundo, ciclo de Tab e
// Escape) dos modais de /condominio e /varejo
// (components/condominio/LeadModal.tsx e components/varejo/LeadModal.tsx).
//
// Diferença de propósito: aquelas LPs têm formulário React próprio, validado
// campo a campo, que manda o lead direto pela Forms API. Aqui o corpo é o
// embed real do HubSpot (script "developer" + <div class="hs-form-html">),
// a mesma técnica que já vivia em components/CTA.tsx antes desta mudança —
// só migrou de "seção com formulário embutido" para "botão que abre modal".
//
// Detecção de sucesso: MutationObserver no container observa o
// <form data-hsfc-id="Form"> desaparecer do DOM (o HubSpot substitui pelo
// estado de "obrigado" pós-envio) e dispara os mesmos eventos de analytics
// que o CTA.tsx antigo disparava (dataLayer, GA4, Meta Pixel).

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CircleCheck as CheckCircle, X } from 'lucide-react'
import Script from 'next/script'
import { cn } from '@/lib/utils'
import './hubspot-form-modal.css'

const HUBSPOT_PORTAL_ID = '51547160'
const HUBSPOT_FORM_ID = '6c33c565-d83e-41e5-80e7-75e316ad7c36'

const focoVisivel =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

export type ContactModalProps = {
  aberto: boolean
  aoFechar: () => void
}

export default function ContactModal({ aberto, aoFechar }: ContactModalProps) {
  const reduzir = useReducedMotion()

  const [montado, setMontado] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [formPronto, setFormPronto] = useState(false)

  const refModal = useRef<HTMLDivElement>(null)
  const refFechar = useRef<HTMLButtonElement>(null)
  const refFormContainer = useRef<HTMLDivElement>(null)
  const refFecharAtual = useRef(aoFechar)

  useEffect(() => {
    refFecharAtual.current = aoFechar
  })

  useEffect(() => {
    setMontado(true)
  }, [])

  // Sem isto o modal reabriria preso na tela "Mensagem enviada!". O atraso
  // deixa a animação de saída terminar antes do formulário reaparecer.
  useEffect(() => {
    if (aberto) return
    const id = window.setTimeout(() => setEnviado(false), 300)
    return () => window.clearTimeout(id)
  }, [aberto])

  // O modal fica sempre montado no DOM (nunca desmonta) — assim o script do
  // HubSpot só precisa injetar o formulário uma vez, e fechar/reabrir não
  // perde os campos. Fechado, ele fica inert (fora do foco/leitor de tela).
  useEffect(() => {
    const el = refModal.current
    if (!el) return
    if (aberto) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [aberto, montado])

  // ── Detecção de carregamento e envio ────────────────────────────────────
  // Fica observando o container desde a montagem (não só enquanto o modal
  // está aberto): agora o script do HubSpot carrega assim que a página
  // monta, então os campos podem ser injetados antes da primeira abertura —
  // sem essa checagem síncrona logo ao anexar, o observer só reagiria a
  // mutações futuras e nunca perceberia um formulário que já chegou.
  useEffect(() => {
    if (enviado) return
    const container = refFormContainer.current
    if (!container) return

    let formRenderizado = !!container.querySelector('form[data-hsfc-id="Form"]')
    if (formRenderizado) setFormPronto(true)

    const observer = new MutationObserver(() => {
      const temForm = !!container.querySelector('form[data-hsfc-id="Form"]')

      if (temForm) {
        formRenderizado = true
        setFormPronto(true)
        return
      }

      if (formRenderizado) {
        formRenderizado = false

        if (typeof window !== 'undefined') {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ event: 'lead_form_success' })

          if (typeof (window as any).gtag === 'function') {
            ;(window as any).gtag('event', 'generate_lead', {
              event_category: 'engagement',
              event_label: 'Formulário de contato (HubSpot)',
            })
          }

          if (typeof (window as any).fbq === 'function') {
            ;(window as any).fbq('track', 'Lead')
          }
        }

        setEnviado(true)
      }
    })

    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [montado, enviado])

  // ── Trava de scroll, inert no fundo e devolução do foco ─────────────────
  useEffect(() => {
    if (!aberto) return

    const corpo = document.body
    const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0

    const estiloAnterior = {
      position: corpo.style.position,
      top: corpo.style.top,
      left: corpo.style.left,
      right: corpo.style.right,
      width: corpo.style.width,
      overflow: corpo.style.overflow,
    }

    corpo.style.position = 'fixed'
    corpo.style.top = -scrollY + 'px'
    corpo.style.left = '0'
    corpo.style.right = '0'
    corpo.style.width = '100%'
    corpo.style.overflow = 'hidden'

    const inertados: Element[] = []
    Array.from(corpo.children).forEach((el) => {
      if (el === refModal.current) return
      if (el.hasAttribute('inert')) return
      const tag = el.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'TEMPLATE') return
      el.setAttribute('inert', '')
      inertados.push(el)
    })

    return () => {
      corpo.style.position = estiloAnterior.position
      corpo.style.top = estiloAnterior.top
      corpo.style.left = estiloAnterior.left
      corpo.style.right = estiloAnterior.right
      corpo.style.width = estiloAnterior.width
      corpo.style.overflow = estiloAnterior.overflow
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' as ScrollBehavior })
      inertados.forEach((el) => el.removeAttribute('inert'))
      if (focoAnterior && typeof focoAnterior.focus === 'function')
        focoAnterior.focus({ preventScroll: true })
    }
  }, [aberto])

  // ── Foco inicial no botão de fechar ──────────────────────────────────────
  useEffect(() => {
    if (!aberto) return
    const id = window.setTimeout(() => refFechar.current?.focus(), 80)
    return () => window.clearTimeout(id)
  }, [aberto])

  // ── Escape e ciclo de foco no Tab ────────────────────────────────────────
  useEffect(() => {
    if (!aberto) return

    function focaveis(raiz: HTMLElement): HTMLElement[] {
      const encontrados: HTMLElement[] = []
      raiz.querySelectorAll<HTMLElement>('button,[href],input,select,textarea').forEach((el) => {
        const desabilitado = (el as HTMLButtonElement).disabled === true
        if (!desabilitado && el.offsetParent !== null) encontrados.push(el)
      })
      return encontrados
    }

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        refFecharAtual.current()
        return
      }
      if (e.key !== 'Tab') return

      const raiz = refModal.current
      if (!raiz) return
      const lista = focaveis(raiz)
      if (lista.length === 0) return

      const primeiro = lista[0]
      const ultimo = lista[lista.length - 1]
      const ativo = document.activeElement

      if (e.shiftKey && ativo === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && (ativo === ultimo || !raiz.contains(ativo))) {
        e.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  // ── Render ────────────────────────────────────────────────────────────────

  if (!montado) return null

  const duracaoEntrada = reduzir ? 0 : 0.22
  const duracaoSaida = reduzir ? 0 : 0.15

  return (
    <>
      <Script
        id="hs-form-embed-script"
        src={`https://js.hsforms.net/forms/embed/developer/${HUBSPOT_PORTAL_ID}.js`}
        strategy="afterInteractive"
      />

      {createPortal(
        <div
          ref={refModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby={enviado ? 'contatoFeito' : 'contatoTitulo'}
          className={cn(
            'fixed inset-0 z-[60] flex items-center justify-center p-4',
            !aberto && 'pointer-events-none'
          )}
        >
          {/* véu */}
          <m.div
            aria-hidden="true"
            onClick={aoFechar}
            initial={false}
            animate={{ opacity: aberto ? 1 : 0 }}
            transition={{ duration: aberto ? duracaoEntrada : duracaoSaida, ease: 'easeOut' }}
            className="absolute inset-0 bg-brand-primary/70 backdrop-blur-[10px]"
          />

          {/* cartão */}
          <m.div
            initial={false}
            animate={{
              opacity: aberto ? 1 : 0,
              y: reduzir ? 0 : aberto ? 0 : 8,
              scale: reduzir ? 1 : aberto ? 1 : 0.98,
            }}
            transition={{ duration: aberto ? duracaoEntrada : duracaoSaida, ease: 'easeOut' }}
            className="relative w-full max-w-[560px] max-h-[calc(100dvh_-_32px)] overflow-auto rounded-2xl bg-white px-5 py-6 text-brand-primary shadow-[0_30px_80px_rgb(0_0_0/0.45)] sm:p-8"
          >
            <button
              ref={refFechar}
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className={cn(
                'absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-gray-500 transition-colors hover:text-brand-primary',
                focoVisivel
              )}
            >
              <X size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>

            {enviado ? (
              <div role="status" className="py-4 text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-primary text-white">
                  <CheckCircle size={24} strokeWidth={2.4} aria-hidden="true" />
                </span>
                <h3
                  id="contatoFeito"
                  className="font-outfit text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-brand-primary"
                >
                  Mensagem enviada!
                </h3>
                <p className="mt-2 font-roboto text-gray-600 leading-relaxed">
                  Nossa equipe entrará em contato em breve.
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-3.5 inline-flex items-center gap-3 font-roboto text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
                  <span aria-hidden="true" className="h-0.5 w-6 flex-shrink-0 bg-brand-highlight" />
                  Fale com a Stoom
                </p>
                <h3
                  id="contatoTitulo"
                  className="mb-6 font-outfit text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-brand-primary"
                >
                  Fale com um especialista
                </h3>

                <div className="relative min-h-[460px]">
                  <div
                    ref={refFormContainer}
                    className="hs-form-html stoom-hs-form-modal"
                    data-region="na1"
                    data-form-id={HUBSPOT_FORM_ID}
                    data-portal-id={HUBSPOT_PORTAL_ID}
                  />

                  {/* Skeleton: cobre o container enquanto o HubSpot ainda não
                      injetou os campos, pra evitar o "pulo" de o modal abrir só
                      com o título e o rodapé de LGPD e depois expandir de repente. */}
                  {!formPronto && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex flex-col gap-4 bg-white"
                    >
                      <div className="flex gap-4">
                        <div className="h-[46px] flex-1 animate-pulse rounded-xl bg-gray-100" />
                        <div className="h-[46px] flex-1 animate-pulse rounded-xl bg-gray-100" />
                      </div>
                      <div className="h-[46px] animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[46px] animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[46px] animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[100px] animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[70px] animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[52px] animate-pulse rounded-full bg-gray-200" />
                    </div>
                  )}
                </div>

                <p className="mt-4 text-center font-roboto text-[13px] text-gray-500">
                  Seus dados estão protegidos conforme a LGPD.
                </p>
              </div>
            )}
          </m.div>
        </div>,
        document.body
      )}
    </>
  )
}
