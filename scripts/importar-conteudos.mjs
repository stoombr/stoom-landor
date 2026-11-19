/**
 * Importa o arquivo semanal de conteúdos (formato landor-editorial-semanal-v1) como RASCUNHOS no Sanity.
 * Os posts entram com status "publicado" e a data sugerida; publicar = revisar no Studio e clicar Publish.
 *
 * Uso:
 *   node scripts/importar-conteudos.mjs ~/Downloads/stoom-2026-W47-conteudos.md --dry   (só confere)
 *   node scripts/importar-conteudos.mjs ~/Downloads/stoom-2026-W47-conteudos.md         (grava)
 *
 * Token (Editor): SANITY_TOKEN no .env.local (gitignored) ou na variável de ambiente.
 */
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { createClient } from '@sanity/client'

const arquivo = process.argv.slice(2).find(a => !a.startsWith('--'))
if (!arquivo) { console.error('Uso: node scripts/importar-conteudos.mjs <arquivo.md> [--dry]'); process.exit(1) }
const md = readFileSync(arquivo, 'utf8')
const key = () => randomBytes(6).toString('hex')
// Categoria pelo link do CTA final (último link do texto)
const CATEGORIA_POR_CTA = {
  '/condominio': 'categoria-smart-lockers', // Smart Lockers
  '/smart-locker': 'categoria-smart-lockers', // Smart Lockers
  '/varejo': 'categoria-logistica', // Logística
  '/#segmentos': 'categoria-tecnologia', // Tecnologia
}

function spans(texto) {
  const children = [], markDefs = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g; let i = 0, m
  while ((m = re.exec(texto))) {
    if (m.index > i) children.push({ _type: 'span', _key: key(), marks: [], text: texto.slice(i, m.index) })
    const k = key(); markDefs.push({ _type: 'link', _key: k, href: m[2] })
    children.push({ _type: 'span', _key: key(), marks: [k], text: m[1] }); i = re.lastIndex
  }
  if (i < texto.length) children.push({ _type: 'span', _key: key(), marks: [], text: texto.slice(i) })
  if (/[*_`#]/.test(texto.replace(/\[[^\]]+\]\([^)]+\)/g, ''))) console.warn('⚠ markdown não tratado:', texto.slice(0, 80))
  return { children, markDefs }
}
const bloco = (style, texto) => ({ _type: 'block', _key: key(), style, ...spans(texto) })
const secao = (txt, nome) => txt.split(`### ${nome}\n`)[1].split(/\n### /)[0].trim()

const docs = [...md.matchAll(/<!-- INICIO_CONTEUDO \d+ -->([\s\S]*?)<!-- FIM_CONTEUDO \d+ -->/g)].map(([, t]) => {
  const id = t.match(/ID: "([^"]+)"/)[1]
  const data = new Date(t.match(/Data de publicação sugerida: "([^"]+)"/)[1]).toISOString()
  const corpoMd = t.split('### Conteúdo\n')[1].trim()
  const corpo = corpoMd.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && p !== '---')
    .map(p => p.startsWith('## ') ? bloco('h2', p.slice(3)) : bloco('normal', p.replace(/\n/g, ' ')))
  const cta = [...corpoMd.matchAll(/\]\((https:\/\/(?:www\.)?stoom\.com\.br[^)]*)\)/g)].pop()?.[1].replace(/^https:\/\/(www\.)?stoom\.com\.br/, '') || '/'
  const categoria = CATEGORIA_POR_CTA[cta]
  if (!categoria) console.warn(`⚠ ${id}: CTA "${cta}" sem categoria mapeada — defina no Studio`)
  return {
    _id: 'drafts.' + id.replace(':', '-'),
    _type: 'conteudo',
    titulo: secao(t, 'Título'),
    slug: { _type: 'slug', current: secao(t, 'Slug sugerida') },
    descricao: secao(t, 'Descrição'),
    palavrasChave: secao(t, 'Palavras-chave').split('\n').map(l => l.replace(/^- /, '').trim()),
    ...(categoria ? { categoria: { _type: 'reference', _ref: categoria } } : {}),
    status: 'publicado',
    dataPublicacao: data,
    corpo,
  }
})

for (const d of docs) {
  const links = d.corpo.flatMap(b => b.markDefs.map(m => m.href))
  console.log(`${d._id}\n  "${d.titulo}" | /${d.slug.current} | ${d.dataPublicacao} | cat ${d.categoria?._ref ?? '—'}\n  descrição ${d.descricao.length} chars | ${d.palavrasChave.length} palavras | ${d.corpo.length} blocos (${d.corpo.filter(b => b.style === 'h2').length} h2) | links: ${links.join(', ')}`)
  if (d.descricao.length > 160) console.warn('  ⚠ descrição > 160')
}
if (!docs.length) throw new Error('nenhum conteúdo encontrado no arquivo')
if (process.argv.includes('--dry')) process.exit(0)

const token = (process.env.SANITY_TOKEN || (readFileSync(new URL('../.env.local', import.meta.url), 'utf8').match(/^SANITY_TOKEN=(.*)$/m) || [])[1] || '').trim()
if (!token) { console.error('Defina SANITY_TOKEN'); process.exit(1) }
const client = createClient({ projectId: 'lyajz0yy', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false })
// slug já usado por outro conteúdo publicado?
const ocupados = await client.fetch('*[_type=="conteudo" && slug.current in $s && !(_id in path("drafts.**"))]{_id,"s":slug.current}', { s: docs.map(d => d.slug.current) })
if (ocupados.length) { console.error('Slug já existe:', ocupados); process.exit(1) }
const tx = client.transaction(); docs.forEach(d => tx.createOrReplace(d))
const r = await tx.commit()
console.log('✅ gravados como rascunho:', r.results.map(x => x.id).join(', '))
