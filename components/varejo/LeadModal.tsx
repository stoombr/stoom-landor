'use client'

// Modal de conversao da LP /varejo: o unico caminho de lead da pagina.
// Spin-off de components/condominio/LeadModal.tsx: mesmo mecanismo de embed
// real do HubSpot (ver comentario la para o historico completo). Diferenca
// de copy: o campo "Nome da empresa" e relabeled para "Nome da rede ou loja" em vez
// de "Nome do condomínio", e o titulo/eyebrow sao os desta LP.

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from 'lucide-react'
import Script from 'next/script'
import { Eyebrow, focoVisivel } from '@/components/condominio/ui'
import { HUBSPOT, eventoFormInicio, eventoLead } from '@/lib/varejo/tracking'
import { cn } from '@/lib/utils'
import '../hubspot-form-lp.css'

const POLITICA_PRIVACIDADE = 'https://www.stoom.com.br/institucional/politica-de-privacidade'

type HubSpotFormV4 = {
  getInstanceId: () => string
  setFieldValue: (nome: string, valor: string | string[]) => void
}

type HubSpotFormsV4 = {
  getForms: () => HubSpotFormV4[]
  getFormFromEvent: (evento: CustomEvent) => HubSpotFormV4 | undefined
}

const ROTULO_EMPRESA = 'Nome da rede ou loja'

// "Nome da empresa" do form compartilhado vira o rotulo desta LP.
function aplicarRotulo(container: HTMLElement) {
  const rotulo = container
    .querySelector<HTMLInputElement>('input[name="0-1/company"]')
    ?.closest('[data-hsfc-id="TextField"]')
    ?.querySelector<HTMLElement>('label span > span')
  if (rotulo && rotulo.textContent !== ROTULO_EMPRESA) rotulo.textContent = ROTULO_EMPRESA
}

export type LeadModalProps = {
  aberto: boolean
  aoFechar: () => void
}

