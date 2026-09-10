import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const SITE_URL = 'https://stoom.com.br'

async function getConteudoSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  return client.fetch(
    `*[_type == "conteudo" && status == "publicado"] { "slug": slug.current, "updatedAt": _updatedAt }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

async function getCaseSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  return client.fetch(
    `*[_type == "case" && status == "publicado"] { "slug": slug.current, "updatedAt": _updatedAt }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [conteudos, cases] = await Promise.all([getConteudoSlugs(), getCaseSlugs()])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/conteudos`,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/cases`,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/stoom-na-midia`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/institucional/quem-somos`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/institucional/parceiros`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/institucional/politica-de-privacidade`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/smart-locker`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/condominio`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/varejo`,                        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const conteudoPages: MetadataRoute.Sitemap = conteudos.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/conteudos/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const casePages: MetadataRoute.Sitemap = cases.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/cases/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...conteudoPages, ...casePages]
}
