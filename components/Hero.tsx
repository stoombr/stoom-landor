'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Package, Smartphone, ChartBar as BarChart2 } from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const itemTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export default function Hero() {
  const sectionRef = useRef(null);
  const modal = useContactModal();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-primary"
    >
      <m.div style={{ y: bgY }} className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/stoom-hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/75 via-[#0d2038]/70 to-brand-primary/65" />
      </m.div>

      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(76, 201, 240, 1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(76, 201, 240, 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <m.div
        style={{ y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-outfit font-bold text-white leading-[1.05] tracking-tight text-center lg:text-left">
              Entregas inteligentes{' '}
              <span className="relative inline-block">
                <span className="text-brand-highlight">começam aqui</span>
                <m.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-highlight origin-left rounded-full"
                />
              </span>
            </h1>

            <p className="text-xl text-white/80 font-roboto leading-relaxed max-w-lg text-center lg:text-left mx-auto lg:mx-0">
              Lockers conectados a uma plataforma completa para automatizar
              entregas, retiradas e gestão logística.
            </p>

            <m.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...itemTransition, delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                type="button"
                onClick={() => modal?.abrirContato()}
                className="group px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] flex items-center justify-center gap-2 shadow-lg shadow-brand-secondary/30"
              >
                Solicite uma demonstração
              </button>
            </m.div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-95 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.22),transparent_55%)]" />

              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 bg-white/10 rounded-md h-5 mx-4" />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Package,
                      label: 'Encomenda recebida',
                      sub: 'Locker A-03 · Há 2 min',
                      color: 'bg-brand-highlight/20 text-brand-highlight',
                      status: 'Novo',
                    },
                    {
                      icon: Smartphone,
                      label: 'Retirada via QR Code',
                      sub: 'Locker B-07 · Há 15 min',
                      color: 'bg-brand-secondary/20 text-brand-secondary',
                      status: 'Retirado',
                    },
                    {
                      icon: BarChart2,
                      label: 'Relatório gerado',
                      sub: 'Plataforma · Há 1h',
                      color: 'bg-green-400/20 text-green-400',
                      status: 'Exportado',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-default"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}
                      >
                        <item.icon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-roboto font-medium truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-white/50 font-roboto">{item.sub}</p>
                      </div>

                      <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-md font-roboto flex-shrink-0">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Entregas hoje', value: '124' },
                    { label: 'Taxa de sucesso', value: '99%' },
                    { label: 'Lockers livres', value: '38' },
                  ].map((metric, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl font-outfit font-bold text-white">{metric.value}</div>
                      <div className="text-[10px] text-white/50 font-roboto mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center"
      >
        <m.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/40 rounded-full" />
        </m.div>
      </m.div>
    </section>
  );
}