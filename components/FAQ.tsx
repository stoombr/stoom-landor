'use client';

import { m, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const faqs = [
  {
    q: 'O que é um smart locker?',
    a: 'Um smart locker é um armário inteligente com compartimentos que podem ser abertos e fechados remotamente. Ele permite que encomendas sejam depositadas e retiradas de forma autônoma, sem a necessidade de um funcionário presente.',
  },
  {
    q: 'Como funcionam os armários inteligentes?',
    a: 'O entregador acessa o locker, seleciona o destinatário e deposita a encomenda. O sistema registra a operação e envia automaticamente uma notificação com QR Code para o destinatário. Na retirada, basta apresentar o QR Code ou código numérico para abrir o compartimento.',
  },
  {
    q: 'Smart lockers podem ser usados em condomínios?',
    a: 'Sim, os lockers Stoom são ideais para condomínios residenciais e comerciais. Eles eliminam o problema de encomendas acumuladas na portaria, oferecem disponibilidade 24/7 e enviam notificações automáticas para os moradores.',
  },
  {
    q: 'Empresas podem usar lockers para logística?',
    a: 'Com certeza. Os lockers Stoom atendem empresas de todos os portes para controle de distribuição de equipamentos, materiais e encomendas internas. É possível configurar fluxos de acesso por setor, equipe ou hierarquia.',
  },
  {
    q: 'Smart lockers podem ser utilizados como guarda-volumes?',
    a: 'Sim, eles são ideias para guardar objetos com segurança, praticidade e com possibilidade de retirada a qualquer momento',
  },
  {
    q: 'É possível integrar lockers com sistemas existentes?',
    a: 'Sim. A Stoom oferece integração via API com sistemas corporativos, ERPs, plataformas de e-commerce e sistemas de gestão condominial. Nossa equipe técnica acompanha todo o processo de integração.',
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const modal = useContactModal();
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <m.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:sticky lg:top-32 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full">
                <div className="w-2 h-2 bg-brand-highlight rounded-full" />
                <span className="text-brand-primary font-roboto font-medium">FAQ</span>
                <div className="w-2 h-2 bg-brand-highlight rounded-full" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary leading-tight mb-6">
              Perguntas <br />
              <span className="text-brand-secondary">frequentes</span>
            </h2>

            <p className="text-gray-600 font-roboto leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Tire suas dúvidas sobre os smart lockers Stoom e descubra como a solução pode
              transformar sua operação.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
            className="space-y-2"
          >
            {faqs.map((faq, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-light transition-colors group"
                >
                  <span
                    className={`font-outfit font-semibold pr-4 transition-colors ${
                      open === i
                        ? 'text-brand-primary'
                        : 'text-brand-primary/80 group-hover:text-brand-primary'
                    }`}
                  >
                    {faq.q}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      open === i
                        ? 'bg-brand-secondary text-black'
                        : 'bg-brand-light text-brand-primary'
                    }`}
                  >
                    {open === i ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 font-roboto leading-relaxed text-sm">
                        {faq.a}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            ))}
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-12 lg:mt-16 flex justify-center"
        >
          <button
            type="button"
            onClick={() => modal?.abrirContato()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
          >
            Implemente os lockers
          </button>
        </m.div>
      </div>
    </section>
  );
}