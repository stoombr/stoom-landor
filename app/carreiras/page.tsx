import type { Metadata } from 'next'
import CarreirasClient from './CarreirasClient'

export const metadata: Metadata = {
  title: 'Carreiras | Trabalhe na Stoom e no Grupo Landor',
  description: 'Faça parte do time que transforma a logística de entregas com smart lockers. Conheça a Stoom, o ecossistema Landor e as vagas abertas no Grupo.',
}

export default function CarreirasPage() {
  return <CarreirasClient />
}
