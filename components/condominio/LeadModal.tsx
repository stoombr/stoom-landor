'use client'

// Modal de conversao da LP /condominio: o unico caminho de lead da pagina.
// Todos os CTAs (hero, como-funciona, contratacao, proposta e a barra fixa do celular)
// abrem este mesmo modal. O pai controla `aberto` e dispara o eventoCta com a origem;
// aqui dentro so acontece formulario, validacao, envio e os eventos do funil.
//
// Portado de lp-stoom-oficial/index.html (#modal + IIFE de conversao).
// A maquina de estado da validacao e identica a do original:
//   - erro so aparece depois do primeiro blur COM edicao, ou depois de um submit barrado
//   - a partir do momento em que o campo esta marcado, ele revalida a cada tecla
//   - o erro geral some quando nao sobra nenhum campo marcado
//   - e-mail gratuito (gmail, hotmail) e ACEITO de proposito: sindico responde do pessoal
//   - sucesso e falha de rede mostram a mesma tela "Recebido!" (o original faz .then(show, show))
//
// Tracking: este arquivo nao carrega script nenhum. GTM, GA4, Pixel, HubSpot e LinkedIn
// ja vivem no app/layout.tsx; aqui so chamamos lib/condominio/tracking.ts.

import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, Check, ChevronDown, X } from 'lucide-react'
import { BotaoCta, Eyebrow, focoVisivel } from './ui'
import {
  enviarHubspot,
  eventoFormErro,
  eventoFormInicio,
  eventoLead,
  type DadosLead,
} from '@/lib/condominio/tracking'
import { cn } from '@/lib/utils'

// ─── Dados ────────────────────────────────────────────────────────────────────

type NomeCampo = keyof DadosLead
type NomeCampoTexto = Exclude<NomeCampo, 'unidades'>

type DefinicaoCampo = {
  nome: NomeCampoTexto
  /** Ids do original. Sao referencia de label, de aria-describedby e de seletor no GTM. */
  id: string
  idErro: string
  rotulo: string
  tipo: 'text' | 'tel' | 'email'
  autoComplete: string
  placeholder: string
  inputMode?: 'tel'
}

const CAMPOS_TEXTO: readonly DefinicaoCampo[] = [
  {
    nome: 'firstname',
    id: 'f-nome',
    idErro: 'e-nome',
    rotulo: 'Nome',
    tipo: 'text',
    autoComplete: 'given-name',
    placeholder: 'Seu nome',
  },
  {
    nome: 'phone',
    id: 'f-fone',
    idErro: 'e-fone',
    rotulo: 'WhatsApp',
    tipo: 'tel',
    autoComplete: 'tel',
    placeholder: '(11) 99999-9999',
    inputMode: 'tel',
  },
  {
    nome: 'email',
    id: 'f-mail',
    idErro: 'e-mail',
    rotulo: 'E-mail',
    tipo: 'email',
    autoComplete: 'email',
    placeholder: 'voce@exemplo.com',
  },
  {
    nome: 'company',
    id: 'f-cond',
    idErro: 'e-cond',
    rotulo: 'Condomínio',
    tipo: 'text',
    autoComplete: 'organization',
    placeholder: 'Nome do condomínio',
  },
]

const CAMPO_UNIDADES = {
  nome: 'unidades' as const,
  id: 'f-un',
  idErro: 'e-un',
  rotulo: 'Número de unidades',
}

/** Primeira opcao tem value vazio; nas demais o valor enviado e o proprio texto. */
const OPCOES_UNIDADES: readonly { valor: string; rotulo: string }[] = [
  { valor: '', rotulo: 'Selecione' },
  { valor: 'Até 50', rotulo: 'Até 50' },
  { valor: '51 a 100', rotulo: '51 a 100' },
  { valor: '101 a 200', rotulo: '101 a 200' },
  { valor: '201 a 400', rotulo: '201 a 400' },
  { valor: 'Mais de 400', rotulo: 'Mais de 400' },
]

/** Ordem de validacao e de foco no submit. E a mesma ordem visual do formulario. */
const ORDEM: readonly NomeCampo[] = ['firstname', 'phone', 'email', 'company', 'unidades']

type Regra = { valido: (valor: string) => boolean; mensagem: string }

