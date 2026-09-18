'use client';

import { m, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  CircleCheck as CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useContactModal } from './ContactModalContext';

const product1Features = [
  'Compartimentos inteligentes de diferentes tamanhos',
  'Controle de acesso seguro por QR Code ou código',
  'Parametrização conforme a operação',
  'Integração com sistemas e aplicativos',
];

const product2Features = [
  'Acompanhamento de entregas em tempo real',
  'Histórico de retiradas',
  'Notificações automáticas',
  'Gestão operacional via painel administrativo',
];

function ProductCard({
  icon,
  tag,
  title,
  description,
  features,
  accent,
  image,
  imageAlt,
  delay,
  isInView,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  features: string[];
  accent: 'orange' | 'blue';
  image: string;
  imageAlt: string;
  delay: number;
  isInView: boolean;
}) {
  const accentStyles = {
    orange: {
      tag: 'bg-sky-50 text-sky-600 border-sky-200',
      icon: 'bg-brand-highlight/10 text-brand-highlight',
      check: 'text-brand-highlight',
      border: 'hover:border-brand-highlight/30',
      glow: 'hover:shadow-[0_20px_60px_rgba(76,201,240,0.16)]',
      gradient: 'from-brand-highlight to-cyan-200',
    },
    blue: {
      tag: 'bg-sky-50 text-sky-600 border-sky-200',
      icon: 'bg-brand-highlight/10 text-brand-highlight',
      check: 'text-brand-highlight',
      border: 'hover:border-brand-highlight/30',
      glow: 'hover:shadow-[0_20px_60px_rgba(76,201,240,0.16)]',
      gradient: 'from-brand-highlight to-cyan-200',
    },
  };

  const s = accentStyles[accent];

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className={`group relative h-full rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_10px_30px_rgba(15,40,66,0.06)] transition-all duration-300 ${s.border} ${s.glow}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.icon}`}>
          {icon}
        </div>

        <span
          className={`text-xs font-semibold font-outfit uppercase tracking-wider px-3 py-1.5 rounded-full border ${s.tag}`}
        >
          {tag}
        </span>
      </div>

      <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 494px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/25 via-transparent to-transparent" />
      </div>

      <h3 className="font-outfit font-bold text-2xl text-brand-primary mb-3">{title}</h3>

      <p className="font-roboto text-slate-500 text-sm leading-relaxed mb-6">
        {description}
      </p>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.check}`} />
            <span className="font-roboto text-sm text-slate-600">{feature}</span>
          </li>
        ))}
      </ul>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${s.gradient} transition-opacity duration-300 opacity-0 group-hover:opacity-100`}
      />
    </m.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const modal = useContactModal();
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="solucao" ref={ref} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-highlight/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
            <span className="text-brand-primary font-roboto font-medium">A Solução</span>
            <div className="w-2 h-2 bg-brand-highlight rounded-full" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-outfit font-bold text-brand-primary leading-tight">
            Uma solução completa <br />
            <span className="text-brand-secondary">para gestão de entregas</span>
          </h2>

          <p className="text-gray-600 font-roboto max-w-3xl mx-auto mt-6 leading-relaxed">
            A Stoom combina lockers inteligentes com uma plataforma digital para automatizar o
            recebimento, armazenamento e retirada de encomendas.
          </p>
        </m.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 lg:mb-16">
          <ProductCard
            icon={<Lock className="w-7 h-7" />}
            tag="Hardware"
            title="Smart Lockers"
            description="Armários inteligentes com acesso por QR Code ou código."
            features={product1Features}
            accent="orange"
            image="/smartlocker.webp"
            imageAlt="Smart Lockers"
            delay={0.15}
            isInView={isInView}
          />

          <ProductCard
            icon={<LayoutDashboard className="w-7 h-7" />}
            tag="Software"
            title="Aplicativo"
            description="Gestão completa com visibilidade em tempo real."
            features={product2Features}
            accent="blue"
            image="/app.webp"
            imageAlt="Plataforma"
            delay={0.3}
            isInView={isInView}
          />
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="pt-8 lg:pt-10 flex justify-center"
        >
          <button
            type="button"
            onClick={() => modal?.abrirContato()}
            className="group inline-flex min-h-[60px] items-center justify-center gap-3 rounded-md bg-brand-secondary px-8 py-4 sm:px-10 sm:py-5 text-base font-semibold text-black shadow-lg shadow-brand-secondary/20 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-secondary/90"
          >
            <span className="whitespace-nowrap">Automatize a logística</span>
          </button>
        </m.div>
      </div>
    </section>
  );
}