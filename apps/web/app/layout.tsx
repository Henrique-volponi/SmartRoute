import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartRoute Web',
  description: 'Visualize e gera rotas otimizadas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
