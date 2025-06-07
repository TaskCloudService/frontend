/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pavadoblob.blob.core.windows.net',
      },
    ],
  },

  typescript: {
    // Temporarily disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
