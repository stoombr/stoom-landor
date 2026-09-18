'use client';

import { m, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  FileSliders as Sliders,
  Box,
  ChartBar as BarChart3,
  LayoutDashboard,
} from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const solutionItems = [
  { icon: Sliders, text: 'Adaptação ao fluxo da operação' },
  { icon: Box, text: 'Estrutura configurável sob medida' },
  { icon: BarChart3, text: 'Acompanhamento em tempo real' },
  { icon: LayoutDashboard, text: 'Controle centralizado da jornada' },
];

export default function Benefits() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const modal = useContactModal();

  const isInView = useInView(contentRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.12, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <section
      id="beneficios"
      ref={sectionRef}
      className="pt-24 lg:pt-32 pb-24 lg:pb-32 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <m.div
            ref={contentRef}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full">
                <div className="w-2 h-2 bg-brand-highlight rounded-full" />
                <span className="text-brand-primary font-roboto font-medium">
                  Solução completa
                </span>
                <div className="w-2 h-2 bg-brand-highlight rounded-full" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary mb-6 leading-tight text-center lg:text-left">
              Tecnologia, controle e adaptação{' '}
              <span className="text-brand-secondary">em uma única solução</span>
            </h2>

            <p className="text-gray-600 font-roboto mb-10 leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0">
              Mais do que lockers, a Stoom entrega uma solução completa para operações
              que exigem inteligência logística, gestão centralizada e uma experiência
              alinhada à realidade de cada negócio.
            </p>

            <div className="space-y-4 max-w-fit mx-auto lg:mx-0 text-left">
              {solutionItems.map((item, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-brand-highlight/10 border border-brand-highlight/10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <item.icon size={18} className="text-brand-highlight" />
                  </div>
                  <span className="text-gray-700 font-roboto">{item.text}</span>
                </m.div>
              ))}
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-10 hidden lg:block"
            >
              <button
                type="button"
                onClick={() => modal?.abrirContato()}
                className="inline-flex min-h-[56px] items-center justify-center rounded-sm bg-brand-secondary px-8 sm:px-10 py-4 text-base font-roboto font-semibold text-black shadow-lg shadow-brand-secondary/20 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-secondary/90"
              >
                <span className="whitespace-nowrap">Solicite uma demonstração</span>
              </button>
            </m.div>
          </m.div>

          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <m.video
                style={{
                  scale: imageScale,
                  y: imageY,
                }}
                src="/solucao-locker.mp4"
                autoPlay
                loop
                muted
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full h-[420px] lg:h-[480px] object-cover"
              />
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-8 flex justify-center lg:hidden"
            >
              <button
                type="button"
                onClick={() => modal?.abrirContato()}
                className="inline-flex min-h-[56px] items-center justify-center rounded-sm bg-brand-secondary px-8 sm:px-10 py-4 text-base font-roboto font-semibold text-black shadow-lg shadow-brand-secondary/20 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-secondary/90"
              >
                <span className="whitespace-nowrap">Solicite uma demonstração</span>
              </button>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}