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
  /* config options here */
};

export default nextConfig;
