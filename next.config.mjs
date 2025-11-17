/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ use the new key
  serverExternalPackages: ["lightweight-charts"],

  experimental: {
    // keep any other experimental flags you’re using here
  },
};

export default nextConfig;
