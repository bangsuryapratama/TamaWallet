/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    allowedDevOrigins: ["192.168.150.219:3000", "localhost:3000"],
  },
};

export default nextConfig;
