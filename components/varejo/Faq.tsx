'use client'

// Secao de perguntas frequentes da LP /varejo. Spin-off de components/condominio/Faq.tsx,
// mesmo acordeao, todas as 8 perguntas reescritas para o contexto de loja/operação.

import { m, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Secao, Container, CabecalhoSecao, Destaque, focoVisivel } from '@/components/condominio/ui'

// ─── Dados ────────────────────────────────────────────────────────────────────

const perguntas = [
  {
    pergunta: 'Quanto espaço preciso ter, e onde instala?',
    resposta:
      'O módulo central ocupa uma parede na área de estoque ou próxima ao caixa, com acesso fácil para a equipe repor os compartimentos. A visita técnica define o ponto exato dentro da loja.',
  },
  {
    pergunta: 'Precisa de tomada e internet?',
    resposta:
      'Sim, ponto de energia e conexão de internet no local. A instalação e a configuração são feitas pela equipe da Stoom.',
  },
  {
    pergunta: 'Quem faz a manutenção, e em quanto tempo atende?',
    resposta:
      'A manutenção está inclusa no aluguel e é feita por técnico da região, que atende o seu estado. A loja não contrata serviço à parte nem compra peça.',
  },
  {
    pergunta: 'E se o cliente não retirar o pedido?',
    resposta:
      'O painel de gestão mostra os pedidos parados e a plataforma reenvia notificação. A operação define o prazo para acionar o cliente ou estornar o pedido.',
  },
  {
    pergunta: 'E se um pedido desaparecer?',
    resposta:
      'Cada depósito e cada retirada ficam registrados com data, hora, usuário e foto. É exatamente o que hoje não existe no balcão: prova de quem separou e quem retirou.',
  },
  {
    pergunta: 'A câmera e a LGPD',
    resposta:
      'A imagem serve para registrar a operação do compartimento, não para monitorar clientes, e é tratada conforme a LGPD. A política de privacidade da Stoom está no rodapé desta página.',
  },
  {
    pergunta: 'O cliente precisa instalar aplicativo?',
    resposta:
      'Não. A retirada é por código ou QR Code, em qualquer celular, sem baixar nada. É um dos pontos que mais reduz reclamação na implantação.',
  },
  {
    pergunta: 'Tem multa se a rede quiser encerrar?',
    resposta:
      'As condições de vigência e encerramento estão no contrato e são apresentadas na proposta, antes de qualquer assinatura.',
  },
] as const

const ABERTO_INICIAL = null

// ─── Secao ────────────────────────────────────────────────────────────────────

export default function Faq() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [aberto, setAberto] = useState<number | null>(ABERTO_INICIAL)

  return (
    <Secao id="faq" className="pt-0 lg:pt-0">
      <Container>
        <CabecalhoSecao
          eyebrow="Perguntas frequentes"
          titulo={
            <>
              Saiba <Destaque sobreEscuro={false}>antes de aprovar</Destaque>
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