const REGRAS: Record<NomeCampo, Regra> = {
  firstname: {
    valido: (v) => v.trim().length > 0,
    mensagem: 'Digite seu nome.',
  },
  phone: {
    valido: (v) => {
      const d = v.replace(/\D/g, '')
      return d.length === 10 || d.length === 11
    },
    mensagem: 'WhatsApp com DDD, 10 ou 11 números.',
  },
  email: {
    // Proposital: so checa forma. Nada de bloquear dominio gratuito.
    valido: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
    mensagem: 'E-mail no formato nome@dominio.com.br.',
  },
  company: {
    valido: (v) => v.trim().length > 0,
    mensagem: 'Diga o nome do condomínio.',
  },
  unidades: {
    valido: (v) => v !== '',
    mensagem: 'Escolha uma faixa de unidades.',
  },
}

const ERRO_GERAL = 'Confere os campos destacados para a gente conseguir te chamar.'

const POLITICA_PRIVACIDADE = 'https://www.stoom.com.br/institucional/politica-de-privacidade'

const VALORES_VAZIOS: DadosLead = {
  firstname: '',
  phone: '',
  email: '',
  company: '',
  unidades: '',
}

type MapaErros = Partial<Record<NomeCampo, string>>

// ─── Estilo dos controles ─────────────────────────────────────────────────────

const CLASSES_CAMPO =
  'w-full min-h-[46px] rounded-xl border bg-white px-3.5 py-3 font-roboto text-[15px] text-brand-primary placeholder:text-gray-500 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-[3px]'

function classesCampo(temErro: boolean) {
  return cn(
    CLASSES_CAMPO,
    temErro
      ? 'border-destructive ring-[3px] ring-destructive/20 focus:border-destructive focus:ring-destructive/20'
      : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/10'
  )
}

// ─── Primitivos locais ────────────────────────────────────────────────────────

/**
 * Mensagem de erro do campo. Fica sempre no DOM (o aria-describedby aponta para ela)
 * e some por display quando nao ha mensagem, igual ao `.ferr` do original.
 * O icone e a redundancia nao cromatica do erro, para quem nao distingue a cor.
 */
function MensagemErro({ id, mensagem }: { id: string; mensagem?: string }) {
  return (
    <small
      id={id}
      aria-live="polite"
      className={cn(
        'font-roboto text-[13px] font-medium text-destructive',
        mensagem ? 'flex items-start gap-1.5' : 'hidden'
      )}
    >
      {mensagem ? (
        <>
          <AlertCircle size={14} strokeWidth={2.2} aria-hidden="true" className="mt-[2px] flex-shrink-0" />
          <span>{mensagem}</span>
        </>
      ) : null}
    </small>
  )
}

type PropsCampoTexto = {
  campo: DefinicaoCampo
  valor: string
  erro?: string
  aoDigitar: (nome: NomeCampo, valor: string) => void
  aoSair: (nome: NomeCampo) => void
  registrar: (nome: NomeCampo, el: HTMLInputElement | HTMLSelectElement | null) => void
}

function CampoTexto({ campo, valor, erro, aoDigitar, aoSair, registrar }: PropsCampoTexto) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={campo.id} className="font-roboto text-[13px] text-gray-500">
        {campo.rotulo}
      </label>
      <input
        ref={(el) => {
          registrar(campo.nome, el)
        }}
        id={campo.id}
        name={campo.nome}
        type={campo.tipo}
        value={valor}
        required
        autoComplete={campo.autoComplete}
        inputMode={campo.inputMode}
        placeholder={campo.placeholder}
        aria-describedby={campo.idErro}
        aria-invalid={Boolean(erro)}
        onChange={(e) => aoDigitar(campo.nome, e.target.value)}
        onBlur={() => aoSair(campo.nome)}
        className={classesCampo(Boolean(erro))}
      />
      <MensagemErro id={campo.idErro} mensagem={erro} />
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export type LeadModalProps = {
  aberto: boolean
  aoFechar: () => void
}

