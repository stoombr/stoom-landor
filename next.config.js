const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Headers de segurança em todas as rotas. Sem CSP de propósito: os
        // scripts do HubSpot/GTM/Meta/LinkedIn quebrariam sem uma lista longa.
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/',
        headers: [
          { key: 'Link', value: '</llms.txt>; rel="service-doc"' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/produtos/stoom-smart-locker/', destination: '/smart-locker', permanent: true },
      { source: '/produtos/aplicativos/', destination: '/', permanent: true },
      { source: '/cases-de-sucesso/', destination: '/cases', permanent: true },
      { source: '/fale-com-um-especialista/', destination: '/#contato', permanent: true },
      { source: '/blog/', destination: '/conteudos', permanent: true },
      { source: '/logistica/entrega-verde/', destination: '/conteudos/entrega-verde', permanent: true },
      { source: '/gestao/armario-inteligente/', destination: '/conteudos/armario-inteligente', permanent: true },
      { source: '/logistica/armarios-inteligentes/', destination: '/conteudos/armarios-inteligentes', permanent: true },
      { source: '/sobre-a-stoom/armarios-inteligentes-smart-lockers/', destination: '/conteudos/armarios-inteligentes-simplificam-entregas', permanent: true },
      { source: '/gestao/mercadoria-avariada-pela-transportadora/', destination: '/conteudos/mercadoria-avariada-pela-transportadora', permanent: true },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
