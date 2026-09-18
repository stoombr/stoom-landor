'use client';

import { m, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Truck,
  LayoutGrid,
  PackagePlus,
  Bell,
  QrCode,
  LockOpen,
  Package,
  CheckCheck,
} from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const flows = {
  abastecimento: [
    {
      icon: Truck,
      step: '01',
      title: 'Chegada do entregador',
      desc: 'Entregador seleciona o destinatário ou operação no painel do locker.',
    },
    {
      icon: LayoutGrid,
      step: '02',
      title: 'Escolha do compartimento',
      desc: 'Seleciona o tamanho do compartimento disponível para o pacote.',
    },
    {
      icon: PackagePlus,
      step: '03',
      title: 'Depósito da encomenda',
      desc: 'Deposita a encomenda ou material. O compartimento é bloqueado automaticamente.',
    },
    {
      icon: Bell,
      step: '04',
      title: 'Notificação automática',
      desc: 'Usuário recebe notificação com QR Code para retirada no e-mail ou app.',
    },
  ],
  retirada: [
    {
      icon: QrCode,
      step: '01',
      title: 'Apresentação do QR Code',
      desc: 'Usuário apresenta o QR Code ou código numérico recebido na notificação.',
    },
    {
      icon: Package,
      step: '02',
      title: 'Identificação do compartimento',
      desc: 'O sistema identifica automaticamente o compartimento com a encomenda.',
    },
    {
      icon: LockOpen,
      step: '03',
      title: 'Abertura automática',
      desc: 'A porta destrava automaticamente com segurança.',
    },
    {
      icon: CheckCheck,
      step: '04',
      title: 'Retirada concluída',
      desc: 'Usuário retira o item e o processo é registrado na plataforma.',
    },
  ],
};

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const modal = useContactModal();
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [tab, setTab] = useState<'abastecimento' | 'retirada'>('abastecimento');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.75], ['0%', '100%']);

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-brand-light relative overflow-hidden"
    >
      <m.div
        style={{ y: bgY }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-highlight/6 rounded-full blur-3xl pointer-events-none"
      />

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76,201,240,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76,201,240,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6"
          >
            <m.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 bg-brand-highlight rounded-full"
            />
            <span className="text-brand-primary font-roboto font-medium">Como Funciona</span>
            <m.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="w-2 h-2 bg-brand-highlight rounded-full"
            />
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
            className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary mb-4 leading-tight"
          >
            Simples para quem entrega.{' '}
            <span className="text-brand-secondary">Rápido para quem recebe.</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-gray-600 font-roboto max-w-2xl mx-auto"
          >
            O processo foi desenhado para ser intuitivo do início ao fim, tanto para o entregador
            quanto para o destinatário.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex bg-white rounded-2xl p-2 gap-2 shadow-sm border border-white/70">
            {(['abastecimento', 'retirada'] as const).map((t) => (
              <m.button
                key={t}
                onClick={() => setTab(t)}
                whileTap={{ scale: 0.96 }}
                className={`px-7 py-3.5 rounded-xl font-roboto font-medium text-sm transition-all duration-300 relative ${
                  tab === t ? 'text-white' : 'text-brand-primary/70 hover:text-brand-primary'
                }`}
              >
                {tab === t && (
                  <m.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-brand-primary rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative z-10">
                  {t === 'abastecimento' ? 'Fluxo de Abastecimento' : 'Fluxo de Retirada'}
                </span>
              </m.button>
            ))}
          </div>
        </m.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-[3px] bg-gray-200 z-0 overflow-hidden rounded-full">
            <m.div
              style={{ width: lineProgress }}
              className="h-full bg-brand-highlight origin-left rounded-full"
            />
          </div>

          <AnimatePresence mode="wait">
            <m.div
              key={tab}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
              {flows[tab].map((step, i) => (
                <m.div
                  key={`${tab}-${i}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <m.div
                      whileHover={{ scale: 1.12, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="w-20 h-20 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg cursor-default"
                    >
                      <step.icon size={28} className="text-white" />
                    </m.div>

                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: i * 0.12 + 0.2,
                        duration: 0.35,
                        type: 'spring',
                        stiffness: 260,
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-brand-secondary rounded-full flex items-center justify-center shadow-md"
                    >
                      <span className="text-brand-primary text-[10px] font-outfit font-bold">
                        {step.step}
                      </span>
                    </m.div>

                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.6, 0], opacity: [0, 0.3, 0] }}
                      transition={{ delay: i * 0.12 + 0.1, duration: 0.7, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-2xl bg-brand-primary pointer-events-none"
                    />
                  </div>

                  <m.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12 + 0.3, duration: 0.4 }}
                    className="font-outfit font-bold text-brand-primary mb-2 text-base"
                  >
                    {step.title}
                  </m.h3>

                  <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12 + 0.4, duration: 0.4 }}
                    className="text-gray-600 font-roboto text-sm leading-relaxed"
                  >
                    {step.desc}
                  </m.p>
                </m.div>
              ))}
            </m.div>
          </AnimatePresence>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <m.button
            type="button"
            onClick={() => modal?.abrirContato()}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20"
          >
            Simplifique sua operação
          </m.button>
        </m.div>
      </div>
    </section>
  );
}