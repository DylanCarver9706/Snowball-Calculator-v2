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
};

module.exports = nextConfig;
