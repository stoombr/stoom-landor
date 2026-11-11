import { NextResponse } from 'next/server'
import { getConteudos } from '@/lib/sanity'

export const revalidate = 60

export async function GET() {
  const conteudos = await getConteudos()

  const lines = [
    '# Conteúdos | Stoom',
    '',
    '> Alternate markdown representation for AI agents. Human-facing page: https://stoom.com.br/conteudos',
    '',
    '## Artigos & novidades',
    '',
    'Artigos, insights e novidades sobre logística inteligente, smart lockers e gestão de entregas.',
    '',
  ]

  if (conteudos.length === 0) {
    lines.push('Nenhum conteúdo publicado ainda.')
  } else {
    for (const c of conteudos) {
      lines.push(`## [${c.titulo}](/conteudos/${c.slug.current})`)
      if (c.categoria?.titulo) lines.push(`Categoria: ${c.categoria.titulo}`)
      if (c.dataPublicacao) {
        lines.push(
          `Publicado em: ${new Date(c.dataPublicacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}`
        )
      }
      if (c.descricao) lines.push('', c.descricao)
      lines.push('')
    }
  }

  return new NextResponse(lines.join('\n').trim(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
