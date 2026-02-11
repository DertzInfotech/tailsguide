/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {},

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://64.225.84.126:8084/api/:path*",
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tensorflow/tfjs": "@tensorflow/tfjs",
    };
    return config;
  },
};

export default nextConfig;
