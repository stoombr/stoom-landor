'use client'

// Pagina /condominio: LP "Smart Locker para condominio", portada de
// lp-stoom-oficial/index.html para React.
//
// Este arquivo e so a montagem. Cada capitulo vive em components/condominio/*
// e cuida da propria copy, do proprio layout e do proprio evento de analytics.
// Aqui ficam tres coisas e mais nada:
//   1. o estado do modal de proposta, que e o unico caminho de conversao da LP
//   2. o cabecalho e o rodape proprios da pagina
//   3. a ordem dos capitulos
//
// Corredor polones: a LP NAO importa o Navbar nem o Footer do site. Uma pagina
// de captura nao oferece rota de fuga; o cabecalho e so a marca e o rodape so
// tem o que o juridico exige (politica de privacidade, grupo, copyright).
//
// Tracking: nada e carregado aqui. GTM, GA4, Meta Pixel, HubSpot e LinkedIn ja
// vivem no app/layout.tsx. Cada secao dispara o proprio `eventoCta` com a sua
// origem ANTES de chamar `abrirModal`, entao esta pagina nao pode disparar de
// novo no handler, senao o `lp_cta_click` conta dobrado.

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Container, focoVisivel } from '@/components/condominio/ui'
import Hero from '@/components/condominio/Hero'
import ProvaSocial from '@/components/condominio/ProvaSocial'
import Problema from '@/components/condominio/Problema'
import ComoFunciona from '@/components/condominio/ComoFunciona'
import Produto from '@/components/condominio/Produto'
import Contratacao from '@/components/condominio/Contratacao'
import Faq from '@/components/condominio/Faq'
import Fechamento from '@/components/condominio/Fechamento'
import StickyCta from '@/components/condominio/StickyCta'
import LeadModal from '@/components/condominio/LeadModal'

// ─── Dados ────────────────────────────────────────────────────────────────────

/** Marca branca da Stoom. Mesmo arquivo no cabecalho e no rodape. */
const MARCA_STOOM = {
  src: '/lp-condominio/assets/stoom-secundario.svg',
  alt: 'Stoom',
  largura: 1057,
  altura: 278,
} as const

/** Selo do grupo, so no rodape. */
const SELO_LANDOR = {
  src: '/lp-condominio/assets/landor-selo.svg',
  alt: 'Powered by Landor, The Tech Group',
  largura: 340,
  altura: 108,
} as const

const POLITICA_PRIVACIDADE = 'https://www.stoom.com.br/institucional/politica-de-privacidade'

/** Linhas legais do rodape, verbatim do HTML fonte. */
const RODAPE_GRUPO = 'A Stoom é uma empresa do grupo Landor, The Tech Group.'
const RODAPE_COPYRIGHT = '© 2026 Stoom. Todos os direitos reservados.'

// ─── Cabecalho ────────────────────────────────────────────────────────────────

/**
 * Barra do topo: so a marca, centralizada, flutuando sobre a foto do hero.
 *
 * E absoluta (nao fixa), como no original: rola junto com o hero e some. A
 * sombra existe porque a marca cai sobre foto, e o topo da foto e a parte mais
 * clara dela.
 */
function CabecalhoLp() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 py-5">
      <Container className="flex items-center justify-center">
        <Image
          src={MARCA_STOOM.src}
          alt={MARCA_STOOM.alt}
          width={MARCA_STOOM.largura}
          height={MARCA_STOOM.altura}
          className="h-[30px] w-auto [filter:drop-shadow(0_2px_8px_rgb(15_40_66/0.5))]"
        />
      </Container>
    </header>
  )
}

// ─── Rodape ───────────────────────────────────────────────────────────────────

/**
 * Rodape proprio da LP. Duas linhas: marcas mais o link da politica, e as duas
 * frases legais. Nenhum link de navegacao alem da politica de privacidade.
 *
 * O `pb` extra no celular substitui o `body.has-stick { padding-bottom: 76px }`
 * do original: abre espaco para a barra fixa nao cobrir a ultima linha.
 */
function RodapeLp() {
  return (
    <footer className="border-t border-white/10 bg-brand-ink py-10 pb-[76px] font-roboto text-sm text-white/60 md:pb-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex items-center gap-6">
            <Image
              src={MARCA_STOOM.src}
              alt={MARCA_STOOM.alt}
              width={MARCA_STOOM.largura}
              height={MARCA_STOOM.altura}
              className="h-6 w-auto"
            />
            <span aria-hidden="true" className="h-7 w-px bg-white/10" />
            <Image
              src={SELO_LANDOR.src}
              alt={SELO_LANDOR.alt}
              width={SELO_LANDOR.largura}
              height={SELO_LANDOR.altura}
              className="h-[30px] w-auto"
            />
          </div>

          <a
            href={POLITICA_PRIVACIDADE}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex min-h-[44px] items-center rounded-sm underline underline-offset-[3px] transition-colors hover:text-white',
              focoVisivel,
              'focus-visible:ring-offset-brand-ink'
            )}
          >
            Política de Privacidade
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <span>{RODAPE_GRUPO}</span>
          <span>{RODAPE_COPYRIGHT}</span>
        </div>
      </Container>
    </footer>
  )
}

// ─── Pagina ───────────────────────────────────────────────────────────────────

export default function CondominioClient() {
  const [modalAberto, setModalAberto] = useState(false)

  // Estaveis de proposito: os capitulos recebem esta funcao por prop e nao
  // devem re-renderizar so porque a pagina re-renderizou.
  const abrirModal = useCallback(() => setModalAberto(true), [])
  const fecharModal = useCallback(() => setModalAberto(false), [])

  return (
    <>
      {/* Abaixo da dobra o reveal e por scroll (framer, useInView): sem JS o
          observer nunca dispara e o texto ficaria invisivel para sempre.
          Isto devolve a pagina inteira para quem esta sem JS. */}
      <noscript>
        <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* `relative` ancora o cabecalho absoluto no topo da pagina. */}
      <div className="relative bg-brand-light">
        <CabecalhoLp />

        <main>
          <Hero aoAbrir={abrirModal} />
          <ProvaSocial />
          <Problema />
          <ComoFunciona aoAbrir={abrirModal} />
          <Produto />
          <Contratacao aoAbrir={abrirModal} />
          <Faq />
          <Fechamento aoAbrir={abrirModal} />
        </main>

        <RodapeLp />
      </div>

      {/* Barra fixa do celular. Ela mesma se recolhe com o modal aberto. */}
      <StickyCta aoAbrir={abrirModal} modalAberto={modalAberto} />

      {/* Unico destino de todos os CTAs. Vai para um portal no body. */}
      <LeadModal aberto={modalAberto} aoFechar={fecharModal} />
    </>
  )
}
