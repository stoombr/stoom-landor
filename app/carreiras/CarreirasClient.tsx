'use client'

import { m, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Lightbulb,
  Cpu,
  Rocket,
  Users,
  HeartPulse,
  Shield,
  BookOpen,
  Dumbbell,
  Laptop,
  Gift,
  TrendingUp,
  UserPlus,
  Search,
  Send,
  MessageCircle,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const JOURNY_URL = 'https://www.journy.com.br/carreiras'

// ─── Dados ────────────────────────────────────────────────────────────────────

const motivos = [
  {
    icon: Cpu,
    titulo: 'Hardware + software de verdade',
    descricao: 'Aqui você trabalha com um produto físico conectado a uma plataforma própria: smart lockers, integrações, apps e painéis de gestão.',
  },
  {
    icon: Rocket,
    titulo: 'Impacto que você vê na rua',
    descricao: 'O que construímos está em operação em lojas, condomínios e centros logísticos — usado todos os dias por milhares de pessoas.',
  },
  {
    icon: Lightbulb,
    titulo: 'Espaço para propor e fazer',
    descricao: 'Time enxuto, decisões rápidas e abertura para novas ideias. Nascemos como spin-off e mantemos esse jeito de empreender.',
  },
  {
    icon: Users,
    titulo: 'Gente boa ao seu lado',
    descricao: 'Mais de 10 anos de história, clientes como Petz, Tenda Atacado e iFood Shop, e um time que gosta de resolver problemas reais.',
  },
]

const valores = [
  'Flexibilidade + Colaboração',
  'Foco Cliente + Seja transparente',
  'Simplificação + Resultado',
  'Work hard + Play hard',
]

const ecossistema = [
  { nome: 'Stoom',    descricao: 'Smart lockers e plataforma de gestão de entregas.' },
  { nome: 'OneBrain', descricao: 'Outsourcing de talentos de TI com inteligência artificial.' },
  { nome: 'FAST',     descricao: 'Fábrica de software com IA, low-code e no-code.' },
  { nome: 'Kolivo',   descricao: 'Operações de TI inteligentes e monitoramento em tempo real.' },
  { nome: 'Outforce', descricao: 'Tech hunting e aquisição de profissionais de tecnologia.' },
  { nome: 'Grilo',    descricao: 'Validação de desenvolvedores por análise prática de código real.' },
]

const beneficios = [
  { icon: HeartPulse, titulo: 'Assistência médica',       descricao: 'Planos de saúde com condições especiais.' },
  { icon: Shield,     titulo: 'Seguro de vida',           descricao: 'Mais tranquilidade para você e sua família.' },
  { icon: BookOpen,   titulo: 'Reembolso de treinamento', descricao: 'Incentivo para você continuar aprendendo.' },
  { icon: Dumbbell,   titulo: 'TotalPass',                descricao: 'Acesso a academias e serviços de bem-estar.' },
  { icon: Laptop,     titulo: 'Modelo de trabalho flexível', descricao: 'Formato definido de acordo com cada vaga.' },
  { icon: Gift,       titulo: 'Day off no aniversário',   descricao: 'Uma folga para você curtir o seu dia.' },
  { icon: TrendingUp, titulo: 'Bônus por metas',          descricao: 'Reconhecimento para quem entrega resultado.' },
  { icon: UserPlus,   titulo: 'Bônus por indicação',      descricao: 'Indicou alguém que entrou? Você também ganha.' },
]

const etapas = [
  {
    numero: '01',
    icon: Search,
    titulo: 'Confira as vagas do Grupo',
    descricao: 'As oportunidades da Stoom e das demais empresas do Grupo Landor ficam reunidas em um só lugar, na Journy.',
  },
  {
    numero: '02',
    icon: Send,
    titulo: 'Candidate-se',
    descricao: 'Encontrou uma vaga com a sua cara? Envie sua candidatura direto pela plataforma, em poucos minutos.',
  },
  {
    numero: '03',
    icon: MessageCircle,
    titulo: 'Bate-papo com o time',
    descricao: 'Se o seu perfil combinar, nosso time de pessoas entra em contato para as próximas etapas.',
  },
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

function BotaoVagas({ label = 'Ver vagas do Grupo', variante = 'laranja' }: { label?: string; variante?: 'laranja' | 'navy' }) {
  const estilo =
    variante === 'navy'
      ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
      : 'bg-brand-secondary text-black hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/25'
  return (
    <a
      href={JOURNY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-8 py-4 font-roboto font-semibold rounded-sm transition-all hover:scale-[1.03] ${estilo}`}
    >
      {label}
    </a>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CarreirasClient() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-primary pt-40 pb-28 lg:min-h-[640px] overflow-hidden">
        <img
          src="/stoom-carreiras.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-brand-primary/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-brand-highlight font-roboto text-sm font-medium tracking-widest uppercase mb-4">
              Carreiras
            </span>
            <h1 className="font-outfit text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Venha construir o{' '}
              <span className="text-brand-secondary">futuro das entregas</span>{' '}
              com a gente
            </h1>
            <p className="font-roboto text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              Na Stoom, tecnologia e logística se encontram para resolver problemas reais. E, como parte do Grupo Landor, você tem um ecossistema inteiro de empresas e oportunidades para crescer.
            </p>
            <BotaoVagas />
          </m.div>
        </div>
      </section>

      {/* ── Por que a Stoom ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="Por que a Stoom" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              Um lugar para fazer{' '}
              <span className="text-brand-secondary">tecnologia que funciona</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Fundada em 2014, em Campinas (SP), por ex-alunos da Unicamp, a Stoom é referência em smart lockers no Brasil. Do hardware ao software, construímos soluções que simplificam a última milha.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {motivos.map((item, i) => (
              <m.div
                key={item.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-brand-light rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-brand-highlight" />
                </div>
                <h3 className="font-outfit font-bold text-brand-primary mb-2">{item.titulo}</h3>
                <p className="font-roboto text-sm text-gray-600 leading-relaxed">{item.descricao}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valores ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SectionWrapper>
              <Badge label="Nossa cultura" />
              <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight mb-6">
                Valores que guiam{' '}
                <span className="text-brand-secondary">o nosso dia a dia</span>
              </h2>
              <p className="font-roboto text-gray-600 leading-relaxed">
                Nossa missão é simplificar e automatizar a logística de entregas por meio de smart lockers seguros e conectados. Para chegar lá, contamos com pessoas que compartilham destes valores.
              </p>
            </SectionWrapper>

            <div className="grid sm:grid-cols-2 gap-5">
              {valores.map((valor, i) => (
                <m.div
                  key={valor}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <span className="font-outfit font-bold text-brand-highlight text-sm w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    0{i + 1}
                  </span>
                  <h3 className="font-outfit font-semibold text-brand-primary">{valor}</h3>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Grupo Landor ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-highlight rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <SectionWrapper className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-highlight/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-brand-highlight rounded-full" />
              <span className="text-brand-highlight font-roboto font-medium text-sm">Grupo Landor</span>
              <div className="w-2 h-2 bg-brand-highlight rounded-full" />
            </div>
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-white leading-tight">
              Trabalhe na Stoom e{' '}
              <span className="text-brand-secondary">em todo o Grupo</span>
            </h2>
            <p className="font-roboto text-white/70 max-w-2xl mx-auto mt-6 leading-relaxed">
              A Stoom faz parte da Landor, holding de tecnologia que reúne empresas especializadas. As vagas do Grupo ficam centralizadas: no momento não temos posições abertas na Stoom, mas há oportunidades nas outras empresas do ecossistema — e novas vagas surgem o tempo todo.
            </p>
          </SectionWrapper>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {ecossistema.map((empresa, i) => (
              <m.div
                key={empresa.nome}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`rounded-xl p-6 border ${
                  empresa.nome === 'Stoom' ? 'bg-brand-secondary/15 border-brand-secondary/40' : 'bg-white/5 border-white/10'
                }`}
              >
                <h3 className="font-outfit text-lg font-bold text-white mb-2">{empresa.nome}</h3>
                <p className="font-roboto text-sm text-white/60 leading-relaxed">{empresa.descricao}</p>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <BotaoVagas />
          </div>
        </div>
      </section>

      {/* ── Benefícios ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="Benefícios" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              Cuidamos de quem{' '}
              <span className="text-brand-secondary">faz a Stoom acontecer</span>
            </h2>
            <p className="font-roboto text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Benefícios pensados para o seu bem-estar, o seu desenvolvimento e a sua qualidade de vida.
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* ── Como se candidatar ───────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionWrapper className="text-center mb-16">
            <Badge label="Como se candidatar" />
            <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
              Seu próximo passo{' '}
              <span className="text-brand-secondary">começa aqui</span>
            </h2>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {etapas.map((etapa, i) => (
              <m.div
                key={etapa.numero}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-outfit font-bold text-brand-highlight text-sm">{etapa.numero}</span>
                  </div>
                  <etapa.icon size={20} className="text-brand-secondary" />
                </div>
                <h3 className="font-outfit font-bold text-brand-primary mb-1">{etapa.titulo}</h3>
                <p className="font-roboto text-sm text-gray-600 leading-relaxed">{etapa.descricao}</p>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <BotaoVagas variante="navy" />
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-highlight rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-secondary rounded-full blur-3xl" />
        </div>
        <SectionWrapper className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-outfit text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Vem ser <span className="text-brand-secondary">Stoom</span>, vem ser Landor!
          </h2>
          <p className="font-roboto text-lg text-white/70 leading-relaxed mb-10">
            Mesmo sem vagas abertas na Stoom agora, sua próxima oportunidade pode estar no Grupo. Confira as posições disponíveis e acompanhe as novidades — novas vagas surgem o tempo todo.
          </p>
          <BotaoVagas label="Ver vagas disponíveis" />
        </SectionWrapper>
      </section>

      <Footer />
    </>
  )
}
