/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ['utfs.io']
  },

  experimental: {
    appDir: true, // ✅ Required for App Router
  },


};

module.exports = nextConfig;