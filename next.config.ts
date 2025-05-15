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

export default nextConfig;
