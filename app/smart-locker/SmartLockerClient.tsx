'use client'

import { m, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  PackageX,
  RefreshCw,
  Clock,
  TrendingUp,
  QrCode,
  Bell,
  ShieldCheck,
  BarChart3,
  Repeat2,
  Building2,
  Boxes,
  Wrench,
  Award,
  CheckCircle2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import { ContactModalProvider, useContactModal } from '@/components/ContactModalContext'

// ─── Dados ────────────────────────────────────────────────────────────────────

const dores = [
  {
    icon: AlertTriangle,
    titulo: 'Portaria sobrecarregada',
    descricao: 'Funcionários param o que estão fazendo para receber, registrar e guardar encomendas — múltiplas vezes por dia.',
  },
  {
    icon: PackageX,
    titulo: 'Pacotes perdidos ou avariados',
    descricao: 'Sem registro no momento da entrega, fica impossível rastrear onde o problema ocorreu — e quem é o responsável.',
  },
  {
    icon: RefreshCw,
    titulo: 'Múltiplas tentativas de entrega',
    descricao: 'Cada tentativa frustrada gera novo transporte, novo manuseio e novo custo. O problema se repete até alguém estar disponível.',
  },
  {
    icon: Clock,
    titulo: 'Dependência de horário e presença',
    descricao: 'O destinatário precisa estar disponível num horário que a transportadora define. Na prática, isso raramente acontece.',
  },
  {
    icon: TrendingUp,
    titulo: 'Custos logísticos crescentes',
    descricao: 'Reentregas, devoluções ao CD e processos manuais inflam o custo da última milha sem agregar valor para ninguém.',
  },
]

const etapas = [
  {
    numero: '01',
    titulo: 'Entregador deposita',
    descricao: 'O entregador utiliza QR Code para abrir o compartimento correto e deposita o pacote. O processo leva segundos e não depende de nenhum funcionário.',
  },
  {
    numero: '02',
    titulo: 'Destinatário é notificado',
    descricao: 'Assim que o pacote é depositado, o destinatário recebe notificação automática com o código de retirada — via WhatsApp ou e-mail.',
  },
  {
    numero: '03',
    titulo: 'Retirada quando quiser',
    descricao: 'Com o código ou QR Code em mãos, o destinatário retira a encomenda quando quiser — 24 horas por dia, 7 dias por semana.',
  },
]

const beneficios = [
  { icon: Clock,       titulo: 'Disponível 24/7',              descricao: 'Entregas e retiradas a qualquer hora, sem depender de funcionários ou horário comercial.' },
  { icon: ShieldCheck, titulo: 'Segurança total',              descricao: 'Câmera embutida, acesso controlado por QR Code e histórico completo de cada operação.' },
  { icon: BarChart3,   titulo: 'Rastreabilidade completa',     descricao: 'Cada depósito e retirada é registrado com timestamp, usuário e foto — dados acessíveis em tempo real.' },
  { icon: RefreshCw,   titulo: 'Zero reentregas',              descricao: 'A entrega acontece na primeira tentativa. O locker elimina a causa raiz das reentregas.' },
  { icon: Repeat2,     titulo: 'Logística reversa integrada',  descricao: 'O destinatário devolve pelo mesmo locker. Coleta agendada, sem atrito e sem contato.' },
  { icon: Building2,   titulo: 'Portaria desafogada',          descricao: 'Funcionários deixam de gerenciar encomendas e voltam a fazer o que realmente importa.' },
  { icon: Boxes,       titulo: 'Compartimentos modulares',     descricao: '3 tamanhos de compartimento (P, M, G) para acomodar desde documentos até itens de grande porte.' },
  { icon: Bell,        titulo: 'Notificação automática',       descricao: 'Comunicação automática com o destinatário no momento do depósito, sem intervenção manual.' },
]

const diferenciais = [
  { icon: Award,      titulo: 'Homologado pelos Correios',         descricao: 'Dimensões dos compartimentos certificadas para compatibilidade com o sistema dos Correios.' },
  { icon: QrCode,     titulo: 'Acesso por QR Code ou código',      descricao: 'Abertura simples e segura, sem app adicional. Funciona em qualquer smartphone.' },
  { icon: Wrench,     titulo: 'Integração com sistemas existentes', descricao: 'Compatível com ERPs, sistemas de portaria remota e plataformas de e-commerce.' },
  { icon: CheckCircle2, titulo: 'Implantação assistida',           descricao: 'A Stoom acompanha todo o processo de instalação, configuração e treinamento da equipe.' },
  { icon: BarChart3,  titulo: 'Dashboard de gestão',               descricao: 'Painel com visão completa das operações: ocupação, histórico, alertas e relatórios.' },
  { icon: Building2,  titulo: 'Personalização de marca',           descricao: 'Cores, adesivação e identidade visual configuráveis para refletir a sua marca.' },
]

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function SectionWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </m.div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6">
      <div className="w-2 h-2 bg-brand-highlight rounded-full" />
      <span className="text-brand-primary font-roboto font-medium text-sm">{label}</span>
      <div className="w-2 h-2 bg-brand-highlight rounded-full" />
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function SmartLockerClient() {
  return (
    <ContactModalProvider>
      <SmartLockerContent />
    </ContactModalProvider>
  )
}

function SmartLockerContent() {
  const modal = useContactModal()

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-primary pt-40 pb-28 overflow-hidden">
        <img
          src="/smartlocker.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-highlight rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="font-outfit text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Smart Locker:{' '}
              <span className="text-brand-secondary">automatize entregas e retiradas</span>{' '}
              com segurança total
            </h1>
            <p className="font-roboto text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              Do depósito à retirada, tudo rastreado, protegido e disponível 24 horas por dia. Sem filas, sem reentregas, sem dependência de funcionários.
            </p>
            <button
              type="button"
              onClick={() => modal?.abrirContato()}
              className="inline-flex items-center px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/25"
            >
              Quero um smart locker
            </button>
          </m.div>
        </div>
      </section>

      {/* ── Problema / Dor ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="O Problema" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              A entrega ainda é um problema{' '}
              <span className="text-brand-secondary">não resolvido</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              A última milha concentra os maiores custos e a maior insatisfação da cadeia logística. O modelo atual de entrega foi feito para uma rotina que ninguém mais tem.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-6 mb-4">
            {dores.slice(0, 3).map((dor, i) => (
              <m.div
                key={dor.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-red-50 border border-red-100 rounded-xl p-6"
              >
                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <dor.icon size={20} className="text-red-500" />
                </div>
                <h3 className="font-outfit font-bold text-brand-primary mb-2">{dor.titulo}</h3>
                <p className="font-roboto text-sm text-gray-600 leading-relaxed">{dor.descricao}</p>
              </m.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-14">
            {dores.slice(3).map((dor, i) => (
              <m.div
                key={dor.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i + 3) * 0.07 }}
                className="bg-red-50 border border-red-100 rounded-xl p-6"
              >
                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <dor.icon size={20} className="text-red-500" />
                </div>
                <h3 className="font-outfit font-bold text-brand-primary mb-2">{dor.titulo}</h3>
                <p className="font-roboto text-sm text-gray-600 leading-relaxed">{dor.descricao}</p>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => modal?.abrirContato()}
              className="inline-flex items-center px-8 py-4 bg-brand-primary text-white font-roboto font-semibold rounded-sm hover:bg-brand-primary/90 transition-all hover:scale-[1.03]"
            >
              Quero resolver isso
            </button>
          </div>
        </div>
      </section>

      {/* ── Solução ──────────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 lg:py-32 bg-brand-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="A Solução" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              O Smart Locker Stoom resolve{' '}
              <span className="text-brand-secondary">de ponta a ponta</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Um armário inteligente instalado no seu ponto estratégico transforma a jornada de entrega: mais rápida, mais segura e totalmente rastreável.
            </p>
          </SectionWrapper>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {etapas.map((etapa, i) => (
                <m.div
                  key={etapa.numero}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-outfit font-bold text-brand-highlight text-sm">{etapa.numero}</span>
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-brand-primary mb-1">{etapa.titulo}</h3>
                    <p className="font-roboto text-sm text-gray-600 leading-relaxed">{etapa.descricao}</p>
                  </div>
                </m.div>
              ))}
            </div>

            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-[420px] shadow-xl"
            >
              <img src="/stoom-locker.webp" alt="Smart Locker Stoom em operação" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-outfit font-bold text-white text-lg">Acesso por QR Code ou código</p>
                <p className="font-roboto text-white/70 text-sm mt-1">Sem app adicional. Funciona em qualquer smartphone.</p>
              </div>
            </m.div>
          </div>

          <div className="text-center mt-14">
            <a
              href="#beneficios"
              className="inline-flex items-center px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
            >
              Ver os benefícios
            </a>
          </div>
        </div>
      </section>

      {/* ── Benefícios ───────────────────────────────────────────────────── */}
      <section id="beneficios" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="Benefícios" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              Benefícios para{' '}
              <span className="text-brand-secondary">toda a cadeia logística</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Do operador ao destinatário final — todos ganham com um processo automatizado, seguro e sem fricção.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {beneficios.map((b, i) => (
              <m.div
                key={b.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-brand-light rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center mb-4">
                  <b.icon size={20} className="text-brand-highlight" />
                </div>
                <h3 className="font-outfit font-bold text-brand-primary mb-2 text-sm">{b.titulo}</h3>
                <p className="font-roboto text-xs text-gray-600 leading-relaxed">{b.descricao}</p>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => modal?.abrirContato()}
              className="inline-flex items-center px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
            >
              Quero esses benefícios
            </button>
          </div>
        </div>
      </section>

      {/* ── Case Petz ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-primary relative overflow-hidden">
        <img
          src="/petz.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-highlight rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <SectionWrapper className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-brand-highlight rounded-full" />
              <span className="text-brand-highlight font-roboto font-medium text-sm">Prova Social</span>
              <div className="w-2 h-2 bg-brand-highlight rounded-full" />
            </div>
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-white leading-tight">
              Quem usa a Stoom{' '}
              <span className="text-brand-secondary">transforma resultados</span>
            </h2>
          </SectionWrapper>

          <div className="bg-white/20 border border-white/25 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-outfit font-bold text-2xl text-white">Petz</span>
              <span className="text-xs font-roboto px-3 py-1 rounded-full bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30">
                Pet Retail & E-commerce
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { valor: '85x',    metrica: 'crescimento em receita online' },
                { valor: '140+',   metrica: 'lojas físicas integradas' },
                { valor: 'R$3bi+', metrica: 'levantados no IPO de 2020' },
                { valor: '5d → 1h', metrica: 'prazo de retirada: de até 5 dias para 1 hora' },
              ].map((r) => (
                <div key={r.metrica} className="text-center">
                  <div className="font-outfit font-bold text-3xl lg:text-4xl text-brand-secondary mb-1">{r.valor}</div>
                  <div className="font-roboto text-xs text-white/60 leading-snug">{r.metrica}</div>
                </div>
              ))}
            </div>

            <blockquote className="border-l-4 border-brand-highlight pl-6 mb-8">
              <p className="font-roboto text-white/80 leading-relaxed italic">
                "Integrar o e-commerce ao ERP da Petz nos permitiu usar o estoque de cada loja para oferecer prazos de entrega muito menores, com frete mais competitivo."
              </p>
              <footer className="mt-3">
                <span className="font-outfit font-semibold text-white text-sm">Lino Melhado</span>
                <span className="font-roboto text-white/50 text-xs ml-2">Especialista Técnico, Stoom</span>
              </footer>
            </blockquote>

            <div className="flex justify-center">
              <Link
                href="/cases/petz"
                className="inline-flex items-center px-6 py-3 bg-brand-secondary text-black font-roboto font-medium rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.02]"
              >
                Ver o case completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="Por que a Stoom" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              Tecnologia brasileira com{' '}
              <span className="text-brand-secondary">diferenciais reais</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Mais de 10 anos desenvolvendo soluções logísticas para grandes operações no Brasil. O Smart Locker Stoom nasce desse histórico.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {diferenciais.map((d, i) => (
              <m.div
                key={d.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4"
              >
                <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <d.icon size={20} className="text-brand-highlight" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-brand-primary mb-1">{d.titulo}</h3>
                  <p className="font-roboto text-sm text-gray-600 leading-relaxed">{d.descricao}</p>
                </div>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => modal?.abrirContato()}
              className="inline-flex items-center px-8 py-4 bg-brand-secondary text-black font-roboto font-semibold rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-[1.03] shadow-lg shadow-brand-secondary/20"
            >
              Falar com um especialista
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────────── */}
      <CTA />

      <Footer />
    </>
  )
}

