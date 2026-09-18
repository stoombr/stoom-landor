'use client';

import { m, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  Puzzle,
  Cpu,
  Settings2,
  Box,
  RefreshCw,
  ChartBar as BarChart3,
} from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const diferenciais = [
  {
    icon: Puzzle,
    title: 'Integração com sistemas',
    desc: 'Possibilidade de integração com sistemas corporativos e plataformas existentes.',
  },
  {
    icon: Cpu,
    title: 'Tecnologia própria',
    desc: 'Desenvolvimento interno de hardware e software.',
  },
  {
    icon: Settings2,
    title: 'Lockers personalizáveis',
    desc: 'Estrutura adaptável à identidade visual do cliente. Possibilidade de compartimentos resfriados, congelados ou químicos.',
  },
  {
    icon: Box,
    title: 'Compartimentos inteligentes',
    desc: 'Diferentes tamanhos para acomodar diversos tipos de encomendas.',
  },
  {
    icon: RefreshCw,
    title: 'Atualizações remotas',
    desc: 'Evolução contínua da plataforma com atualizações de software.',
  },
  {
    icon: BarChart3,
    title: 'Monitoramento operacional',
    desc: 'Controle e visibilidade sobre todas as operações realizadas.',
  },
];

export default function Achievements() {
  const sectionRef = useRef(null);
  const modal = useContactModal();
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section
      id="tecnologia"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-brand-light relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(76, 201, 240, 1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(76, 201, 240, 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 border border-brand-highlight/20 rounded-full mb-6 mx-auto">
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
            <span className="text-brand-primary font-roboto font-medium">Tecnologia</span>
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary leading-tight">
            Tecnologia pensada para <br />
            <span className="text-brand-secondary">operações reais</span>
          </h2>

          <p className="text-gray-600 font-roboto max-w-2xl mx-auto leading-relaxed mt-6">
            Diferenciais que tornam a Stoom a escolha certa para quem busca eficiência logística
            com tecnologia de ponta.
          </p>
        </m.div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-brand-primary/10 rounded-full" />

          <m.div
            style={{ height: lineHeight }}
            className="absolute left-6 top-0 w-[3px] bg-brand-highlight rounded-full shadow-[0_0_18px_rgba(76,201,240,0.45)] origin-top"
          />

          <div className="space-y-6">
            {diferenciais.map((d, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
                className="relative flex items-start gap-6 group"
              >
                <div className="relative z-10 flex-shrink-0">
                  <m.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: i * 0.12 + 0.2, duration: 0.4, type: 'spring' }}
                    whileHover={{ scale: 1.06 }}
                    className="relative w-12 h-12 rounded-full bg-white border border-brand-highlight/20 shadow-[0_10px_24px_rgba(15,40,66,0.08)] flex items-center justify-center"
                  >
                    <d.icon size={20} className="text-brand-primary" />
                    <div className="absolute inset-0 rounded-full ring-4 ring-brand-highlight/10" />
                  </m.div>
                </div>

                <m.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-[0_12px_30px_rgba(15,40,66,0.06)] group-hover:border-brand-highlight/25 group-hover:shadow-[0_18px_40px_rgba(15,40,66,0.09)] transition-all duration-300"
                >
                  <h3 className="text-lg font-outfit font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                    {d.title}
                  </h3>
                  <p className="text-gray-600 font-roboto leading-relaxed text-sm">{d.desc}</p>
                </m.div>
              </m.div>
            ))}
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            type="button"
            onClick={() => modal?.abrirContato()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
          >
            Tenha eficiência logística
          </button>
        </m.div>
      </div>
    </section>
  );
}