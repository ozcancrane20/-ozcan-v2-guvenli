import './globals.css'

export const metadata = {
  title: 'ÖZCAN CRANE - Stok Yönetim Sistemi',
  description: 'Profesyonel stok takip ve yönetim sistemi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
