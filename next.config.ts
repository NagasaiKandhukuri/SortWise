import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */


  
  // output: 'export', // because we want Vercel to build and serve dynamically
  
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 👇 Add this to disable the bottom-left dev tools UI
  devIndicators: false,
};


export default nextConfig;
