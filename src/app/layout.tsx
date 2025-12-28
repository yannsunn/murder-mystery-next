import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Murder Mystery Generator',
  description: 'プロフェッショナル品質のマーダーミステリーシナリオ生成システム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
