/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.clerk.dev"],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Enable static page generation for better SEO
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/calculate",
        destination: "/calculator",
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
};

module.exports = nextConfig;
