/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Skip static page generation - API-only backend
  staticPageGenerationTimeout: 0,
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig