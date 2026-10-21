'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Instagram } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/stoom-ecommerce/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/stoom_tecnologia_/', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <Image
                src="/stoom-secundario.svg"
                alt="Stoom"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-highlight transition-all hover:scale-110"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 font-roboto text-sm">
            © Landor Soluções em Tecnologia Ltda. Todos os direitos reservados.
          </p>
          <a
            href="/institucional/politica-de-privacidade"
            className="text-white/50 font-roboto text-sm hover:text-white/80 transition-colors"
          >
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}