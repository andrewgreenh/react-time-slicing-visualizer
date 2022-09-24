/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  pageExtensions: ["page.tsx", "page.ts", "api.ts"],
};

module.exports = nextConfig;
