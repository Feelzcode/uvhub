/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // Optionally, you can specify pathname and port too:
        // pathname: '/photo-*',
        // port: '',
      },
      // Add other domains as needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
    // Optional: You can add more image optimization settings
    // formats: ['image/webp'],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Other Next.js configuration options can go here
};

module.exports = nextConfig;