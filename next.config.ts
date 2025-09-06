import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old French legal page names to new English ones
      {
        source: '/:lang/mentions-legales',
        destination: '/:lang/legal-notice',
        permanent: true,
      },
      {
        source: '/:lang/politique-confidentialite',
        destination: '/:lang/privacy-policy',
        permanent: true,
      },
      {
        source: '/:lang/conditions-utilisation',
        destination: '/:lang/terms-of-service',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
