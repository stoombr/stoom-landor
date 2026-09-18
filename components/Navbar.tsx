'use client';

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContactModal } from './ContactModalContext';

const institucionalLinks = [
  { label: 'Quem somos', href: '/institucional/quem-somos' },
  { label: 'Parceiros', href: '/institucional/parceiros' },
  { label: 'Stoom na Mídia', href: '/stoom-na-midia' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInstitucionalOpen, setIsInstitucionalOpen] = useState(false);
  const [isMobileInstitucionalOpen, setIsMobileInstitucionalOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const modal = useContactModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsInstitucionalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = `font-roboto font-medium transition-colors ${
    isScrolled ? 'text-brand-primary hover:text-brand-highlight' : 'text-white hover:text-brand-highlight'
  }`;

  return (
    <m.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled ? '/stoom-primario.svg' : '/stoom-secundario.svg'}
              alt="Stoom"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-8">
              {/* Dropdown Institucional */}
              <li
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsInstitucionalOpen(true)}
                onMouseLeave={() => setIsInstitucionalOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 ${linkClass}`}
                  aria-haspopup="menu"
                  aria-expanded={isInstitucionalOpen}
                >
                  Institucional
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${isInstitucionalOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Sempre presente no DOM (crawlable); visibilidade controlada por CSS.
                    pt-2 (em vez de mt-2) mantém o espaço entre botão e menu dentro da área
                    de hover do <li>, evitando que o mouseleave dispare ao atravessar o gap. */}
                <div
                  className={`absolute top-full left-0 pt-2 w-44 transition-all duration-150 ${
                    isInstitucionalOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div role="menu" className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    {institucionalLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setIsInstitucionalOpen(false)}
                        className={`block px-4 py-3 text-sm font-roboto font-medium transition-colors hover:bg-brand-light hover:text-brand-secondary ${
                          pathname === item.href ? 'text-brand-secondary bg-brand-light' : 'text-brand-primary'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li><Link href="/smart-locker" className={linkClass}>Solução</Link></li>
              <li><a href="/#segmentos" className={linkClass}>Segmentos</a></li>
              <li><Link href="/cases" className={linkClass}>Cases</Link></li>
              <li><Link href="/conteudos" className={linkClass}>Conteúdos</Link></li>
            </ul>

            {modal ? (
              <button
                type="button"
                onClick={() => modal.abrirContato()}
                className="px-6 py-3 bg-brand-secondary text-black font-roboto font-medium rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-105"
              >
                Solicite uma demonstração
              </button>
            ) : (
              <a
                href="/#contato"
                className="px-6 py-3 bg-brand-secondary text-black font-roboto font-medium rounded-sm hover:bg-brand-secondary/90 transition-all hover:scale-105"
              >
                Solicite uma demonstração
              </a>
            )}

            <div className={`w-px h-6 ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`} />

            <a href="https://www.landor.com.br/" target="_blank" rel="noopener noreferrer">
              <Image
                src={isScrolled ? '/selo-landor-black.svg' : '/selo-landor-white.svg'}
                alt="Selo de Qualidade"
                width={110}
                height={55}
                className="h-12 w-auto opacity-90"
              />
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${isScrolled ? 'text-brand-primary' : 'text-white'}`}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Institucional mobile */}
              <div>
                <button
                  onClick={() => setIsMobileInstitucionalOpen((v) => !v)}
                  className="flex items-center gap-1 text-brand-primary hover:text-brand-highlight font-roboto font-medium w-full"
                >
                  Institucional
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${isMobileInstitucionalOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isMobileInstitucionalOpen && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-2 space-y-3"
                    >
                      {institucionalLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-brand-primary/70 hover:text-brand-secondary font-roboto text-sm font-medium"
                          onClick={() => { setIsMobileMenuOpen(false); setIsMobileInstitucionalOpen(false); }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/smart-locker"
                className="block text-brand-primary hover:text-brand-highlight font-roboto font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Solução
              </Link>

              <a
                href="/#segmentos"
                className="block text-brand-primary hover:text-brand-highlight font-roboto font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Segmentos
              </a>

              <Link
                href="/cases"
                className="block text-brand-primary hover:text-brand-highlight font-roboto font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cases
              </Link>

              <Link
                href="/conteudos"
                className="block text-brand-primary hover:text-brand-highlight font-roboto font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Conteúdos
              </Link>

              {modal ? (
                <button
                  type="button"
                  onClick={() => { modal.abrirContato(); setIsMobileMenuOpen(false); }}
                  className="block w-full px-6 py-3 bg-brand-secondary text-black text-center font-roboto font-medium rounded-sm"
                >
                  Solicitar Demonstração
                </button>
              ) : (
                <a
                  href="/#contato"
                  className="block px-6 py-3 bg-brand-secondary text-black text-center font-roboto font-medium rounded-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Solicitar Demonstração
                </a>
              )}

              <div className="flex justify-center pt-2 pb-1">
                <a href="https://www.landor.com.br/" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/selo-landor-black.svg"
                    alt="Selo de Qualidade"
                    width={120}
                    height={60}
                    className="h-12 w-auto opacity-80"
                  />
                </a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
