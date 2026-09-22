/**
 * Tracking da LP /varejo (Smart Locker para redes varejistas).
 *
 * Spin-off de lib/condominio/tracking.ts: mesmo mecanismo, mesmos globais
 * (GTM, GA4, Meta Pixel, HubSpot, LinkedIn ja vivem no app/layout.tsx), so troca
 * o identificador da LP e o nome do campo que no condominio era "unidades" e
 * aqui e "lojas".
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Identificador da LP em todo evento (`lp`). Contrato de analytics: nao mudar. */
export const LP_ID = 'stoom-smart-locker-varejo'

/**
 * Portal e formulario do HubSpot.
 * Reaproveita o mesmo form "Solicite uma demonstracao" do /condominio.
 * CONFIRMAR com a Stoom se querem um form dedicado para leads de varejo.
 */
export const HUBSPOT: { portalId: string; formGuid: string } = {
  portalId: '51547160',
  formGuid: '6c33c565-d83e-41e5-80e7-75e316ad7c36',
}

/**
 * Rotulo de conversao do Google Ads (formato `AW-XXXXXXXXX/abcDEF...`).
 * Vazio = nao dispara. Preenchido na configuracao da campanha, quando a Stoom
 * enviar o rotulo do Google Ads.
 */
export const ADS_SEND_TO: string = ''

/**
 * Id de conversao do LinkedIn Campaign Manager (partner 10718305).
 * Vazio = nao dispara. Preenchido na configuracao da campanha.
 */
export const LINKEDIN_CONVERSION_ID: string = ''

/**
 * Origens validas de CTA (`cta_origem`). Sao os ids das secoes da LP e o id da
 * barra fixa do celular. Contrato de analytics: manter os mesmos ids no JSX.
 */
export type OrigemCta = 'hero' | 'como-funciona' | 'contratacao' | 'proposta' | 'stick'

// ─── Acesso seguro aos globais ────────────────────────────────────────────────

type FnTracking = (...args: unknown[]) => void

type JanelaTracking = Window & {
  dataLayer?: Record<string, unknown>[]
  gtag?: FnTracking
  fbq?: FnTracking
  lintrk?: FnTracking
}

function janela(): JanelaTracking | null {
  if (typeof window === 'undefined') return null
  return window as JanelaTracking
}

function gtagEvento(nome: string, params: Record<string, unknown>): void {
  const w = janela()
  if (!w || typeof w.gtag !== 'function') return
  try {
    w.gtag('event', nome, params)
  } catch {
    /* global ausente ou bloqueado */
  }
}

// ─── Id de evento (deduplicacao Pixel x CAPI) ─────────────────────────────────

let contadorEventos = 0

/**
 * Gera o `event_id` que amarra o evento do Pixel ao do servidor.
 * Usa crypto.randomUUID quando existe (precisa de contexto seguro) e cai para
 * performance.timeOrigin + performance.now + contador de modulo.
 * Nao usa Math.random nem Date.now: nada aqui pode variar entre render do
 * servidor e do cliente.
 */
export function novoEventId(): string {
  const w = janela()
  try {
    if (w && typeof w.crypto !== 'undefined' && typeof w.crypto.randomUUID === 'function') {
      return w.crypto.randomUUID()
    }
  } catch {
    /* randomUUID indisponivel fora de contexto seguro */
  }

  contadorEventos += 1

  let marca = 0
  if (w && w.performance && typeof w.performance.now === 'function') {
    const origem = typeof w.performance.timeOrigin === 'number' ? w.performance.timeOrigin : 0
    marca = Math.round((origem + w.performance.now()) * 1000)
  }

  return 'ev-' + marca.toString(36) + '-' + contadorEventos.toString(36)
}

// ─── dataLayer ────────────────────────────────────────────────────────────────

/** Empurra um evento no dataLayer, sempre carimbando `lp: LP_ID`. */
export function dlPush(evento: string, dados: Record<string, unknown> = {}): void {
  const w = janela()
  if (!w) return
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ ...dados, event: evento, lp: LP_ID })
  } catch {
    /* dataLayer indisponivel */
  }
}

// ─── Eventos da pagina ────────────────────────────────────────────────────────

/**
 * Clique em qualquer CTA que abre o modal.
 * `origem` deve ser o id da secao (ver OrigemCta): hero, como-funciona,
 * contratacao, proposta ou stick.
 */
export function eventoCta(origem: string): void {
  dlPush('lp_cta_click', { cta_origem: origem })
  gtagEvento('lp_cta_click', { cta_origem: origem, lp: LP_ID })
}

/** Primeiro foco dentro do formulario. Dispara uma vez por sessao de pagina. */
export function eventoFormInicio(): void {
  dlPush('lp_form_start')
  gtagEvento('lp_form_start', { lp: LP_ID })
}

/** Primeiro `playing` do video do hero. */
export function eventoVideoPlay(): void {
  dlPush('lp_video_play')
}

/**
 * Conversao: o HubSpot detectou o form injetado sumir do DOM (embed trocou
 * pelo estado de "obrigado" pos-envio, ver components/varejo/LeadModal.tsx).
 * Gera o event_id e empurra em todos os canais.
 */
export function eventoLead(): string {
  const eventId = novoEventId()

  dlPush('lp_lead_submit', { event_id: eventId })

  // Mesmo nome de evento que o form do site principal (components/CTA.tsx) e a
  // LP /condominio ja empurram no sucesso do envio. O acionador "Form Locker
  // Novo Site" no GTM (conversao do Google Ads) escuta esse nome, entao sem
  // isso o lead desta LP nunca contaria na conversao.
  dlPush('lead_form_success', { event_id: eventId })

  gtagEvento('generate_lead', {
    lp: LP_ID,
    form_id: 'smart-locker-varejo',
    event_id: eventId,
    currency: 'BRL',
    value: 0,
  })

  const w = janela()
  if (!w) return eventId

  if (typeof w.fbq === 'function') {
    try {
      w.fbq(
        'track',
        'Lead',
        { content_name: 'Smart Locker Varejo', content_category: 'varejo' },
        { eventID: eventId }
      )
    } catch {
      /* pixel ausente ou bloqueado */
    }
  }

  if (ADS_SEND_TO) {
    gtagEvento('conversion', {
      send_to: ADS_SEND_TO,
      transaction_id: eventId,
      currency: 'BRL',
      value: 0,
    })
  }

  if (LINKEDIN_CONVERSION_ID && typeof w.lintrk === 'function') {
    try {
      w.lintrk('track', { conversion_id: LINKEDIN_CONVERSION_ID })
    } catch {
      /* insight tag ausente */
    }
  }

  return eventId
}

