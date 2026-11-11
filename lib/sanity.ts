import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'lyajz0yy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export interface Categoria {
  _id: string
  titulo: string
  slug: { current: string }
}

/**
 * Filtro GROQ do que está no ar: status "publicado" e data de publicação já
 * alcançada. Post publicado com data futura fica agendado: some do site até a
 * data, e a revalidação de 60s das páginas o coloca no ar sozinha.
 */
export const NO_AR = `status == "publicado" && (!defined(dataPublicacao) || dataPublicacao <= now())`

export interface Conteudo {
  _id: string
  titulo: string
  slug: { current: string }
  dataPublicacao: string
  palavrasChave?: string[]
  descricao?: string
  heroImage?: { asset: { url: string }; hotspot?: unknown }
  categoria?: Categoria
  corpo?: unknown[]
  status: string
}

export async function getCategorias(): Promise<Categoria[]> {
  return client.fetch(`*[_type == "categoria"] | order(titulo asc) { _id, titulo, slug }`)
}

export async function getConteudos(): Promise<Conteudo[]> {
  return client.fetch(`
    *[_type == "conteudo" && ${NO_AR}] | order(dataPublicacao desc) {
      _id, titulo, slug, dataPublicacao, palavrasChave,
      "heroImage": heroImage { asset->{ url }, hotspot },
      "categoria": categoria->{ _id, titulo, slug }
    }
  `)
}

export async function getConteudo(slug: string): Promise<Conteudo | null> {
  return client.fetch(
    `*[_type == "conteudo" && slug.current == $slug && ${NO_AR}][0] {
      _id, titulo, slug, dataPublicacao, status, descricao, palavrasChave,
      "heroImage": heroImage { asset->{ url }, hotspot },
      "categoria": categoria->{ _id, titulo, slug },
      corpo[] { ..., _type == "image" => { ..., asset->{ url } } }
    }`,
    { slug }
  )
}

// ─── Mídia ────────────────────────────────────────────────────────────────────

export interface Midia {
  _id: string
  titulo: string
  veiculo: string
  urlExterna: string
  dataPublicacao?: string
  imagem?: { asset: { url: string }; hotspot?: unknown }
  status: string
}

export async function getMidias(): Promise<Midia[]> {
  return client.fetch(
    `*[_type == "midia" && status == "publicado"] | order(dataPublicacao desc) {
      _id, titulo, veiculo, urlExterna, dataPublicacao,
      "imagem": imagem { asset->{ url }, hotspot }
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Cases ────────────────────────────────────────────────────────────────────

export interface CaseResultado {
  _key: string
  valor: string
  metrica: string
}

export interface CaseDepoimento {
  texto: string
  nome: string
  cargo: string
}

export interface Case {
  _id: string
  titulo: string
  slug: { current: string }
  empresa: string
  segmento?: string
  logoEmpresa?: { asset: { url: string } }
  imagemCapa?: { asset: { url: string }; hotspot?: unknown }
  descricaoCurta?: string
  corpo?: unknown[]
  depoimento?: CaseDepoimento
  resultados?: CaseResultado[]
  status: string
  dataPublicacao?: string
}

export async function getCases(): Promise<Case[]> {
  return client.fetch(`
    *[_type == "case" && status == "publicado"] | order(dataPublicacao desc) {
      _id, titulo, slug, empresa, segmento, descricaoCurta, dataPublicacao,
      "logoEmpresa": logoEmpresa { asset->{ url } },
      "imagemCapa": imagemCapa { asset->{ url }, hotspot }
    }
  `)
}

export async function getCase(slug: string): Promise<Case | null> {
  return client.fetch(
    `*[_type == "case" && slug.current == $slug][0] {
      _id, titulo, slug, empresa, segmento, descricaoCurta, dataPublicacao, status,
      "logoEmpresa": logoEmpresa { asset->{ url } },
      "imagemCapa": imagemCapa { asset->{ url }, hotspot },
      corpo[] { ..., _type == "image" => { ..., asset->{ url } } },
      depoimento,
      resultados
    }`,
    { slug }
  )
}
