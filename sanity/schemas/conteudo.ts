import { defineType } from 'sanity'

export default defineType({
  name: 'conteudo',
  title: 'Conteúdo',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
    },
    {
      name: 'heroImage',
      title: 'Imagem de Capa',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'descricao',
      title: 'Descrição (SEO)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'palavrasChave',
      title: 'Palavras-chave',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'corpo',
      title: 'Conteúdo',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Citação', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
        {
          type: 'object',
          name: 'divisoria',
          title: 'Divisória',
          fields: [{ name: 'style', type: 'string', hidden: true, initialValue: 'hr' }],
          preview: { select: {}, prepare: () => ({ title: '— Divisória —' }) },
        },
      ],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '✅ Publicado', value: 'publicado' },
          { title: '📝 Rascunho', value: 'rascunho' },
        ],
        layout: 'radio',
      },
      initialValue: 'publicado',
    },
    {
      name: 'dataPublicacao',
      title: 'Data de Publicação',
      type: 'datetime',
      description:
        'Para agendar: status "Publicado" + data futura + Publish. O post só aparece no site a partir desta data (em até 1 min).',
    },
  ] as any[],
  preview: {
    select: {
      title: 'titulo',
      status: 'status',
      categoria: 'categoria.titulo',
    },
    prepare({ title, status, categoria }: { title: string; status: string; categoria?: string }) {
      return {
        title: `${status === 'publicado' ? '✅' : '📝'} ${title}`,
        subtitle: categoria,
      }
    },
  },
  orderings: [
    {
      title: 'Data de Publicação',
      name: 'dataPublicacaoDesc',
      by: [{ field: 'dataPublicacao', direction: 'desc' as const }],
    },
  ],
})
