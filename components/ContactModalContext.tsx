'use client'

// Contexto que expõe o modal de contato (HubSpot) para qualquer componente
// dentro da home e de /smart-locker. Fora dessas páginas (Navbar aparece em
// /cases, /conteudos etc.) o contexto não existe: useContactModal() retorna
// null e quem chamou volta ao comportamento antigo (link para /#contato).

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import ContactModal from './ContactModal'

type ContactModalContextValue = {
  abrirContato: () => void
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false)

  const abrirContato = useCallback(() => setAberto(true), [])
  const fecharContato = useCallback(() => setAberto(false), [])

  return (
    <ContactModalContext.Provider value={{ abrirContato }}>
      {children}
      <ContactModal aberto={aberto} aoFechar={fecharContato} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  return useContext(ContactModalContext)
}
