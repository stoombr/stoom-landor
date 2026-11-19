import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConteudo, getConteudos } from '@/lib/sanity'
import ConteudoSlugClient from './ConteudoSlugClient'

export const revalidate = 60

export async function generateStaticParams() {
  const conteudos = await getConteudos()
  return conteudos.map(c => ({ slug: c.slug.current }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  const conteudo = await getConteudo(params.slug)
  if (!conteudo) return { title: 'Conteúdo não encontrado | Stoom' }

  const ogImage = conteudo.heroImage?.asset?.url

  return {
    title: `${conteudo.titulo} | Stoom`,
    description: conteudo.descricao || conteudo.titulo,
    keywords: conteudo.palavrasChave,
    openGraph: {
      title: conteudo.titulo,
      description: conteudo.descricao || '',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: conteudo.titulo }] : [],
      type: 'article',
      publishedTime: conteudo.dataPublicacao,
    },
    twitter: {
      card: 'summary_large_image',
      title: conteudo.titulo,
      description: conteudo.descricao || '',
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ConteudoPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const conteudo = await getConteudo(params.slug)
  if (!conteudo || conteudo.status !== 'publicado') notFound()
  return <ConteudoSlugClient conteudo={conteudo} />
}
