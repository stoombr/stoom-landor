import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCase, getCases } from '@/lib/sanity'
import CaseSlugClient from './CaseSlugClient'

export const revalidate = 60

export async function generateStaticParams() {
  const cases = await getCases()
  return cases.map(c => ({ slug: c.slug.current }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  const item = await getCase(params.slug)
  if (!item) return { title: 'Case não encontrado | Stoom' }

  const ogImage = item.imagemCapa?.asset?.url

  return {
    title: `${item.empresa} | Cases de Sucesso | Stoom`,
    description: item.descricaoCurta || `Case de sucesso: ${item.empresa}`,
    openGraph: {
      title: `${item.empresa} | Cases de Sucesso`,
      description: item.descricaoCurta || '',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: item.empresa }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.empresa} | Cases de Sucesso`,
      description: item.descricaoCurta || '',
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function CasePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const item = await getCase(params.slug)
  if (!item || item.status !== 'publicado') notFound()
  return <CaseSlugClient item={item} />
}
