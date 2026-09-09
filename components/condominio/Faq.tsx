'use client'

// Secao 7 da LP /condominio: perguntas frequentes (`#faq` do original).
//
// Fidelidade visual: lista de linhas finas com filete claro entre os itens,
// nao cartao com borda. Cabecalho centralizado, lista com 820px de largura.
// O original cola esta secao na de contratacao (`padding-top: 0` inline, mesmo
// fundo papel), por isso o `pt-0 lg:pt-0` na casca.
//
// Comportamento: acordeao do repositorio (estado local, Plus/Minus da lucide,
// AnimatePresence na resposta) em vez do <details> nativo do HTML fonte.
// O primeiro item nasce aberto, como no original.

import { m, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Secao, Container, CabecalhoSecao, Destaque, focoVisivel } from './ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

/**
 * Copy aprovada pelo cliente, verbatim do lp-stoom-oficial/index.html.
 * A pergunta 6 nao tem ponto de interrogacao de proposito: e assim no fonte.
 */
const perguntas = [
  {
    pergunta: 'Quanto espaço preciso ter, e onde instala?',
    resposta:
      'O módulo central ocupa uma parede em área comum coberta, com acesso para o entregador sem passar pelas unidades. Hall de entrada, área de encomendas e corredor de serviço são os lugares mais usados. A visita técnica define o ponto.',
  },
  {
    pergunta: 'Precisa de tomada e internet?',
    resposta:
      'Sim, ponto de energia e conexão de internet no local. A instalação e a configuração são feitas pela equipe da Stoom.',
  },
  {
    pergunta: 'Quem faz a manutenção, e em quanto tempo atende?',
    resposta:
      'A manutenção está inclusa no aluguel e é feita por técnico da região, que atende o seu estado. O condomínio não contrata serviço à parte nem compra peça.',
  },
  {
    pergunta: 'E se o morador não retirar a encomenda?',
    resposta:
      'O painel de gestão mostra as encomendas paradas e a plataforma reenvia notificação. A administração define o prazo para acionar o morador.',
  },
  {
    pergunta: 'E se uma encomenda desaparecer?',
    resposta:
      'Cada depósito e cada retirada ficam registrados com data, hora, usuário e foto. É exatamente o que hoje não existe na portaria: prova de quem recebeu e quem retirou.',
  },
  {
    pergunta: 'A câmera e a LGPD',
    resposta:
      'A imagem serve para registrar a operação do compartimento, não para monitorar pessoas, e é tratada conforme a LGPD. A política de privacidade da Stoom está no rodapé desta página.',
  },
  {
    pergunta: 'O morador precisa instalar aplicativo?',
    resposta:
      'Não. A retirada é por código ou QR Code, em qualquer celular, sem baixar nada. É um dos pontos que mais reduz reclamação na implantação.',
  },
  {
    pergunta: 'Tem multa se o condomínio quiser encerrar?',
    resposta:
      'As condições de vigência e encerramento estão no contrato e são apresentadas na proposta, antes de qualquer assinatura.',
  },
] as const

/** Indice que nasce aberto (`<details open>` no primeiro item do fonte). */
const ABERTO_INICIAL = 0

// ─── Secao ────────────────────────────────────────────────────────────────────

export default function Faq() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [aberto, setAberto] = useState<number | null>(ABERTO_INICIAL)

  return (
    // `pt-0` porque a secao encosta na de contratacao, sem costura, igual ao original.
    <Secao id="faq" className="pt-0 lg:pt-0">
      <Container>
        <CabecalhoSecao
          eyebrow="Perguntas frequentes"
          titulo={
            <>
              O que a administração pergunta{' '}
              <Destaque sobreEscuro={false}>antes de aprovar</Destaque>
            </>
          }
          centralizado
        />

        <div ref={ref} className="max-w-[820px] mx-auto">
          {perguntas.map((item, i) => {
            const estaAberto = aberto === i
            const idBotao = `faq-pergunta-${i}`
            const idResposta = `faq-resposta-${i}`

            return (
              <m.div
                key={item.pergunta}
                initial={reduce ? false : { opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.06 }}
                className="border-t border-gray-200 last:border-b"
              >
                <h3>
                  <button
                    type="button"
                    id={idBotao}
                    aria-expanded={estaAberto}
                    aria-controls={idResposta}
                    onClick={() => setAberto(estaAberto ? null : i)}
                    className={cn(
                      'group w-full flex items-center justify-between gap-4 min-h-[44px] py-5 text-left',
                      focoVisivel
                    )}
                  >
                    <span className="font-outfit font-medium text-lg lg:text-[19px] leading-snug text-brand-primary">
                      {item.pergunta}
                    </span>
                    {estaAberto ? (
                      <Minus
                        size={16}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="flex-shrink-0 text-brand-primary transition-colors"
                      />
                    ) : (
                      <Plus
                        size={16}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="flex-shrink-0 text-gray-500 transition-colors group-hover:text-brand-primary"
                      />
                    )}
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {estaAberto ? (
                    <m.div
                      key="resposta"
                      id={idResposta}
                      role="region"
                      aria-labelledby={idBotao}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-roboto text-gray-600 leading-relaxed max-w-[65ch] pb-6 pr-8">
                        {item.resposta}
                      </p>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </m.div>
            )
          })}
        </div>
      </Container>
    </Secao>
  )
}
