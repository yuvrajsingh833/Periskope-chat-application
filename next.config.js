/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;