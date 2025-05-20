import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Ignora ESLint completamente
  },
  typescript: {
    ignoreBuildErrors: true,  // 👈 Ignora errores de TypeScript
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://vinilos-backend-2tpu.onrender.com/api/:path*',
      },
    ]
  },
};
const repo = 'vinilos_front-end'
module.exports = {
  output: 'export',
  basePath: repo,
  assetPrefix: `${repo}/`,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

export default nextConfig;
