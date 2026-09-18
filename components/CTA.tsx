'use client';

import { m, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useContactModal } from './ContactModalContext';

export default function CTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 0.93, 0.93, 0.85]);

  const modal = useContactModal();

  return (
    <section id="contato" ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      <m.div style={{ y: bgY }} className="absolute -top-[15%] -bottom-[15%] left-0 right-0">
        <img
          src="/stoom-locker.webp"
          alt="Contato Stoom"
          className="w-full h-full object-cover"
        />
        <m.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-brand-primary" />
      </m.div>

      <m.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.13, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-brand-highlight rounded-full blur-3xl pointer-events-none"
      />
      <m.div
        animate={{ x: [0, -60, 0], opacity: [0.04, 0.09, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <m.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/15 border border-brand-highlight/20 rounded-full mb-6"
        >
          <m.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 bg-brand-highlight rounded-full"
          />
          <span className="text-brand-highlight font-roboto font-medium text-sm">
            Fale com a Stoom
          </span>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl lg:text-5xl font-outfit font-bold text-white leading-tight"
        >
          Tenha lockers inteligentes{' '}
          <span className="text-brand-secondary">em sua operação</span>
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28, duration: 0.6 }}
          className="text-white/70 font-roboto text-lg leading-relaxed mt-6"
        >
          Converse com um de nossos especialistas e descubra como implementar smart lockers.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={() => modal?.abrirContato()}
            className="inline-flex items-center px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/25"
          >
            Falar com um especialista
          </button>
        </m.div>
      </div>
    </section>
  );
}