export default function LeadModal({ aberto, aoFechar }: LeadModalProps) {
  const reduzir = useReducedMotion()

  const [montado, setMontado] = useState(false)
  const [valores, setValores] = useState<DadosLead>(VALORES_VAZIOS)
  const [erros, setErros] = useState<MapaErros>({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  // Sem isto o modal fica preso na tela "Recebido!": quem envia, fecha e clica
  // em outro CTA reabre no estado de sucesso, nunca no formulario. O atraso
  // deixa a animacao de saida terminar antes de o formulario reaparecer.
  useEffect(() => {
    if (aberto) return
    const id = window.setTimeout(() => {
      setEnviado(false)
      setEnviando(false)
      setValores(VALORES_VAZIOS)
      setErros({})
      setErroGeral('')
    }, 300)
    return () => window.clearTimeout(id)
  }, [aberto])

  const refModal = useRef<HTMLDivElement>(null)
  const refConcluido = useRef<HTMLDivElement>(null)
  const refCampos = useRef<Partial<Record<NomeCampo, HTMLInputElement | HTMLSelectElement | null>>>({})
  /** Campo ja editado alguma vez. Enquanto false, o blur nao acusa erro. */
  const refSujos = useRef<Partial<Record<NomeCampo, boolean>>>({})
  /** lp_form_start dispara uma vez por carregamento de pagina, nao por abertura. */
  const refFormIniciado = useRef(false)
  const refFecharAtual = useRef(aoFechar)

  useEffect(() => {
    refFecharAtual.current = aoFechar
  })

  useEffect(() => {
    setMontado(true)
  }, [])

  const registrar = useCallback(
    (nome: NomeCampo, el: HTMLInputElement | HTMLSelectElement | null) => {
      refCampos.current[nome] = el
    },
    []
  )

  // ── Validacao ───────────────────────────────────────────────────────────────

  /**
   * Digitou (ou trocou o select). Marca o campo como editado e, se ele JA estiver
   * acusando erro, revalida na hora. Campo ainda limpo nao ganha erro por digitacao.
   */
  const aoDigitar = useCallback(
    (nome: NomeCampo, valor: string) => {
      setValores((atuais) => ({ ...atuais, [nome]: valor }))
      refSujos.current[nome] = true

      let restantes = erros
      if (erros[nome]) {
        const proximos: MapaErros = { ...erros }
        if (REGRAS[nome].valido(valor)) delete proximos[nome]
        else proximos[nome] = REGRAS[nome].mensagem
        setErros(proximos)
        restantes = proximos
      }
      if (Object.keys(restantes).length === 0) setErroGeral('')
    },
    [erros]
  )

  /** Saiu do campo. So acusa erro se o campo tiver sido editado antes. */
  const aoSair = useCallback(
    (nome: NomeCampo) => {
      if (!refSujos.current[nome]) return
      const valor = valores[nome]
      setErros((atuais) => {
        const proximos: MapaErros = { ...atuais }
        if (REGRAS[nome].valido(valor)) delete proximos[nome]
        else proximos[nome] = REGRAS[nome].mensagem
        return proximos
      })
    },
    [valores]
  )

  const aoFocarFormulario = useCallback(() => {
    if (refFormIniciado.current) return
    refFormIniciado.current = true
    eventoFormInicio()
  }, [])

  const aoEnviar = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const proximos: MapaErros = {}
      const invalidos: NomeCampo[] = []
      ORDEM.forEach((nome) => {
        if (!REGRAS[nome].valido(valores[nome])) {
          proximos[nome] = REGRAS[nome].mensagem
          invalidos.push(nome)
        }
      })
      setErros(proximos)

      if (invalidos.length > 0) {
        setErroGeral(ERRO_GERAL)
        eventoFormErro(invalidos)
        const alvo = refCampos.current[invalidos[0]]
        if (alvo) alvo.focus()
        return
      }

      setErroGeral('')
      setEnviando(true)

      const dados: DadosLead = {
        firstname: valores.firstname.trim(),
        phone: valores.phone.trim(),
        email: valores.email.trim(),
        company: valores.company.trim(),
        unidades: valores.unidades,
      }

      const eventId = eventoLead({ unidades: dados.unidades })
      const mostrarSucesso = () => setEnviado(true)
      // Falha de rede tambem mostra sucesso: o lead ja foi contabilizado no funil
      // e nao adianta pedir para o sindico tentar de novo.
      enviarHubspot(dados, eventId).then(mostrarSucesso, mostrarSucesso)
    },
    [valores]
  )

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
      const primeiro = refCampos.current[ORDEM[0]]
      if (primeiro) primeiro.focus()
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

  // ── Escape e ciclo de foco no Tab ───────────────────────────────────────────

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

  return createPortal(
    <AnimatePresence>
      {aberto ? (
        <m.div
          key="lead-modal"
          ref={refModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby={enviado ? 'mFeito' : 'mTitle'}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* veu */}
          <m.div
            aria-hidden="true"
            onClick={aoFechar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: duracaoEntrada, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: duracaoSaida, ease: 'easeOut' } }}
            className="absolute inset-0 bg-brand-ink/70 backdrop-blur-[10px]"
          />

          {/* cartao */}
          <m.div
            initial={reduzir ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: duracaoEntrada, ease: 'easeOut' },
            }}
            exit={{
              opacity: 0,
              y: reduzir ? 0 : 8,
              scale: reduzir ? 1 : 0.98,
              transition: { duration: duracaoSaida, ease: 'easeOut' },
            }}
            className="relative w-full max-w-[520px] max-h-[calc(100dvh_-_32px)] overflow-auto rounded-2xl bg-white px-5 py-6 text-brand-primary shadow-[0_30px_80px_rgb(0_0_0/0.45)] sm:p-8"
          >
            <button
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
            ) : (
              <div>
                <Eyebrow className="mb-3.5">Proposta sem custo</Eyebrow>
                <h3
                  id="mTitle"
                  className="font-outfit text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-brand-primary"
                >
                  Receba uma proposta para o seu condomínio
                </h3>
                <p className="mb-6 mt-2.5 font-roboto text-gray-600 leading-relaxed">
                  Preencha e um especialista da Stoom entra em contato para entender a operação e
                  enviar os valores.
                </p>

                {/* hs-do-not-collect impede a coleta automatica do HubSpot: quem manda o
                    lead e a Forms API em lib/condominio/tracking.ts, com os campos certos. */}
                <form
                  id="lead"
                  noValidate
                  onSubmit={aoEnviar}
                  onFocus={aoFocarFormulario}
                  className="hs-do-not-collect grid gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CAMPOS_TEXTO.slice(0, 2).map((campo) => (
                      <CampoTexto
                        key={campo.nome}
                        campo={campo}
                        valor={valores[campo.nome]}
                        erro={erros[campo.nome]}
                        aoDigitar={aoDigitar}
                        aoSair={aoSair}
                        registrar={registrar}
                      />
                    ))}
                  </div>

                  {CAMPOS_TEXTO.slice(2).map((campo) => (
                    <CampoTexto
                      key={campo.nome}
                      campo={campo}
                      valor={valores[campo.nome]}
                      erro={erros[campo.nome]}
                      aoDigitar={aoDigitar}
                      aoSair={aoSair}
                      registrar={registrar}
                    />
                  ))}

                  <div className="grid gap-1.5">
                    <label htmlFor={CAMPO_UNIDADES.id} className="font-roboto text-[13px] text-gray-500">
                      {CAMPO_UNIDADES.rotulo}
                    </label>
                    <span className="relative block">
                      <select
                        ref={(el) => {
                          registrar(CAMPO_UNIDADES.nome, el)
                        }}
                        id={CAMPO_UNIDADES.id}
                        name={CAMPO_UNIDADES.nome}
                        value={valores.unidades}
                        required
                        aria-describedby={CAMPO_UNIDADES.idErro}
                        aria-invalid={Boolean(erros.unidades)}
                        onChange={(e) => aoDigitar(CAMPO_UNIDADES.nome, e.target.value)}
                        onBlur={() => aoSair(CAMPO_UNIDADES.nome)}
                        className={cn(classesCampo(Boolean(erros.unidades)), 'appearance-none pr-10')}
                      >
                        {OPCOES_UNIDADES.map((opcao) => (
                          <option key={opcao.rotulo} value={opcao.valor}>
                            {opcao.rotulo}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-primary"
                      />
                    </span>
                    <MensagemErro id={CAMPO_UNIDADES.idErro} mensagem={erros.unidades} />
                  </div>

                  <p
                    id="err"
                    role="alert"
                    className="min-h-[1.4em] font-roboto text-sm font-medium text-destructive"
                  >
                    {erroGeral}
                  </p>

                  <BotaoCta type="submit" disabled={enviando} className="w-full">
                    {enviando ? 'Enviando...' : 'Quero uma proposta'}
                  </BotaoCta>

                  <p className="text-center font-roboto text-[13px] text-gray-500">
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
                </form>
              </div>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
