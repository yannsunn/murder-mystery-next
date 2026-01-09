import type { NextConfig } from 'next'
import { resolve } from 'path'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  turbopack: {
    root: resolve(__dirname),
  },
}

export default nextConfig