export default function LeadModal({ aberto, aoFechar }: LeadModalProps) {
  const reduzir = useReducedMotion()

  const [montado, setMontado] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [formPronto, setFormPronto] = useState(false)
  // Trocar a key do container recria o <div class="hs-form-html"> do zero.
  const [versaoForm, setVersaoForm] = useState(0)

  const refModal = useRef<HTMLDivElement>(null)
  const refFechar = useRef<HTMLButtonElement>(null)
  const refConcluido = useRef<HTMLDivElement>(null)
  const refFormContainer = useRef<HTMLDivElement>(null)
  const refFormIniciado = useRef(false)
  const refFecharAtual = useRef(aoFechar)

  useEffect(() => {
    refFecharAtual.current = aoFechar
  })

  useEffect(() => {
    setMontado(true)
  }, [])

  // Sem isto o modal reabriria preso na tela "Recebido!". O atraso deixa a
  // animacao de saida terminar antes do formulario reaparecer.
  //
  // Depois de um envio, o container do HubSpot fica com a mensagem de
  // agradecimento no lugar do form. O script "developer" so injeta o form em
  // elementos .hs-form-html recem-inseridos (o MutationObserver dele checa o
  // proprio no adicionado, nao descendentes) e marca data-fetched no container.
  // Por isso, ao fechar apos um envio, trocamos a key do container: o React
  // insere um .hs-form-html novo e o HubSpot injeta um form limpo nele.
  useEffect(() => {
    if (aberto || !enviado) return
    const id = window.setTimeout(() => {
      setEnviado(false)
      setFormPronto(false)
      setVersaoForm((v) => v + 1)
      refFormIniciado.current = false
    }, 300)
    return () => window.clearTimeout(id)
  }, [aberto, enviado])

  // Sempre montado no DOM; fechado, fica inert (fora do foco/leitor de tela).
  useEffect(() => {
    const el = refModal.current
    if (!el) return
    if (aberto) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [aberto, montado])

  // ── Ajustes no form injetado: relabel do campo empresa + produto ──────────
  // O HTML do form chega antes do React do HubSpot hidratar (script de modulo
  // carregado depois). Qualquer mudanca de estado feita antes disso (ex.: um
  // input.click() no checkbox) nao entra no estado interno do form, e o envio
  // falha com "Preencha todos os campos obrigatorios" por causa do campo
  // oculto. Por isso o produto so e marcado no evento on-ready, pela API
  // oficial (HubSpotFormsV4.getFormFromEvent().setFieldValue). O listener fica
  // ativo desde a montagem e, ao anexar, checa se o form ja hidratou (o id do
  // container e o instanceId que o HubSpot usa).
  useEffect(() => {
    const container = refFormContainer.current
    if (!container) return

    const api = () => (window as unknown as { HubSpotFormsV4?: HubSpotFormsV4 }).HubSpotFormsV4

    const marcarProduto = (form: HubSpotFormV4 | undefined) => {
      if (form) {
        form.setFieldValue('0-1/produto', ['Smart Locker'])
      } else {
        // Fallback: depois da hidratacao o clique passa pelo handler do React.
        const checkbox = container.querySelector<HTMLInputElement>(
          'input[name="0-1/produto"][value="Smart Locker"]'
        )
        if (checkbox && !checkbox.checked) checkbox.click()
      }
      aplicarRotulo(container)
    }

    const aoFicarPronto = (evento: Event) => {
      marcarProduto(api()?.getFormFromEvent(evento as CustomEvent))
    }

    if (container.id) {
      const jaPronto = api()
        ?.getForms()
        .find((f) => f.getInstanceId() === container.id)
      if (jaPronto) marcarProduto(jaPronto)
    }

    container.addEventListener('hs-form-event:on-ready', aoFicarPronto)
    return () => container.removeEventListener('hs-form-event:on-ready', aoFicarPronto)
  }, [montado, versaoForm])

  // Relabel assim que o HTML chega (antes da hidratacao), pra nao piscar o
  // rotulo original; o on-ready acima reaplica caso a hidratacao o reverta.
  useEffect(() => {
    const container = refFormContainer.current
    if (!container || !formPronto) return
    aplicarRotulo(container)
  }, [formPronto])

  // ── Deteccao de carregamento e envio ─────────────────────────────────────────
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
        eventoLead()
        setEnviado(true)
      }
    })

    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [montado, enviado, versaoForm])

  const aoFocarFormulario = () => {
    if (refFormIniciado.current) return
    refFormIniciado.current = true
    eventoFormInicio()
  }

  // ── Trava de scroll, inert no fundo e devolucao do foco ─────────────────────

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

    // Tudo que nao e o modal sai da arvore de acessibilidade e do foco.
    // Iteramos os filhos do body porque o modal vive num portal: nao dependemos
    // de saber quais secoes a pagina montou.
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
      // 'instant' porque o globals.css declara scroll-behavior: smooth, e o
      // scroll suave aqui faz a pagina deslizar sozinha ao fechar o modal.
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' as ScrollBehavior })
      // Tirar o inert antes de devolver o foco: nao da para focar dentro de inert.
      inertados.forEach((el) => el.removeAttribute('inert'))
      if (focoAnterior && typeof focoAnterior.focus === 'function')
        focoAnterior.focus({ preventScroll: true })
    }
  }, [aberto])

  // ── Foco inicial ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!aberto) return
    const id = window.setTimeout(() => {
      if (enviado) {
        refConcluido.current?.focus()
        return
      }
      refFechar.current?.focus()
    }, 80)
    return () => window.clearTimeout(id)
    // Deliberado: so no momento da abertura. A troca para a tela de sucesso tem
    // o efeito proprio logo abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  useEffect(() => {
    if (!aberto || !enviado) return
    refConcluido.current?.focus()
  }, [aberto, enviado])

  // ── Escape e ciclo de foco no Tab ────────────────────────────────────────────

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

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!montado) return null

  const duracaoEntrada = reduzir ? 0 : 0.22
  const duracaoSaida = reduzir ? 0 : 0.15

  return (
    <>
      <Script
        id="hs-form-embed-script"
        src={`https://js.hsforms.net/forms/embed/developer/${HUBSPOT.portalId}.js`}
        strategy="afterInteractive"
      />

      {createPortal(
        <div
          ref={refModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby={enviado ? 'mFeito' : 'mTitle'}
          className={cn(
            'fixed inset-0 z-[60] flex items-center justify-center p-4',
            !aberto && 'pointer-events-none'
          )}
        >
          {/* veu */}
          <m.div
            aria-hidden="true"
            onClick={aoFechar}
            initial={false}
            animate={{ opacity: aberto ? 1 : 0 }}
            transition={{ duration: aberto ? duracaoEntrada : duracaoSaida, ease: 'easeOut' }}
            className="absolute inset-0 bg-brand-ink/70 backdrop-blur-[10px]"
          />

          {/* cartao */}
          <m.div
            initial={false}
            animate={{
              opacity: aberto ? 1 : 0,
              y: reduzir ? 0 : aberto ? 0 : 8,
              scale: reduzir ? 1 : aberto ? 1 : 0.98,
            }}
            transition={{ duration: aberto ? duracaoEntrada : duracaoSaida, ease: 'easeOut' }}
            className="relative w-full max-w-[520px] max-h-[calc(100dvh_-_32px)] overflow-auto rounded-2xl bg-white px-5 py-6 text-brand-primary shadow-[0_30px_80px_rgb(0_0_0/0.45)] sm:p-8"
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

            {enviado && (
              <div
                ref={refConcluido}
                tabIndex={-1}
                role="status"
                className="py-4 text-center focus:outline-none"
              >
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-primary text-white">
                  <Check size={24} strokeWidth={2.4} aria-hidden="true" />
                </span>
                <h3
                  id="mFeito"
                  className="font-outfit text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-brand-primary"
                >
                  Recebido!
                </h3>
                <p className="mt-2 font-roboto text-gray-600 leading-relaxed">
                  Um especialista da Stoom vai entrar em contato pelo WhatsApp que você informou.
                </p>
              </div>
            )}

            {/* Sempre montado: esconder em vez de desmontar, senao o HubSpot
                nao reinjeta o form no container (ver efeito de reset acima). */}
            <div className={enviado ? 'hidden' : undefined}>
              <Eyebrow className="mb-3.5">Proposta sem custo</Eyebrow>
              <h3
                id="mTitle"
                className="mb-6 font-outfit text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-brand-primary"
              >
                Fale com um especialista
              </h3>

              <div className="relative min-h-[420px]" onFocus={aoFocarFormulario}>
                <div
                  key={versaoForm}
                  ref={refFormContainer}
                  className="hs-form-html stoom-hs-form-lp"
                  data-region="na1"
                  data-form-id={HUBSPOT.formGuid}
                  data-portal-id={HUBSPOT.portalId}
                />

                {/* Skeleton: cobre o container enquanto o HubSpot ainda nao
                    injetou os campos, pra evitar o "pulo" de o modal abrir so
                    com o titulo e depois expandir de repente. */}
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
                    <div className="flex gap-4">
                      <div className="h-[46px] flex-1 animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-[46px] flex-1 animate-pulse rounded-xl bg-gray-100" />
                    </div>
                    <div className="h-[70px] animate-pulse rounded-xl bg-gray-100" />
                    <div className="h-[52px] animate-pulse rounded-full bg-gray-200" />
                  </div>
                )}
              </div>

              <p className="mt-4 text-center font-roboto text-[13px] text-gray-500">
                Seus dados estão protegidos conforme a LGPD.{' '}
                <a
                  href={POLITICA_PRIVACIDADE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'rounded-sm underline underline-offset-[3px] transition-colors hover:text-brand-primary',
                    focoVisivel
                  )}
                >
                  Política de privacidade
                </a>
              </p>
            </div>
          </m.div>
        </div>,
        document.body
      )}
    </>
  )
}
