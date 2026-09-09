import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import MotionProvider from '@/components/MotionProvider';
import { jsonLdScript } from '@/lib/json-ld';

const outfit = localFont({
  src: './fonts/outfit-latin.woff2',
  variable: '--font-outfit',
  display: 'swap',
  weight: '100 900',
});

const roboto = localFont({
  src: './fonts/roboto-latin.woff2',
  variable: '--font-roboto',
  display: 'swap',
  weight: '100 900',
});

const SITE_URL = 'https://stoom.com.br';
const OG_IMAGE = `${SITE_URL}/thumb-stoom.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Stoom | Smart lockers e plataforma para gestão de entregas',
  description:
    'A Stoom combina smart lockers e plataforma digital para automatizar entregas, retiradas e gestão logística com segurança, rastreabilidade e controle em tempo real.',

  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',

  keywords: [
    'Stoom',
    'smart locker',
    'smart lockers',
    'armário inteligente',
    'armários inteligentes',
    'lockers inteligentes',
    'locker para encomendas',
    'gestão de entregas',
    'automação de entregas',
    'retirada por QR Code',
    'controle de encomendas',
    'rastreamento de entregas',
    'plataforma logística',
    'gestão logística',
    'logística inteligente',
    'automação logística',
    'lockers para condomínios',
    'lockers para empresas',
    'lockers para varejo',
    'lockers para indústrias',
    'lockers para operações logísticas',
    'last mile',
    'última milha',
    'entrega autônoma',
    'retirada autônoma',
    'infraestrutura logística digital',
  ],

  alternates: {
    canonical: `${SITE_URL}/`,
  },

  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: 'Stoom',
    locale: 'pt_BR',
    title: 'Stoom | Smart lockers e plataforma para gestão de entregas',
    description:
      'A Stoom combina smart lockers e plataforma digital para automatizar entregas, retiradas e gestão logística com segurança, rastreabilidade e controle em tempo real.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Stoom — Smart lockers e plataforma de gestão logística',
        type: 'image/webp',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Stoom | Smart lockers e plataforma para gestão de entregas',
    description:
      'A Stoom combina smart lockers e plataforma digital para automatizar entregas, retiradas e gestão logística com segurança, rastreabilidade e controle em tempo real.',
    images: [OG_IMAGE],
  },

  other: {
    'og:image:secure_url': OG_IMAGE,
    'og:image:type': 'image/webp',
    'og:image:width': '1200',
    'og:image:height': '630',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    // Fundo branco de proposito. Em fundo transparente o simbolo laranja encosta
    // na cor de aba que o usuario escolheu (verde, azul, rosa) e some. O SVG
    // atende Chrome, Edge e Firefox; os PNG cobrem Safari e o atalho do iOS.
    icon: [
      { url: '/favicon-stoom-tab.svg', type: 'image/svg+xml' },
      { url: '/favicon-stoom-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/favicon-stoom-180.png',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Stoom',
  url: SITE_URL,
  logo: `${SITE_URL}/stoom-primario.svg`,
  description:
    'A Stoom combina smart lockers e plataforma digital para automatizar entregas, retiradas e gestão logística com segurança, rastreabilidade e controle em tempo real.',
  sameAs: [
    'https://www.linkedin.com/company/stoom-ecommerce/',
    'https://www.instagram.com/stoom_tecnologia_/',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Stoom',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/conteudos?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${roboto.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
        />
      </head>
      <body className={roboto.className}>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TLN423QH');`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S12SFW8SV2"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-S12SFW8SV2');`,
          }}
        />
        <Script id="hs-script-loader" src="//js.hs-scripts.com/51547160.js" strategy="afterInteractive" />
        <Script
          id="meta-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '999675166432051');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TLN423QH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=999675166432051&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Script
          id="linkedin-insight-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `_linkedin_partner_id = "10718305";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);`,
          }}
        />
        <Script
          id="linkedin-insight-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);
})(window.lintrk);`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=10718305&fmt=gif"
          />
        </noscript>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}