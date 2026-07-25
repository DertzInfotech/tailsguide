/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {},

  async rewrites() {
    return {
      // fallback: run AFTER dynamic routes, so our API route for medical document (with auth) is hit first
      fallback: [
        {
          source: "/api/:path*",
          destination: "http://144.126.252.50:8084/api/:path*",
        },
      ],
    };
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
