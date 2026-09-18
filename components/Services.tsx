'use client';

import { m, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  ShoppingCart,
  Building2,
  Factory,
  Truck,
  CircleCheck as CheckCircle2,
} from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const segments = [
  {
    id: 0,
    icon: ShoppingCart,
    label: 'Grandes Varejistas',
    title: 'Grandes varejistas',
    description:
      'Redes varejistas que buscam eficiência na última milha, redução de custos logísticos e novas formas de retirada de pedidos.',
    highlights: [
      'Pontos de retirada estratégicos',
      'Redução de tentativas de entrega',
      'Rastreio em tempo real',
      'Integração com plataformas de e-commerce',
    ],
    image: '/varejo-locker.webp',
  },
  {
    id: 1,
    icon: Building2,
    label: 'Condomínios',
    title: 'Condomínios residenciais',
    description:
      'Gestão condominial focada em conveniência, segurança e organização de entregas para moradores com rotinas cada vez mais dinâmicas.',
    highlights: [
      'Sem filas na portaria',
      'Notificação automática ao morador',
      'Retirada via QR Code ou código',
      'Histórico completo de operações',
      'Autonomia para retiradas, independente do horário',
    ],
    image: '/condominio-locker.webp',
  },
  {
    id: 2,
    icon: Factory,
    label: 'Indústrias',
    title: 'Indústrias',
    description:
      'Empresas que precisam controlar distribuição de equipamentos, peças ou materiais entre equipes com rastreabilidade e organização.',
    highlights: [
      'Controle automatizado da distribuição de materiais',
      'Rastreabilidade por usuário e setor',
      'Gestão centralizada de acesso',
      'Relatórios de uso detalhados',
    ],
    image: '/industria-locker.webp',
  },
  {
    id: 3,
    icon: Truck,
    label: 'Operações Logísticas',
    title: 'Operações logísticas',
    description:
      'Transportadoras e operadores logísticos que buscam automatizar pontos de entrega e coleta com tecnologia escalável.',
    highlights: [
      'Coleta automatizada',
      'Distribuição inteligente',
      'Automação de processos logísticos',
      'Locker como ponto de estoque avançado',
    ],
    image: '/logistica-locker.webp',
  },
];

export default function Services() {
  const ref = useRef(null);
  const modal = useContactModal();
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [active, setActive] = useState(0);

  return (
    <section
      id="segmentos"
      ref={ref}
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-highlight/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6 mx-auto">
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
            <span className="text-brand-primary font-roboto font-medium">Segmentos</span>
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary leading-tight">
            Uma solução para <br />
            <span className="text-brand-secondary">diferentes operações</span>
          </h2>

          <p className="text-gray-600 font-roboto max-w-2xl mx-auto mt-6 leading-relaxed">
            Nossos lockers inteligentes atendem diversos segmentos com necessidades específicas de
            logística e distribuição.
          </p>
        </m.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-2"
          >
            {segments.map((seg, i) => (
              <div
                key={seg.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`w-full text-left transition-all duration-300 rounded-xl overflow-hidden group cursor-pointer ${
                  active === i ? 'bg-white shadow-lg' : 'bg-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-5 p-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      active === i
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-primary/10 text-brand-primary'
                    }`}
                  >
                    <seg.icon size={22} />
                  </div>

                  <div className="flex-1">
                    <div
                      className={`font-outfit font-bold text-lg mb-1 ${
                        active === i ? 'text-brand-primary' : 'text-brand-primary/70'
                      }`}
                    >
                      {seg.title}
                    </div>

                    <m.div
                      initial={false}
                      animate={{
                        height: active === i ? 'auto' : 0,
                        opacity: active === i ? 1 : 0,
                      }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 font-roboto text-sm leading-relaxed pt-1 pb-3">
                        {seg.description}
                      </p>

                      <ul className="space-y-2">
                        {seg.highlights.map((h, hi) => (
                          <li
                            key={hi}
                            className="flex items-center gap-2 text-sm text-brand-primary/80"
                          >
                            <CheckCircle2 size={15} className="text-brand-highlight" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </m.div>
                  </div>
                </div>
              </div>
            ))}
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
          >
            {segments.map((seg, i) => (
              <m.img
                key={seg.id}
                src={seg.image}
                alt={seg.title}
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  {(() => {
                    const Icon = segments[active].icon;
                    return <Icon size={18} className="text-white" />;
                  })()}
                </div>
                <span className="text-white font-outfit font-bold text-xl">
                  {segments[active].label}
                </span>
              </div>
            </div>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-16 lg:mt-20 flex justify-center"
        >
          <button
            type="button"
            onClick={() => modal?.abrirContato()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
          >
            Veja as aplicações
          </button>
        </m.div>
      </div>
    </section>
  );
}