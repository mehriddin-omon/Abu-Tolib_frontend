import type { NextConfig } from 'next';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // Docker uchun: .next/standalone ichida minimal server
  output: 'standalone',
  poweredByHeader: false,
  // Lokal ishlab chiqishda /api/v1/* backend'ga yo'naltiriladi.
  // Production'da buni Caddy qiladi (bu qoida ishlatilmaydi).
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${apiUrl}/api/v1/:path*` }];
  },
};

export default nextConfig;
