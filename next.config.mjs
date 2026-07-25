/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {},

  // Do NOT rewrite /api/* to the backend — that forwards browser Origin and
  // triggers CORS 403 on tailsguide.com. All /api/v1 traffic goes through
  // src/app/api/v1/[...path]/route.js (and specific auth-aware routes).

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tensorflow/tfjs": "@tensorflow/tfjs",
    };
    return config;
  },
};

export default nextConfig;
